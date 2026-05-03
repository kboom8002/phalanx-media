import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { DPOWidget } from "@/components/agora/DPOWidget";
import { VoteButtons } from "@/components/agora/VoteButtons";
import { AgoraInteractiveLayer } from "@/components/agora/AgoraInteractiveLayer";
import { Bot, Building2, GraduationCap, Sword, MessageSquare, Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 30;

// ─── 타입 ────────────────────────────────────────────────────────────────────
interface Reply {
  id: string;
  reply_type: string;
  content: string;
  upvotes: number;
  downvotes: number;
  elo_score: number;
  is_accepted: boolean;
  created_at: string;
  children?: Reply[];
}

interface Question {
  id: string;
  slug: string;
  title: string;
  body?: string;
  ai_synthesis?: string;
  issue_tags: string[];
  reply_count: number;
  total_upvotes: number;
  quality_score: number;
  best_reply_id?: string;
  created_at: string;
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: q } = await sb
    .from("agora_questions")
    .select("title, ai_synthesis")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  if (!q) return { title: "쟁점을 찾을 수 없습니다" };

  return {
    title: `${q.title} | 지식 아고라 — VQCP Statesman`,
    description: q.ai_synthesis?.slice(0, 155) ?? q.title,
  };
}

// ─── 데이터 패칭 ─────────────────────────────────────────────────────────────
async function getData(slug: string): Promise<{ question: Question; replies: Reply[]; dpoEnabled: boolean } | null> {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: question } = await sb
    .from("agora_questions")
    .select("*")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq("status", "open")
    .single();

  if (!question) return null;

  const { data: replies } = await sb
    .from("agora_replies")
    .select("*")
    .eq("question_id", question.id)
    .order("elo_score", { ascending: false });

  const roots = (replies ?? []).filter((r) => !r.parent_reply_id);
  const childMap: Record<string, Reply[]> = {};
  for (const r of replies ?? []) {
    if (r.parent_reply_id) {
      if (!childMap[r.parent_reply_id]) childMap[r.parent_reply_id] = [];
      childMap[r.parent_reply_id]!.push(r);
    }
  }
  const tree = roots.map((r) => ({ ...r, children: childMap[r.id] ?? [] }));
  const nonSynthesisCount = roots.filter((r) => r.reply_type !== "canon_synthesis").length;

  return { question, replies: tree, dpoEnabled: nonSynthesisCount >= 3 };
}

// ─── Reply 렌더러 ─────────────────────────────────────────────────────────────
const TYPE_META: Record<string, { icon: React.ReactNode; label: string; border: string; bg: string }> = {
  canon_synthesis: {
    icon:   <Bot className="w-4 h-4 text-violet-600" />,
    label:  "AI 종합",
    border: "border-violet-200",
    bg:     "bg-gradient-to-br from-violet-50 to-white",
  },
  statesman: {
    icon:   <Building2 className="w-4 h-4 text-blue-600" />,
    label:  "🏛️ 명사 공식",
    border: "border-blue-200",
    bg:     "bg-gradient-to-br from-blue-50 to-white",
  },
  expert: {
    icon:   <GraduationCap className="w-4 h-4 text-emerald-600" />,
    label:  "👨‍💼 전문가",
    border: "border-emerald-200",
    bg:     "bg-gradient-to-br from-emerald-50 to-white",
  },
  vanguard: {
    icon:   <Sword className="w-4 h-4 text-amber-600" />,
    label:  "🪖 전위대",
    border: "border-amber-200",
    bg:     "bg-white",
  },
  follow_up: {
    icon:   <MessageSquare className="w-4 h-4 text-slate-500" />,
    label:  "후속 질문",
    border: "border-slate-200",
    bg:     "bg-slate-50",
  },
};

function ReplyCard({ reply, isLoggedIn }: { reply: Reply; isLoggedIn: boolean }) {
  const meta = TYPE_META[reply.reply_type] ?? TYPE_META.vanguard!;

  return (
    <div className={`rounded-2xl border-2 ${meta.border} ${meta.bg} p-5`}>
      <div className="flex items-center gap-2 mb-3">
        {meta.icon}
        <span className="text-xs font-bold text-slate-600">{meta.label}</span>
        <span className="ml-auto text-xs text-slate-400 font-mono">ELO {Math.round(reply.elo_score)}</span>
        {reply.is_accepted && (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
            <Trophy className="w-3.5 h-3.5" /> Best Answer
          </span>
        )}
      </div>

      <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line mb-4">{reply.content}</p>

      <VoteButtons
        replyId={reply.id}
        initialUpvotes={reply.upvotes}
        initialDownvotes={reply.downvotes}
        isLoggedIn={isLoggedIn}
      />

      {/* 후속 질문 체인 */}
      {reply.children && reply.children.length > 0 && (
        <div className="mt-4 ml-4 pl-4 border-l-2 border-slate-200 space-y-3">
          {reply.children.map((child) => (
            <ReplyCard key={child.id} reply={child} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AgoraDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data) notFound();

  const { question, replies, dpoEnabled } = data;

  // QAPage JSON-LD
  const topReplies = replies.filter((r) => r.reply_type !== "follow_up").slice(0, 3);
  const qaSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name:        question.title,
      text:        question.body ?? question.title,
      dateCreated: question.created_at,
      answerCount: question.reply_count,
      upvoteCount: question.total_upvotes,
      ...(topReplies[0] && {
        acceptedAnswer: {
          "@type":      "Answer",
          text:         topReplies[0].content.slice(0, 500),
          upvoteCount:  topReplies[0].upvotes,
        },
      }),
      suggestedAnswer: topReplies.slice(1).map((r) => ({
        "@type": "Answer",
        text:    r.content.slice(0, 300),
      })),
    },
  };


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaSchema) }}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* 뒤로 */}
        <Link href="/agora" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> 아고라로 돌아가기
        </Link>

        {/* 질문 헤더 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {question.issue_tags.map((tag) => (
              <Link
                key={tag}
                href={`/agora?tag=${tag}`}
                className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
          <h1 className="text-2xl font-black text-slate-900 leading-snug mb-2">{question.title}</h1>
          {question.body && (
            <p className="text-slate-500 text-sm leading-relaxed">{question.body}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
            <span>{question.reply_count}개 답변</span>
            <span>👍 {question.total_upvotes}</span>
          </div>
        </div>

        {/* 답변 목록 */}
        <div className="space-y-4">
          {replies.map((reply) => (
            <ReplyCard key={reply.id} reply={reply} isLoggedIn={false} />
          ))}
        </div>

        {/* DPO 위젯 */}
        {dpoEnabled && (
          <DPOWidget
            questionId={question.id}
            replies={replies.flat()}
            isLoggedIn={false}
          />
        )}

        {/* 인터랙티브 레이어: 로그인 감지 + 답변 작성 + 후속 질문 */}
        <AgoraInteractiveLayer
          questionId={question.id}
          replies={replies}
        />
      </div>
    </>
  );
}
