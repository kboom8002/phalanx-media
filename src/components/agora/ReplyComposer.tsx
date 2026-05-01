"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, HelpCircle, Loader2, CheckCircle, X } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase-client";

interface ReplyComposerProps {
  questionId: string;
  parentReplyId?: string;         // 후속 질문 체인용
  mode?: "reply" | "follow_up";   // 모드 표시
  onSuccess?: (reply: { id: string; content: string; reply_type: string }) => void;
  onCancel?: () => void;
}

export function ReplyComposer({
  questionId,
  parentReplyId,
  mode = "reply",
  onSuccess,
  onCancel,
}: ReplyComposerProps) {
  const [content, setContent]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const textareaRef             = useRef<HTMLTextAreaElement>(null);

  const isFollowUp = mode === "follow_up" || !!parentReplyId;
  const replyType  = isFollowUp ? "follow_up" : "vanguard";
  const maxChars   = 800;
  const remaining  = maxChars - content.length;

  // 자동 높이 조절
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const ta = e.target;
    setContent(ta.value);
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 320)}px`;
    setError(null);
  }, []);

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;
    if (content.length > maxChars) { setError(`${maxChars}자 이하로 작성하세요`); return; }

    setLoading(true);
    setError(null);

    try {
      const sb = createBrowserClient();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { setError("로그인이 필요합니다"); setLoading(false); return; }

      const res = await fetch("/api/agora/replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          question_id:     questionId,
          parent_reply_id: parentReplyId ?? null,
          content:         content.trim(),
          reply_type:      replyType,
        }),
      });

      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "등록 실패"); return; }

      setSuccess(true);
      setContent("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      onSuccess?.(json.reply);

      // 2초 후 성공 상태 해제
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError("네트워크 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`rounded-2xl border-2 p-4 ${
        isFollowUp
          ? "border-slate-200 bg-slate-50"
          : "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
      }`}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        {isFollowUp
          ? <HelpCircle className="w-4 h-4 text-slate-500" />
          : <MessageSquare className="w-4 h-4 text-amber-600" />
        }
        <span className="text-xs font-bold text-slate-600">
          {isFollowUp ? "후속 질문 달기" : "🪖 전위대 답변 작성"}
        </span>
        <span className="ml-auto text-xs text-slate-400 font-mono">
          Ctrl+Enter로 제출
        </span>
        {onCancel && (
          <button onClick={onCancel} className="ml-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 텍스트에어리어 */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={loading || success}
        placeholder={
          isFollowUp
            ? "이 답변에 대한 후속 질문을 입력하세요..."
            : "근거 있는 답변을 작성하세요. 허위사실이나 혐오 표현은 삭제될 수 있습니다."
        }
        rows={3}
        className="w-full resize-none bg-white rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all leading-relaxed"
      />

      {/* 하단 바 */}
      <div className="flex items-center justify-between mt-2">
        {/* 글자 수 */}
        <span className={`text-xs font-mono ${remaining < 50 ? "text-rose-500 font-bold" : "text-slate-400"}`}>
          {remaining < maxChars ? `${remaining}자 남음` : `최대 ${maxChars}자`}
        </span>

        {/* 에러 */}
        <AnimatePresence>
          {error && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-rose-500 font-semibold"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || loading || success || remaining < 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            success
              ? "bg-emerald-500 text-white"
              : "bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white"
          }`}
        >
          {success  ? <CheckCircle className="w-4 h-4" /> :
           loading  ? <Loader2 className="w-4 h-4 animate-spin" /> :
                      <Send className="w-4 h-4" />}
          {success ? "등록됨" : loading ? "등록 중..." : "제출"}
        </button>
      </div>
    </motion.div>
  );
}
