"use client";

import { useState, useCallback } from "react";
import { ThumbsUp, ThumbsDown, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoteButtonsProps {
  replyId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  userVote?: "up" | "down" | null;
  isLoggedIn: boolean;
  onLoginRequired?: () => void;
}

export function VoteButtons({
  replyId,
  initialUpvotes,
  initialDownvotes,
  userVote: initialVote = null,
  isLoggedIn,
  onLoginRequired,
}: VoteButtonsProps) {
  const [upvotes,   setUpvotes]   = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [myVote,    setMyVote]    = useState<"up" | "down" | null>(initialVote);
  const [loading,   setLoading]   = useState(false);

  const vote = useCallback(async (type: "up" | "down") => {
    if (!isLoggedIn) { onLoginRequired?.(); return; }
    if (loading) return;

    // Optimistic update
    const prev = myVote;
    if (myVote === type) {
      setMyVote(null);
      type === "up" ? setUpvotes((v) => v - 1) : setDownvotes((v) => v - 1);
    } else {
      if (myVote === "up") setUpvotes((v) => v - 1);
      if (myVote === "down") setDownvotes((v) => v - 1);
      setMyVote(type);
      type === "up" ? setUpvotes((v) => v + 1) : setDownvotes((v) => v + 1);
    }

    setLoading(true);
    try {
      const token = (await import("@/lib/supabase-client")).getSession();
      const res = await fetch("/api/agora/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply_id: replyId, vote_type: type }),
      });
      if (!res.ok) {
        // 롤백
        setMyVote(prev);
        setUpvotes(initialUpvotes);
        setDownvotes(initialDownvotes);
      }
    } catch {
      setMyVote(prev);
      setUpvotes(initialUpvotes);
      setDownvotes(initialDownvotes);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, loading, myVote, replyId, initialUpvotes, initialDownvotes, onLoginRequired]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => vote("up")}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
          myVote === "up"
            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
            : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
        }`}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        <AnimatePresence mode="wait">
          <motion.span
            key={upvotes}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {upvotes}
          </motion.span>
        </AnimatePresence>
      </button>

      <button
        onClick={() => vote("down")}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
          myVote === "down"
            ? "bg-rose-600 text-white shadow-md shadow-rose-200"
            : "bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
        }`}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
        <AnimatePresence mode="wait">
          <motion.span
            key={downvotes}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {downvotes}
          </motion.span>
        </AnimatePresence>
      </button>

      {!isLoggedIn && (
        <button
          onClick={onLoginRequired}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors"
        >
          <LogIn className="w-3 h-3" />
          로그인 후 투표
        </button>
      )}
    </div>
  );
}
