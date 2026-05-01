import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { QuestionCard } from "@/components/agora/QuestionCard";
import { Sword, Search, PenLine } from "lucide-react";
import Link from "next/link";

export const revalidate = 60; // 1분 ISR

export const metadata: Metadata = {
  title: "지식 아고라 — 쟁점 공론장 | VQCP Statesman",
  description: "AI와 전문가, 시민이 함께 정치 쟁점을 토론하는 공론장. 주요 이슈에 대한 균형 잡힌 답변을 찾아보세요.",
  openGraph: {
    title: "지식 아고라 — 쟁점 공론장",
    description: "AI와 전문가, 시민이 함께 쟁점을 토론합니다.",
    type: "website",
  },
};

const ISSUE_TAGS = ["전체", "경제", "외교", "안보", "복지", "선거", "당정", "총리", "대표"];

async function getQuestions(tag?: string, sort = "created_at") {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let q = sb
    .from("agora_questions")
    .select("id, slug, title, body, ai_synthesis, issue_tags, reply_count, total_upvotes, quality_score, created_at")
    .eq("status", "open")
    .order(
      sort === "popular" ? "total_upvotes" : sort === "replies" ? "reply_count" : "created_at",
      { ascending: false }
    )
    .limit(30);

  if (tag && tag !== "전체") q = q.contains("issue_tags", [tag]);

  const { data } = await q;
  return data ?? [];
}

export default async function AgoraPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; sort?: string }>;
}) {
  const { tag, sort = "created_at" } = await searchParams;
  const questions = await getQuestions(tag, sort);

  // JSON-LD: FAQPage (상위 10개)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.slice(0, 10).map((q) => ({
      "@type": "Question",
      name:   q.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.ai_synthesis ?? q.body ?? "",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <Sword className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">지식 아고라</h1>
          </div>
          <p className="text-slate-500 text-base max-w-xl">
            AI와 전문가, 시민이 함께 정치 쟁점을 탐구합니다.
            답변에 참여하여 더 나은 공론장을 만들어주세요.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바 */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sticky top-20">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">이슈 태그</h2>
              <div className="space-y-1">
                {ISSUE_TAGS.map((t) => {
                  const active = (!tag && t === "전체") || tag === t;
                  return (
                    <Link
                      key={t}
                      href={t === "전체" ? "/agora" : `/agora?tag=${t}`}
                      className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        active
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {t}
                    </Link>
                  );
                })}
              </div>

              <hr className="my-4 border-slate-100" />

              <Link
                href="/agora/ask"
                className="flex items-center gap-2 w-full px-3 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
              >
                <PenLine className="w-4 h-4" />
                쟁점 질문하기
              </Link>
            </div>
          </aside>

          {/* 메인 */}
          <div className="flex-1">
            {/* 정렬 바 */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-900">{questions.length}</span>개 쟁점
              </p>
              <div className="flex gap-1">
                {[
                  { value: "created_at", label: "최신순" },
                  { value: "popular",    label: "인기순" },
                  { value: "replies",    label: "답변많은순" },
                ].map((s) => (
                  <Link
                    key={s.value}
                    href={`/agora?${tag ? `tag=${tag}&` : ""}sort=${s.value}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      sort === s.value
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-24 text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-semibold">아직 쟁점이 없습니다</p>
                <p className="text-sm mt-1">첫 번째 쟁점 질문을 올려보세요</p>
                <Link
                  href="/agora/ask"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold"
                >
                  <PenLine className="w-4 h-4" /> 질문하기
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions.map((q, i) => (
                  <QuestionCard key={q.id} question={q} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
