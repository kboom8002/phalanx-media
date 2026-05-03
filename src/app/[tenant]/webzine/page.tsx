import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Newspaper, Clock, ArrowRight, ChevronRight, Flame, BookOpen, MessageSquare, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import { getTenantConfig } from "@/lib/tenant-config";
import { cookies } from "next/headers";

export const revalidate = 10;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }): Promise<Metadata> {
  const p = await params;
  const tenantId = p.tenant || process.env.NEXT_PUBLIC_TENANT_ID || "phalanx";
  const tc = getTenantConfig(tenantId);
  return {
    title: `웹진 | ${tc.displayName}`,
    description: `${tc.displayName}의 최신 ${tc.terminology.signal}, 사설, 인터뷰, 트렌드 리포트를 확인하세요.`,
  };
}

const CATEGORIES = [
  { key: "latest",    label: "최신 기사",      icon: Flame },
  { key: "editorial", label: "사설 / 오피니언", icon: MessageSquare },
  { key: "interview", label: "스페셜 인터뷰",   icon: BookOpen },
  { key: "trend",     label: "트렌드 리포트",   icon: TrendingUp },
];

// Mock articles — same data source as fact_cards, presented as webzine articles
const MOCK_ARTICLES = [
  {
    id: "w-1",
    category: "editorial",
    title: "당정분리, 이제는 시스템으로 완성할 때다",
    excerpt: "한국 정치에서 당정분리는 구호에 그쳐왔다. 헌법적 근거와 제도적 장치를 구체적으로 설계해야 한다.",
    author: "편집위원회",
    date: "2026.05.01",
    readTime: "5 min",
    isHot: true,
  },
  {
    id: "w-2",
    category: "latest",
    title: "[팩트체크] '전당대회 룰 편파' 조작 프레임의 실체",
    excerpt: "최근 확산되고 있는 전당대회 룰 관련 의혹을 공식 당헌당규와 대조하여 검증했습니다.",
    author: "검증팀",
    date: "2026.04.30",
    readTime: "3 min",
    isHot: true,
  },
  {
    id: "w-3",
    category: "interview",
    title: "저출산 전문가 인터뷰 — \"현금 지원보다 인프라가 먼저\"",
    excerpt: "인구학 전문가 박○○ 교수와의 대담. OECD 20개국 데이터를 바탕으로 한국 저출산 정책의 구조적 문제를 짚었다.",
    author: "기획취재팀",
    date: "2026.04.28",
    readTime: "8 min",
    isHot: false,
  },
  {
    id: "w-4",
    category: "trend",
    title: "AI 정치 여론 분석 보고서 — 2026년 5월 1주차",
    excerpt: "소셜미디어 주요 의제 분석 결과, 경제 이슈가 정치 이슈를 처음으로 앞질렀습니다.",
    author: "AI 분석실",
    date: "2026.04.27",
    readTime: "6 min",
    isHot: false,
  },
  {
    id: "w-5",
    category: "latest",
    title: "재난지원금 오보 확산 경로 분석",
    excerpt: "특정 단톡방에서 시작된 오보가 48시간 내 127만 회 공유된 경로를 데이터로 추적했습니다.",
    author: "데이터저널리즘팀",
    date: "2026.04.26",
    readTime: "7 min",
    isHot: false,
  },
  {
    id: "w-6",
    category: "editorial",
    title: "AI 국가전략, 규제보다 육성이 먼저다",
    excerpt: "반도체 패권 경쟁 속에서 한국의 AI 정책 방향을 진단한다. 규제 선행의 위험성과 육성 우선 전략의 필요성.",
    author: "정책연구팀",
    date: "2026.04.25",
    readTime: "6 min",
    isHot: false,
  },
];

export default async function WebzinePage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ category?: string }>;
  params: Promise<{ tenant: string }>;
}) {
  const sp = await searchParams;
  const p = await params;
  const tenantId = p.tenant || process.env.NEXT_PUBLIC_TENANT_ID || "phalanx";
  const tc = getTenantConfig(tenantId);
  const activeCategory = sp.category || "latest";

  // Try DB first, fallback to mock
  const { data: dbArticles } = await supabase
    .from("fact_cards")
    .select("id, canonical_question, answer, category, created_at")
    .eq("is_published", true)
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(20);

  const hasDB = dbArticles && dbArticles.length > 0;
  const allArticles = hasDB
    ? dbArticles.map((a: any) => ({
        id: a.id,
        category: a.category?.toLowerCase() || "latest",
        title: a.canonical_question,
        excerpt: a.answer?.slice(0, 120) + "...",
        author: "검증팀",
        date: new Date(a.created_at).toLocaleDateString("ko-KR"),
        readTime: "3 min",
        isHot: false,
      }))
    : MOCK_ARTICLES;

  const filteredArticles =
    activeCategory === "latest"
      ? allArticles
      : allArticles.filter((a) => a.category === activeCategory);

  const featured = allArticles.find((a) => a.isHot) || allArticles[0];
  const secondary = allArticles.filter((a) => a.id !== featured?.id).slice(0, 3);

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Header */}
      <header className="pt-24 pb-12 px-4 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">
            <Newspaper className="w-4 h-4" />
            {tc.displayName} 웹진
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            {tc.terminology.signal}
          </h1>
          <p className="text-slate-500 text-sm">
            검증된 사실과 전문가 분석을 바탕으로 한 공식 미디어 채널
          </p>

          {/* Category Tabs */}
          <div className="flex gap-1 mt-6 overflow-x-auto pb-px">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <Link
                  key={cat.key}
                  href={`/${tenantId}/webzine?category=${cat.key}`}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {activeCategory === "latest" && featured && (
          <section className="mb-14">
            {/* Featured Article */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
              <Link
                href={`/${tenantId}/webzine/${featured.id}`}
                className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" /> HOT
                  </span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">
                    {CATEGORIES.find((c) => c.key === featured.category)?.label || "기사"}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-indigo-700 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{featured.author} · {featured.date}</span>
                  <span className="flex items-center gap-1 text-indigo-600 font-bold group-hover:gap-2 transition-all">
                    읽기 <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>

              {/* Secondary articles */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {secondary.map((art) => (
                  <Link
                    key={art.id}
                    href={`/${tenantId}/webzine/${art.id}`}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow group flex flex-col gap-2"
                  >
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {CATEGORIES.find((c) => c.key === art.category)?.label || "기사"}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto">
                      <Clock className="w-3 h-3" />
                      {art.readTime} · {art.date}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Article List */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            {activeCategory !== "latest" && (
              <>
                {(() => {
                  const cat = CATEGORIES.find((c) => c.key === activeCategory);
                  const Icon = cat?.icon || Newspaper;
                  return <Icon className="w-5 h-5 text-slate-400" />;
                })()}
                {CATEGORIES.find((c) => c.key === activeCategory)?.label}
              </>
            )}
            {activeCategory === "latest" && (
              <>
                <Newspaper className="w-5 h-5 text-slate-400" />
                전체 기사
              </>
            )}
          </h2>
          <div className="space-y-3">
            {filteredArticles.map((art) => (
              <Link
                key={art.id}
                href={`/${tenantId}/webzine/${art.id}`}
                className="flex items-center gap-5 p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {CATEGORIES.find((c) => c.key === art.category)?.label || "기사"}
                    </span>
                    {art.isHot && (
                      <span className="text-[10px] bg-red-50 text-red-500 font-bold px-1.5 py-0.5 rounded-full">HOT</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors truncate">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {art.author} · {art.date} · {art.readTime}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
