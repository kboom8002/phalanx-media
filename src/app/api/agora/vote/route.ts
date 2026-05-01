import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ELO K 팩터
const K = 32;

function updateElo(winnerElo: number, loserElo: number): [number, number] {
  const expected = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  return [
    Math.round(winnerElo + K * (1 - expected)),
    Math.round(loserElo  + K * (0 - (1 - expected))),
  ];
}

// ─── POST /api/agora/vote ─────────────────────────────────────────────────────
export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });

  const sbUser = createClient(supabaseUrl, anonKey);
  const { data: { user }, error: authErr } = await sbUser.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: '인증 실패' }, { status: 401 });

  const sb   = createClient(supabaseUrl, serviceKey);
  const body = await req.json();

  // ── DPO 비교 투표 ────────────────────────────────────────────────────────
  if (body.dpo === true) {
    const { question_id, chosen_reply_id, rejected_reply_id } = body;
    if (!chosen_reply_id || !rejected_reply_id) {
      return NextResponse.json({ error: 'chosen/rejected reply_id 필요' }, { status: 400 });
    }

    // DPO 페어 저장
    const { error: dpoErr } = await sb.from('agora_dpo_pairs').insert({
      question_id,
      voter_id:         user.id,
      chosen_reply_id,
      rejected_reply_id,
    });
    if (dpoErr) return NextResponse.json({ error: dpoErr.message }, { status: 500 });

    // ELO 업데이트
    const { data: chosen  } = await sb.from('agora_replies').select('elo_score').eq('id', chosen_reply_id).single();
    const { data: rejected } = await sb.from('agora_replies').select('elo_score').eq('id', rejected_reply_id).single();

    if (chosen && rejected) {
      const [newChosen, newRejected] = updateElo(chosen.elo_score, rejected.elo_score);
      await sb.from('agora_replies').update({ elo_score: newChosen  }).eq('id', chosen_reply_id);
      await sb.from('agora_replies').update({ elo_score: newRejected }).eq('id', rejected_reply_id);
    }

    return NextResponse.json({ success: true, type: 'dpo' });
  }

  // ── 일반 👍👎 투표 ──────────────────────────────────────────────────────
  const { reply_id, vote_type } = body;
  if (!reply_id || !['up', 'down'].includes(vote_type)) {
    return NextResponse.json({ error: 'reply_id + vote_type(up|down) 필요' }, { status: 400 });
  }

  // 중복 투표 확인
  const { data: existing } = await sb
    .from('agora_votes')
    .select('id, vote_type')
    .eq('reply_id', reply_id)
    .eq('voter_id', user.id)
    .single();

  if (existing) {
    if (existing.vote_type === vote_type) {
      // 동일 투표 취소
      await sb.from('agora_votes').delete().eq('id', existing.id);
      const col = vote_type === 'up' ? 'upvotes' : 'downvotes';
      const { data: reply } = await sb.from('agora_replies').select(col).eq('id', reply_id).single();
      if (reply) {
        await sb.from('agora_replies').update({ [col]: Math.max(0, (reply as any)[col] - 1) }).eq('id', reply_id);
      }
      return NextResponse.json({ success: true, action: 'cancelled' });
    } else {
      // 투표 변경
      await sb.from('agora_votes').update({ vote_type }).eq('id', existing.id);
    }
  } else {
    // 신규 투표
    await sb.from('agora_votes').insert({ reply_id, voter_id: user.id, vote_type });
  }

  // upvotes / downvotes 갱신
  const { data: counts } = await sb
    .from('agora_votes')
    .select('vote_type')
    .eq('reply_id', reply_id);

  const upvotes   = counts?.filter((v) => v.vote_type === 'up').length   ?? 0;
  const downvotes = counts?.filter((v) => v.vote_type === 'down').length  ?? 0;

  await sb.from('agora_replies').update({ upvotes, downvotes }).eq('id', reply_id);

  // question total_upvotes 갱신
  const { data: reply } = await sb.from('agora_replies').select('question_id').eq('id', reply_id).single();
  if (reply && vote_type === 'up') {
    const { data: q } = await sb.from('agora_questions').select('total_upvotes').eq('id', reply.question_id).single();
    if (q) {
      await sb.from('agora_questions').update({
        total_upvotes: (q.total_upvotes ?? 0) + (existing ? 0 : 1),
      }).eq('id', reply.question_id);
    }
  }

  return NextResponse.json({ success: true, upvotes, downvotes });
}
