import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { BookOpen, Calendar, ArrowRight, TrendingUp, GitMerge } from "lucide-react";
import type { Metadata } from "next";
import { getTenantConfig } from "@/lib/tenant-config";

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }): Promise<Metadata> {
  const p = await params;
  const tenantId = p.tenant || process.env.NEXT_PUBLIC_TENANT_ID || "phalanx";
  const tc = getTenantConfig(tenantId);
  return {
    title: `${tc.media.canonTitle} | ${tc.displayName}`,
    description: tc.media.canonSubtitle,
  };
}

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

export default async function CanonListPage({ params }: { params: Promise<{ tenant: string }> }) {
  const p = await params;
  const tenantId = p.tenant || process.env.NEXT_PUBLIC_TENANT_ID || "phalanx";
  const tc = getTenantConfig(tenantId);
  // WP-12: DB-first fetch, fallback to mock
  const { data: dbFactCards } = await supabase
    .from("fact_cards")
    .select("id, canonical_question, answer, category, created_at")
    .eq("is_published", true)
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(10);

  const hasDB = dbFactCards && dbFactCards.length > 0;

  const MOCK_WEDDING_CHAPTERS = [
    { id: 'w-ch-1', vol: 'K-Wedding 가이드 · 스튜디오', title: '한국 웨딩촬영 패키지에는 보통 무엇이 포함되나요?', excerpt: '일반적으로 촬영(2~4시간), 의상 2~3벌, 헤어·메이크업, 보정본 80~120장, 원본 USB가 기본 패키지에 포함됩니다...', date: '2026. 04. 28', readTime: '5 min read', isNew: true, followUpCount: 5 },
    { id: 'w-ch-2', vol: 'K-Wedding 가이드 · 스튜디오', title: '자연광 웨딩스튜디오는 어떤 커플에게 적합한가요?', excerpt: '자연광 스튜디오는 따뜻하고 자연스러운 톤을 선호하는 커플에게 추천됩니다. 인위적인 조명 보정보다 빛 그 자체를 활용한 사진을 원하는 분들에게...', date: '2026. 04. 25', readTime: '4 min read', isNew: false, followUpCount: 3 },
    { id: 'w-ch-3', vol: 'K-Wedding 가이드 · 스냅', title: '본식스냅 계약 전 꼭 확인할 항목은?', excerpt: '본식스냅은 촬영자 수, 촬영 범위(예식·웨딩홀·야외), 보정본 수량, 납기일을 반드시 확인해야 합니다. 특히 당일 대체 촬영자 정책은...', date: '2026. 04. 20', readTime: '6 min read', isNew: false, followUpCount: 0 },
  ];

  const chapters = hasDB
    ? dbFactCards.map((fc: any, i: number) => ({
        id: fc.id,
        vol: `${tc.terminology.canon} · ${fc.category || "일반"}`,
        title: fc.canonical_question,
        excerpt: fc.answer?.slice(0, 200) + "...",
        date: new Date(fc.created_at).toLocaleDateString("ko-KR"),
        readTime: "3 min read",
        isNew: i === 0,
        followUpCount: 0,
      }))
    : (tc.vertical === 'wedding' ? MOCK_WEDDING_CHAPTERS : MOCK_CHAPTERS);

  // Fetch garrison follow-up counts
  const { data: postCounts } = await supabase
    .from("garrison_posts")
    .select("seed_canon_id")
    .not("seed_canon_id", "is", null);

  const countMap: Record<string, number> = {};
  (postCounts || []).forEach((p: { seed_canon_id: string }) => {
    countMap[p.seed_canon_id] = (countMap[p.seed_canon_id] || 0) + 1;
  });

  const chaptersWithCounts = chapters.map((ch: any) => ({
    ...ch,
    followUpCount: countMap[ch.id] ?? ch.followUpCount,
  }));

  const totalFollowUps = Object.values(countMap).reduce((a: number, b: number) => a + b, 0) || 3;

  // Group by Tier (Mocking tiers since fact_cards doesn't have it yet)
  const chaptersByTier = {
    official: chaptersWithCounts.slice(0, 1),
    expert_verified: chaptersWithCounts.slice(1, 2),
    community: chaptersWithCounts.slice(2)
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Editorial Header */}
      <header className="pt-20 pb-16 px-4 text-center border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold tracking-widest text-xs uppercase mb-6">
            <BookOpen className="w-4 h-4" />
            <span>{tc.terminology.canon}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 font-serif">
            {tc.media.canonTitle}
          </h1>
          <p className="text-lg text-slate-600 font-light leading-relaxed mb-8">
            {tc.media.canonSubtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
              <Calendar className="w-4 h-4" /> 매주 수요일 20:00 연재
            </span>
            <span className="inline-flex items-center gap-2 bg-fuchsia-50 border border-fuchsia-100 text-fuchsia-700 px-4 py-2 rounded-full text-sm font-medium">
              <GitMerge className="w-4 h-4" /> 시민 기고 총 {totalFollowUps}건
            </span>
          </div>
        </div>
      </header>

      {/* Chapters Feed - 3 Tier Hierarchy */}
      <main className="max-w-3xl mx-auto px-4 py-16">
        
        {/* Tier 1: Official */}
        {chaptersByTier.official.length > 0 && (
          <div className="mb-20">
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2 border-b border-slate-200 pb-4">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
              Tier 1: Official Canon (공식)
            </h2>
            <div className="space-y-16 flex flex-col">
              {chaptersByTier.official.map((ch: any) => (
                <ArticleCard key={ch.id} ch={ch} tenantId={tenantId} tierLabel="🔵 Official" />
              ))}
            </div>
          </div>
        )}

        {/* Tier 2: Expert Verified */}
        {chaptersByTier.expert_verified.length > 0 && (
          <div className="mb-20">
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2 border-b border-slate-200 pb-4">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              Tier 2: Expert Verified (전문가 검증)
            </h2>
            <div className="space-y-16 flex flex-col">
              {chaptersByTier.expert_verified.map((ch: any) => (
                <ArticleCard key={ch.id} ch={ch} tenantId={tenantId} tierLabel="🟢 Expert Verified" />
              ))}
            </div>
          </div>
        )}

        {/* Tier 3: Community */}
        {chaptersByTier.community.length > 0 && (
          <div className="mb-20">
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2 border-b border-slate-200 pb-4">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block"></span>
              Tier 3: Community (커뮤니티)
            </h2>
            <div className="space-y-16 flex flex-col">
              {chaptersByTier.community.map((ch: any) => (
                <ArticleCard key={ch.id} ch={ch} tenantId={tenantId} tierLabel="⚪ Community" />
              ))}
            </div>
          </div>
        )}

        {/* Archive CTA */}
        <div className="mt-20 p-8 bg-white border border-slate-200 rounded-3xl text-center">
          <TrendingUp className="w-8 h-8 text-slate-400 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800 text-xl mb-2">과거의 지혜를 발굴하다</h3>
          <p className="text-slate-500 text-sm mb-6">
            총리님의 과거 기고문과 저서들이 순차적으로 디지털 복원되어 인용 가능한 캐논으로 업데이트됩니다.
          </p>
          <Link
            href={`/${tenantId}/agora/ask`}
            className="inline-block bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-6 py-3 rounded-full font-bold text-sm transition"
          >
            ✍️ 시민 기고 작성하기
          </Link>
        </div>
      </main>
    </div>
  );
}

function ArticleCard({ ch, tenantId, tierLabel }: { ch: any, tenantId: string, tierLabel: string }) {
  return (
    <article className="group relative">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-4 font-mono">
        <span className="uppercase tracking-widest text-indigo-600 font-semibold">{ch.vol}</span>
        <span>•</span>
        <span>{ch.date}</span>
        <span>•</span>
        <span className="font-bold text-slate-800">{tierLabel}</span>
        {ch.followUpCount > 0 && (
          <>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-fuchsia-600 font-bold">
              <GitMerge className="w-3 h-3" /> 파생 콘텐츠 {ch.followUpCount}건
            </span>
          </>
        )}
      </div>

      <Link href={`/${tenantId}/canon/${ch.id}`} className="block">
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
    </article>
  );
}
