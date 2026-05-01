"use client";

import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Reply { reply_type: string; }
interface QuestionCardProps {
  question: {
    id: string;
    slug: string;
    title: string;
    body?: string;
    ai_synthesis?: string;
    issue_tags: string[];
    reply_count: number;
    total_upvotes: number;
    quality_score: number;
    created_at: string;
    replies?: Reply[];
  };
  index?: number;
}

const REPLY_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  canon_synthesis: { label: "AI 종합",  color: "bg-violet-100 text-violet-700" },
  statesman:       { label: "🏛️ 명사",  color: "bg-blue-100 text-blue-700" },
  expert:          { label: "👨‍💼 전문가", color: "bg-emerald-100 text-emerald-700" },
  vanguard:        { label: "🪖 전위대", color: "bg-amber-100 text-amber-700" },
};

export function QuestionCard({ question, index = 0 }: QuestionCardProps) {
  const preview = question.ai_synthesis
    ? question.ai_synthesis.slice(0, 100) + "…"
    : question.body?.slice(0, 100) ?? "";

  const replyTypes = [...new Set((question.replies ?? []).map((r) => r.reply_type))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        href={`/agora/${question.slug}`}
        className="group block bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200 p-6"
      >
        {/* 이슈 태그 */}
        {question.issue_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {question.issue_tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 제목 */}
        <h2 className="text-slate-900 font-bold text-base leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
          {question.title}
        </h2>

        {/* AI 종합 프리뷰 */}
        {preview && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
            {preview}
          </p>
        )}

        {/* 답변 유형 배지 */}
        {replyTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {replyTypes.map((t) => (
              <span
                key={t}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${REPLY_TYPE_LABELS[t]?.color ?? "bg-slate-100 text-slate-500"}`}
              >
                {REPLY_TYPE_LABELS[t]?.label ?? t}
              </span>
            ))}
          </div>
        )}

        {/* 통계 푸터 */}
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {question.reply_count}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              {question.total_upvotes}
            </span>
            {question.quality_score > 0 && (
              <span className="flex items-center gap-1 text-violet-500">
                <Zap className="w-3.5 h-3.5" />
                {question.quality_score.toFixed(1)}
              </span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}
