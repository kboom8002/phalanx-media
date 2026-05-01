import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openai      = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function slug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80) + '-' + Date.now().toString(36);
}

// ─── GET /api/agora/questions ─────────────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tag    = searchParams.get('tag');
  const sort   = searchParams.get('sort') ?? 'created_at';
  const page   = parseInt(searchParams.get('page') ?? '1');
  const limit  = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
  const offset = (page - 1) * limit;

  const sb = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  let query = sb
    .from('agora_questions')
    .select('id, slug, title, body, issue_tags, ai_synthesis, reply_count, total_upvotes, quality_score, created_at', { count: 'exact' })
    .eq('status', 'open')
    .range(offset, offset + limit - 1);

  if (tag) query = query.contains('issue_tags', [tag]);

  const orderCol = sort === 'popular' ? 'total_upvotes'
                 : sort === 'replies' ? 'reply_count'
                 : 'created_at';
  query = query.order(orderCol, { ascending: false });

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ questions: data, total: count, page, limit });
}

// ─── POST /api/agora/questions ────────────────────────────────────────────────
export async function POST(req: Request) {
  const sb = createClient(supabaseUrl, serviceKey);

  // 인증 확인 (anon key로 user 검증)
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });

  const sbUser = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: { user }, error: authErr } = await sbUser.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: '인증 실패' }, { status: 401 });

  const body = await req.json();
  const { title, body: qBody, issue_tags = [] } = body;

  if (!title?.trim()) return NextResponse.json({ error: '제목을 입력하세요' }, { status: 400 });

  // 유사 질문 중복 체크 (제목 포함 검색)
  const { data: existing } = await sb
    .from('agora_questions')
    .select('id, slug, title')
    .ilike('title', `%${title.slice(0, 20)}%`)
    .eq('status', 'open')
    .limit(3);

  if (existing && existing.length > 0) {
    return NextResponse.json({ duplicate: true, similar: existing }, { status: 200 });
  }

  // GPT-4o로 AI 종합 답변 자동 생성
  let ai_synthesis = '';
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.4,
      max_tokens: 600,
      messages: [
        {
          role: 'system',
          content: `당신은 한국 정치 이슈에 대한 공정하고 균형 잡힌 AI 분석가입니다.
질문에 대해 다양한 관점을 종합하여 300~500자의 객관적인 분석 답변을 제공합니다.
근거 없는 주장이나 특정 정파 편향 없이 사실 중심으로 작성하세요.`,
        },
        {
          role: 'user',
          content: `쟁점 질문: ${title}\n\n${qBody ?? ''}`,
        },
      ],
    });
    ai_synthesis = completion.choices[0].message.content ?? '';
  } catch (e) {
    console.error('[agora/seed] GPT-4o 실패:', e);
  }

  // INSERT
  const { data: question, error: insertErr } = await sb
    .from('agora_questions')
    .insert({
      slug:         slug(title),
      title:        title.trim(),
      body:         qBody?.trim() ?? null,
      issue_tags,
      ai_synthesis,
      status:       'open',
      created_by:   user.id,
    })
    .select()
    .single();

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

  // AI 합성 답변을 첫 번째 reply로 자동 등록
  if (ai_synthesis) {
    await sb.from('agora_replies').insert({
      question_id: question.id,
      reply_type:  'canon_synthesis',
      content:     ai_synthesis,
      author_id:   null,
    });
  }

  // QIS Inbound Pipeline (OS로 전송)
  const osUrl = process.env.NEXT_PUBLIC_OS_URL || "http://localhost:3000";
  try {
    await fetch(`${osUrl}/api/qis/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: title.trim(),
        context: qBody?.trim(),
        author_name: user.email,
        tenant_id: "phalanx" // 기본적으로 phalanx 사용, 추후 쿠키 파싱
      })
    });
    console.log('[QIS] Inbound signal sent to OS');
  } catch (err) {
    console.error('[QIS] Failed to send inbound signal', err);
  }

  return NextResponse.json({ question }, { status: 201 });
}
