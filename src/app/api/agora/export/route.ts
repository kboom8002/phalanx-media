import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: Request) {
  const auth = req.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') ?? 'all'; // sft | dpo | all
  const sb   = createClient(supabaseUrl, serviceKey);

  const lines: string[] = [];

  // SFT: narrative_journeys 뷰 추출
  if (type === 'sft' || type === 'all') {
    const { data: journeys } = await sb
      .from('narrative_journeys')
      .select('*')
      .gte('quality_score', 0);

    for (const j of journeys ?? []) {
      const messages: Array<{ role: string; content: string }> = [
        { role: 'system', content: '당신은 한국 정치 이슈에 대한 공정한 분석가입니다.' },
        { role: 'user',   content: j.initial_question },
      ];
      if (j.ai_initial_answer) {
        messages.push({ role: 'assistant', content: j.ai_initial_answer });
      }
      for (const turn of j.conversation_turns ?? []) {
        messages.push({
          role: turn.type === 'follow_up' ? 'user' : 'assistant',
          content: turn.content,
        });
      }
      lines.push(JSON.stringify({ __type: 'sft', messages }));
    }
  }

  // DPO: agora_dpo_pairs 추출
  if (type === 'dpo' || type === 'all') {
    const { data: pairs } = await sb
      .from('agora_dpo_pairs')
      .select(`
        question_id,
        agora_questions!question_id (title),
        chosen:agora_replies!chosen_reply_id (content),
        rejected:agora_replies!rejected_reply_id (content)
      `)
      .limit(1000);

    for (const p of pairs ?? []) {
      const q = (p.agora_questions as any);
      const c = (p.chosen as any);
      const r = (p.rejected as any);
      if (!q?.title || !c?.content || !r?.content) continue;
      lines.push(JSON.stringify({
        __type: 'dpo',
        prompt:    q.title,
        chosen:    c.content,
        rejected:  r.content,
      }));
    }
  }

  const jsonl = lines.join('\n');
  return new Response(jsonl, {
    headers: {
      'Content-Type':        'application/x-ndjson',
      'Content-Disposition': `attachment; filename="agora_training_${type}_${Date.now()}.jsonl"`,
    },
  });
}
