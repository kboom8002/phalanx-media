import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { BookOpen, Calendar, ArrowRight, TrendingUp, GitMerge, Badge } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "국가전략 노트 (The Canon) | VQCP Statesman",
  description: "김민석의 국가 운영 철학과 구체적 정책 대안, 그리고 전위대 집단지성 파생글을 매주 연재합니다.",
};

export const revalidate = 30;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

const MOCK_CHAPTERS = [
  {
    id: "v1-chapter-1",
    vol: "Vol. 1 국가의 뼈대",
    title: "왜 다시 당정분리인가: 권력의 분산과 책임의 집중",
    excerpt: "대통령과 여당이 혼연일체가 되어야 국정이 안정된다는 것은 환상이다. 권력이 한 곳으로 집중될수록 작은 충격에도 국가 전체가 흔들리는 구조적 취약성을 갖게 된다...",
    date: "2026. 04. 15",
    readTime: "7 min read",
    isNew: true,
    followUpCount: 3,
  },
  {
    id: "v1-chapter-2",
    vol: "Vol. 1 국가의 뼈대",
    title: "K-컬처 시대의 문화 관료주의 타파",
    excerpt: "문화는 통제의 대상이 아니라 지원의 대상이라는 명제는 20년 전의 낡은 철학이다. 이제는 지원 구조 자체를 민간의 속도에 맞게 뜯어고치는 '구조 개혁'이 필요하다.",
    date: "2026. 04. 08",
    readTime: "6 min read",
    isNew: false,
    followUpCount: 0,
  },
  {
    id: "v1-chapter-3",
    vol: "Vol. 1 국가의 뼈대",
    title: "저출산 예산의 재구조화: 현금 살포에서 인프라 구축으로",
    excerpt: "모든 지자체가 경쟁적으로 출산 장려금을 올리고 있다. 그러나 수십 조 원의 예산이 투입되었음에도 합계출산율은 반등하지 않았다. 우리는 진단부터 틀렸다.",
    date: "2026. 04. 01",
    readTime: "9 min read",
    isNew: false,
    followUpCount: 0,
  },
];

export default async function CanonListPage() {
  // Fetch garrison post counts per canon chapter
  const { data: postCounts } = await supabase
    .from("garrison_posts")
    .select("seed_canon_id")
    .not("seed_canon_id", "is", null);

  const countMap: Record<string, number> = {};
  (postCounts || []).forEach((p: { seed_canon_id: string }) => {
    countMap[p.seed_canon_id] = (countMap[p.seed_canon_id] || 0) + 1;
  });

  const chapters = MOCK_CHAPTERS.map((ch) => ({
    ...ch,
    followUpCount: countMap[ch.id] ?? ch.followUpCount,
  }));

  const totalFollowUps = Object.values(countMap).reduce((a, b) => a + b, 0) || 3;

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Editorial Header */}
      <header className="pt-20 pb-16 px-4 text-center border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold tracking-widest text-xs uppercase mb-6">
            <BookOpen className="w-4 h-4" />
            <span>The Statesman&apos;s Log</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 font-serif">
            국가전략 노트
          </h1>
          <p className="text-lg text-slate-600 font-light leading-relaxed mb-8">
            단편적인 해명을 넘어, 국가 운영의 굵직한 철학과 구체적 정책 대안을
            <br className="hidden md:block" />
            매주 수요일 저녁, 독자들과 전위대 요원들 앞에 공개합니다.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
              <Calendar className="w-4 h-4" /> 매주 수요일 20:00 연재
            </span>
            <span className="inline-flex items-center gap-2 bg-fuchsia-50 border border-fuchsia-100 text-fuchsia-700 px-4 py-2 rounded-full text-sm font-medium">
              <GitMerge className="w-4 h-4" /> 전위대 파생글 총 {totalFollowUps}건
            </span>
          </div>
        </div>
      </header>

      {/* Chapters Feed */}
      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-16 flex flex-col">
          {chapters.map((ch, idx) => (
            <article key={ch.id} className="group relative">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-4 font-mono">
                <span className="uppercase tracking-widest text-indigo-600 font-semibold">{ch.vol}</span>
                <span>•</span>
                <span>{ch.date}</span>
                <span>•</span>
                <span>{ch.readTime}</span>
                {ch.followUpCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-fuchsia-600 font-bold">
                      <GitMerge className="w-3 h-3" /> Oiticle {ch.followUpCount}건
                    </span>
                  </>
                )}
              </div>

              <Link href={`/canon/${ch.id}`} className="block">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-indigo-600 transition-colors font-serif">
                  {ch.title}
                  {ch.isNew && (
                    <span className="ml-3 inline-block bg-rose-500 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full align-middle translate-y-[-4px]">
                      New
                    </span>
                  )}
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed font-light mb-6">
                  {ch.excerpt}
                </p>
                <div className="font-bold text-indigo-600 inline-flex items-center gap-1 group-hover:gap-3 transition-all">
                  본문 읽기 <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {idx !== chapters.length - 1 && (
                <div className="w-16 h-px bg-slate-200 mt-16 mb-4"></div>
              )}
            </article>
          ))}
        </div>

        {/* Archive CTA */}
        <div className="mt-20 p-8 bg-white border border-slate-200 rounded-3xl text-center">
          <TrendingUp className="w-8 h-8 text-slate-400 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800 text-xl mb-2">과거의 지혜를 발굴하다</h3>
          <p className="text-slate-500 text-sm mb-6">
            총리님의 과거 기고문과 저서들이 순차적으로 디지털 복원되어 인용 가능한 캐논으로 업데이트됩니다.
          </p>
          <Link
            href="/v-dash/oiticle/write?seed=v1-chapter-1"
            className="inline-block bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-6 py-3 rounded-full font-bold text-sm transition"
          >
            ⚡ 내 Oiticle 파생글 작성하기
          </Link>
        </div>
      </main>
    </div>
  );
}
