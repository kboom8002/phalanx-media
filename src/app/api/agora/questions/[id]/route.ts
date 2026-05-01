import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ─── GET /api/agora/questions/[id] ───────────────────────────────────────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sb = createClient(supabaseUrl, anonKey);

  // 질문 본문
  const { data: question, error: qErr } = await sb
    .from('agora_questions')
    .select('*')
    .or(`id.eq.${id},slug.eq.${id}`)
    .eq('status', 'open')
    .single();

  if (qErr || !question) {
    return NextResponse.json({ error: '쟁점을 찾을 수 없습니다' }, { status: 404 });
  }

  // 답변 + 후속질문 (ELO 내림차순)
  const { data: replies, error: rErr } = await sb
    .from('agora_replies')
    .select('*')
    .eq('question_id', question.id)
    .order('elo_score', { ascending: false });

  if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 });

  // 트리 구조로 변환: 루트 답변 + 후속질문 체인
  const rootReplies = replies?.filter((r) => !r.parent_reply_id) ?? [];
  const childMap: Record<string, typeof replies> = {};

  for (const r of replies ?? []) {
    if (r.parent_reply_id) {
      if (!childMap[r.parent_reply_id]) childMap[r.parent_reply_id] = [];
      childMap[r.parent_reply_id]!.push(r);
    }
  }

  const tree = rootReplies.map((r) => ({
    ...r,
    children: childMap[r.id] ?? [],
  }));

  // DPO 활성화 여부 (canon_synthesis 제외 루트 답변 3개 이상)
  const nonSynthesisCount = rootReplies.filter((r) => r.reply_type !== 'canon_synthesis').length;
  const dpoEnabled = nonSynthesisCount >= 3;

  return NextResponse.json({ question, replies: tree, dpoEnabled });
}
