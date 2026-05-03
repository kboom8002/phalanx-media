"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Hash, Loader2, CheckCircle, Search, ChevronRight, ArrowLeft, Lightbulb } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase-client";
import Link from "next/link";

const ISSUE_TAGS = ["경제", "외교", "안보", "복지", "선거", "당정", "총리", "대표", "예산", "개헌"];

interface SimilarQuestion {
  id: string;
  slug: string;
  title: string;
  reply_count: number;
}

export default function AgoraAskPage() {
  const [title,    setTitle]    = useState("");
  const [body,     setBody]     = useState("");
  const [tags,     setTags]     = useState<string[]>([]);
  const [similar,  setSimilar]  = useState<SimilarQuestion[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [checking, setChecking] = useState(false);
  const [done,     setDone]     = useState<{ slug: string } | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 로그인 상태 확인
  useEffect(() => {
    createBrowserClient().auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  // 유사 질문 실시간 검색 (300ms debounce)
  const handleTitleChange = useCallback((val: string) => {
    setTitle(val);
    setError(null);
    setSimilar([]);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 8) return;

    debounceRef.current = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch(
          `/api/agora/questions?limit=3&sort=created_at`,
          { headers: { "Content-Type": "application/json" } }
        );
        const json = await res.json();
        // 제목 유사도 필터 (클라이언트 측 간이 검색)
        const keyword = val.trim().slice(0, 12).toLowerCase();
        const filtered = (json.questions ?? []).filter(
          (q: SimilarQuestion) => q.title.toLowerCase().includes(keyword)
        );
        setSimilar(filtered);
      } catch { /* 무시 */ } finally {
        setChecking(false);
      }
    }, 300);
  }, []);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 4)
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) { setError("제목을 입력하세요"); return; }
    if (title.length < 10) { setError("제목을 10자 이상 입력하세요"); return; }
    if (!isLoggedIn) { setError("로그인이 필요합니다"); return; }

    setLoading(true);
    setError(null);

    try {
      const sb = createBrowserClient();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { setError("로그인이 필요합니다"); setLoading(false); return; }

      const res = await fetch("/api/agora/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ title: title.trim(), body: body.trim() || undefined, issue_tags: tags }),
      });

      const json = await res.json();

      if (!res.ok) { setError(json.error ?? "등록 실패"); return; }
      if (json.duplicate) {
        setSimilar(json.similar ?? []);
        setError("유사한 쟁점이 이미 있습니다. 아래 목록을 확인해보세요.");
        return;
      }

      setDone({ slug: json.question.slug });
    } catch {
      setError("네트워크 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  // ── 제출 완료 화면 ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">쟁점이 등록되었습니다!</h1>
          <p className="text-slate-500 text-sm mb-8">
            AI 종합 답변이 자동으로 생성되었습니다. 전위대 요원들의 답변을 기다려보세요.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/agora/${done.slug}`}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-colors"
            >
              내 쟁점 보기 →
            </Link>
            <Link
              href="/agora"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
            >
              아고라 목록
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* 뒤로 */}
      <Link href="/agora" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> 아고라로 돌아가기
      </Link>

      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <PenLine className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">쟁점 질문하기</h1>
        </div>
        <p className="text-slate-500 text-sm">
          정치 이슈에 대한 쟁점을 올리면 AI와 전문가, 전위대 요원들이 다양한 관점으로 답변합니다.
        </p>
      </div>

      {/* 로그인 필요 배너 */}
      <AnimatePresence>
        {isLoggedIn === false && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-3"
          >
            <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">전위대 로그인이 필요합니다</p>
              <p className="text-xs text-amber-700">쟁점 제출은 전위대 요원만 가능합니다.</p>
            </div>
            <Link
              href="http://localhost:3000/v-dash"
              className="flex-shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white rounded-lg text-xs font-bold transition-colors"
            >
              합류하기 →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* 제목 입력 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            쟁점 질문 <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              maxLength={120}
              placeholder="예: 김민석 총리의 경제 정책은 효과가 있다고 보십니까?"
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none text-slate-900 text-sm transition-colors"
            />
            {checking && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
            )}
            {!checking && title.length > 0 && (
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">{title.length}/120 · 질문 형식으로 작성하면 더 좋은 답변을 받을 수 있습니다</p>

          {/* 유사 질문 */}
          <AnimatePresence>
            {similar.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden"
              >
                <p className="text-xs font-bold text-amber-700 px-3 pt-3 pb-1">유사한 쟁점이 있습니다 — 먼저 확인해보세요</p>
                {similar.map((q) => (
                  <Link
                    key={q.id}
                    href={`/agora/${q.slug}`}
                    className="flex items-center justify-between px-3 py-2.5 hover:bg-amber-100 transition-colors border-t border-amber-100 first:border-0"
                  >
                    <span className="text-sm text-slate-700 line-clamp-1">{q.title}</span>
                    <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                      <span className="text-xs text-slate-400">{q.reply_count}개 답변</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 상세 내용 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            상세 설명 <span className="text-slate-400 font-normal">(선택)</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="질문의 배경이나 맥락을 추가로 설명해주세요..."
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none text-slate-800 text-sm resize-none transition-colors leading-relaxed"
          />
          <p className="text-xs text-slate-400 mt-1">{body.length}/500</p>
        </div>

        {/* 이슈 태그 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            <Hash className="inline w-3.5 h-3.5 mr-1" />
            이슈 태그 <span className="text-slate-400 font-normal">(최대 4개)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {ISSUE_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  tags.includes(tag)
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* 에러 */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-rose-600 font-semibold"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 제출 */}
        <button
          onClick={handleSubmit}
          disabled={loading || !title.trim() || isLoggedIn === false}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-lg shadow-amber-200 text-base"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PenLine className="w-5 h-5" />}
          {loading ? "AI 종합 답변 생성 중..." : "쟁점 등록하기"}
        </button>

        <p className="text-xs text-center text-slate-400">
          제출 즉시 GPT-4o가 AI 종합 답변을 자동 생성합니다.
          허위사실·혐오 표현이 포함된 질문은 관리자에 의해 숨김 처리될 수 있습니다.
        </p>
      </div>
    </div>
  );
}
