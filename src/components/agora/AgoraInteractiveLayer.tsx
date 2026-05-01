"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, HelpCircle, LogIn, PenLine } from "lucide-react";
import { ReplyComposer } from "@/components/agora/ReplyComposer";
import { createBrowserClient } from "@/lib/supabase-client";

interface Reply {
  id: string;
  content: string;
  reply_type: string;
}

interface AgoraInteractiveLayerProps {
  questionId: string;
  replies: Reply[];                    // 초기 서버 렌더 답변 목록
  onReplyAdded?: (r: Reply) => void;   // 부모에게 새 답변 알림 (선택)
}

export function AgoraInteractiveLayer({ questionId }: AgoraInteractiveLayerProps) {
  const [isLoggedIn, setIsLoggedIn]       = useState<boolean | null>(null);
  const [showComposer, setShowComposer]   = useState(false);
  const [composerMode, setComposerMode]   = useState<"reply" | "follow_up">("reply");
  const [parentReplyId, setParentId]      = useState<string | undefined>();
  const [localReplies, setLocalReplies]   = useState<Reply[]>([]);

  useEffect(() => {
    createBrowserClient().auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  const openComposer = (mode: "reply" | "follow_up", parentId?: string) => {
    setComposerMode(mode);
    setParentId(parentId);
    setShowComposer(true);
    setTimeout(() => {
      document.getElementById("reply-composer-anchor")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReplySuccess = (reply: Reply) => {
    setLocalReplies((prev) => [...prev, reply]);
    setShowComposer(false);
  };

  return (
    <div className="mt-8">
      {/* 새로 추가된 답변 (Optimistic) */}
      <AnimatePresence>
        {localReplies.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-700">🪖 전위대 · 방금 등록됨</span>
            </div>
            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">{r.content}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 답변/후속질문 CTA 버튼 그룹 */}
      <div id="reply-composer-anchor" className="flex flex-wrap gap-3 mb-4">
        {isLoggedIn === true && (
          <>
            <button
              onClick={() => openComposer("reply")}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              답변 작성하기
            </button>
            <button
              onClick={() => openComposer("follow_up")}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              후속 질문 달기
            </button>
          </>
        )}

        {isLoggedIn === false && (
          <a
            href="http://localhost:3000/v-dash"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-800 to-blue-800 hover:from-slate-700 hover:to-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md"
          >
            <LogIn className="w-4 h-4" />
            전위대 합류 후 답변하기
          </a>
        )}

        {isLoggedIn === null && (
          <div className="h-10 w-40 rounded-xl bg-slate-100 animate-pulse" />
        )}
      </div>

      {/* 인라인 ReplyComposer */}
      <AnimatePresence>
        {showComposer && (
          <ReplyComposer
            questionId={questionId}
            parentReplyId={parentReplyId}
            mode={composerMode}
            onSuccess={handleReplySuccess}
            onCancel={() => setShowComposer(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
