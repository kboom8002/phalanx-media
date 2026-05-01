import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openai      = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const sb   = createClient(supabaseUrl, serviceKey);
  const body = await req.json().catch(() => ({}));
  const limit = Math.min(body.limit ?? 10, 30);

  const { data: cards } = await sb
    .from('fact_cards')
    .select('id, canonical_question, answer')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  const seeded: string[] = [];
  const errors: string[] = [];

  for (const card of cards ?? []) {
    if (!card.canonical_question) continue;

    const { data: dup } = await sb
      .from('agora_questions')
      .select('id')
      .eq('source_fact_card_id', card.id)
      .single();
    if (dup) continue;

    let ai_synthesis = card.answer ?? '';
    try {
      const res = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.3,
        max_tokens: 400,
        messages: [
          { role: 'system', content: '한국 정치 이슈 분석가. 공식 팩트 기반 균형잡힌 종합 답변을 300자 이내로 작성.' },
          { role: 'user', content: `질문: ${card.canonical_question}\n공식 입장: ${card.answer}` },
        ],
      });
      ai_synthesis = res.choices[0].message.content ?? card.answer ?? '';
    } catch { /* 원본 사용 */ }

    const slug = card.canonical_question
      .replace(/[^\w\s가-힣]/g, '').replace(/\s+/g, '-').slice(0, 60)
      + '-' + Date.now().toString(36);

    const { data: q, error } = await sb
      .from('agora_questions')
      .insert({ slug, title: card.canonical_question, ai_synthesis, source_fact_card_id: card.id, status: 'open' })
      .select('id, title').single();

    if (error) { errors.push(card.canonical_question); continue; }

    await sb.from('agora_replies').insert({
      question_id: q.id,
      reply_type:  'canon_synthesis',
      content:     ai_synthesis,
    });
    seeded.push(q.title);
  }

  return NextResponse.json({ success: true, seeded: seeded.length, errors: errors.length, titles: seeded });
}
