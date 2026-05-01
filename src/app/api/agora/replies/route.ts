import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ─── POST /api/agora/replies ──────────────────────────────────────────────────
export async function POST(req: Request) {
  // 인증
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });

  const sbUser = createClient(supabaseUrl, anonKey);
  const { data: { user }, error: authErr } = await sbUser.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: '인증 실패' }, { status: 401 });

  const body = await req.json();
  const { question_id, parent_reply_id, content, reply_type = 'vanguard', source_fact_card_id } = body;

  if (!question_id) return NextResponse.json({ error: 'question_id 필요' }, { status: 400 });
  if (!content?.trim()) return NextResponse.json({ error: '내용을 입력하세요' }, { status: 400 });

  const sb = createClient(supabaseUrl, serviceKey);

  // 질문 존재 확인
  const { data: question } = await sb
    .from('agora_questions')
    .select('id, status')
    .eq('id', question_id)
    .single();

  if (!question || question.status !== 'open') {
    return NextResponse.json({ error: '해당 쟁점에 답변할 수 없습니다' }, { status: 403 });
  }

  const { data: reply, error: insertErr } = await sb
    .from('agora_replies')
    .insert({
      question_id,
      parent_reply_id:     parent_reply_id ?? null,
      author_id:           user.id,
      reply_type,
      content:             content.trim(),
      source_fact_card_id: source_fact_card_id ?? null,
    })
    .select()
    .single();

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

  return NextResponse.json({ reply }, { status: 201 });
}
