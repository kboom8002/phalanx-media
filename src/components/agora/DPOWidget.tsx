"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, ChevronRight } from "lucide-react";

interface Reply {
  id: string;
  content: string;
  reply_type: string;
  elo_score: number;
  upvotes: number;
}

interface DPOWidgetProps {
  questionId: string;
  replies: Reply[];
  isLoggedIn: boolean;
  onLoginRequired?: () => void;
}

const TYPE_LABEL: Record<string, string> = {
  canon_synthesis: "🤖 AI 종합",
  statesman:       "🏛️ 명사",
  expert:          "👨‍💼 전문가",
  vanguard:        "💬 시민 참여자",
};

export function DPOWidget({ questionId, replies, isLoggedIn, onLoginRequired }: DPOWidgetProps) {
  const [pairIndex, setPairIndex]   = useState(0);
  const [chosen,    setChosen]      = useState<string | null>(null);
  const [loading,   setLoading]     = useState(false);
  const [votes,     setVotes]       = useState(0);

  // 비교 가능한 루트 답변만 선택 (canon_synthesis 제외 가능하지만 포함해도 OK)
  const candidates = replies.filter((r) => r.content.length > 30);
  if (candidates.length < 2) return null;

  // 랜덤 페어 생성 (pairIndex 기반)
  const i = pairIndex % candidates.length;
  const j = (pairIndex + 1) % candidates.length;
  const A = candidates[i]!;
  const B = candidates[j]!;

  const handleChoose = async (chosenId: string, rejectedId: string) => {
    if (!isLoggedIn) { onLoginRequired?.(); return; }
    if (loading || chosen) return;

    setChosen(chosenId);
    setLoading(true);

    try {
      const token = (await import("@/lib/supabase-client")).getSession();
      await fetch("/api/agora/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ dpo: true, question_id: questionId, chosen_reply_id: chosenId, rejected_reply_id: rejectedId }),
      });
    } catch { /* 무시 */ } finally {
      setLoading(false);
      setVotes((v) => v + 1);
    }
  };

  const nextPair = () => {
    setChosen(null);
    setPairIndex((i) => i + 2);
  };

  return (
    <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl border border-violet-200 p-6 my-6">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-violet-600" />
        <h3 className="font-bold text-violet-900 text-sm">어느 답변이 더 설득력 있습니까?</h3>
        <span className="ml-auto text-xs text-violet-400 font-mono">{votes}건 평가 참여</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[A, B].map((reply, idx) => {
          const isChosen   = chosen === reply.id;
          const isRejected = chosen && chosen !== reply.id;
          return (
            <motion.button
              key={reply.id}
              onClick={() => handleChoose(reply.id, idx === 0 ? B.id : A.id)}
              disabled={!!chosen || loading}
              animate={{
                scale:   isChosen ? 1.02 : isRejected ? 0.98 : 1,
                opacity: isRejected ? 0.5 : 1,
              }}
              className={`text-left p-4 rounded-xl border-2 transition-all text-sm leading-relaxed ${
                isChosen
                  ? "border-violet-500 bg-violet-100 shadow-md"
                  : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  idx === 0 ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  {idx === 0 ? "A" : "B"} — {TYPE_LABEL[reply.reply_type] ?? reply.reply_type}
                </span>
              </div>
              <p className="text-slate-700 line-clamp-4">{reply.content}</p>
              {isChosen && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-violet-700 font-bold text-xs"
                >
                  ✓ 선택됨 — 의견 반영 완료
                </motion.p>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {chosen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex justify-end"
          >
            <button
              onClick={nextPair}
              className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors"
            >
              다음 의견 비교 <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
