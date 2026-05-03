import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTenantConfig } from "@/lib/tenant-config";
import { generateFAQSchema, generateMomentMeta } from "@/lib/dro-aeo";
import type { Metadata } from "next";

const GOLD = '#cda434';

// Static products (production: fetch from derma_products table)
const PRODUCTS = [
  {
    name: "메디텐션 하이드로겔 마스크", slug: "meditension-hydrogel-mask",
    is_hero: true, role: "리프팅/라인 리셋 히어로",
    formulation: "하이드로겔 기반 밀착 리프팅 케어",
    benefits: ["탄력 환경 형성", "페이스라인 리셋", "밀착 피팅"],
    moments: ["Clinic-Care", "Special Day"],
    badge: "라인 리셋", color: "#c8a2c8",
    faq: [
      { question: "메디텐션은 언제 쓰나요?", answer: "리프팅 시술 후 페이스라인을 빠르게 리셋하고 싶을 때, 또는 중요한 날 전날 탄력 컨디션을 끌어올릴 때 사용합니다. 시술 당일~24시간 이내 적용이 최적입니다." },
      { question: "메디텐션은 매일 써도 되나요?", answer: "아닙니다. 메디텐션은 주 1~2회 집중형 스페셜 트리트먼트입니다. 매일 사용하는 데일리 기초 제품이 아닙니다." },
    ],
  },
  {
    name: "메디글로우 모델링 마스크", slug: "mediglow-modeling-mask",
    is_hero: true, role: "톤/열감/광채 리셋 히어로",
    formulation: "쿨링 모델링 케어",
    benefits: ["열감 즉각 진정", "톤 리셋", "투명한 광채"],
    moments: ["After Toning", "Heat Relief", "Special Glow"],
    badge: "광채 리셋", color: GOLD,
    faq: [
      { question: "메디글로우는 언제 쓰나요?", answer: "레이저 토닝, IPL 등 시술 후 열감과 칙칙함을 빠르게 진정시킬 때 사용합니다. 광채 리셋이 필요한 날에도 활용하세요." },
      { question: "메디글로우와 메디텐션은 같이 써도 되나요?", answer: "네. 토닝 후 열감이 있고 라인도 신경 쓰인다면, 먼저 메디글로우로 열감을 진정한 후 다음 날 메디텐션으로 라인을 리셋하는 방식으로 함께 활용할 수 있습니다." },
    ],
  },
  { name: "워시리셋마스크", slug: "wash-reset-mask", is_hero: false, role: "세안 연계 프렙 케어", formulation: "클렌징 후 적용 크림형", benefits: ["세안 후 밸런싱", "장벽 프렙"], moments: ["Wash & Reset"], badge: "프렙", color: "#6b9eab" },
  { name: "덴시티리셋트리트먼트", slug: "density-reset-treatment", is_hero: false, role: "고밀도 집중 회복 트리트먼트", formulation: "고점도 농축 앰플형", benefits: ["집중 재생", "밀도 개선"], moments: ["Renewing Treatment"], badge: "집중 회복", color: "#8b7355" },
  { name: "배리어리셋마스크", slug: "barrier-reset-mask", is_hero: false, role: "긴급 장벽 회복 마스크", formulation: "하이드로겔 + 세라마이드", benefits: ["장벽 긴급 복구", "민감 진정"], moments: ["Barrier Emergency"], badge: "장벽 응급", color: "#7a8c6a" },
  { name: "나이트리셋크림마스크", slug: "night-reset-cream-mask", is_hero: false, role: "수면 중 집중 리페어", formulation: "크림형 수면팩", benefits: ["8시간 리페어", "수분 충전"], moments: ["8-Hour Repair"], badge: "수면 리페어", color: "#6a7a9c" },
  { name: "나이트리셋하이드로겔마스크", slug: "night-reset-hydrogel-mask", is_hero: false, role: "수면 중 고농도 집중 리페어", formulation: "하이드로겔 수면팩", benefits: ["집중 농도 리페어", "흡수력 극대화"], moments: ["Concentrated Repair"], badge: "집중 수면", color: "#5a6e8c" },
];

export default async function ProductsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const tc = getTenantConfig(tenant);

  const heroes = PRODUCTS.filter(p => p.is_hero);
  const portfolio = PRODUCTS.filter(p => !p.is_hero);

  // AEO FAQ schema for hero products
  const allFaqs = heroes.flatMap(p => (p as typeof heroes[0] & { faq?: {question: string; answer: string}[] }).faq || []);
  const faqSchema = generateFAQSchema(allFaqs);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-200 py-20 px-6">
      {/* AEO structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500">
            Product as Answer
          </div>
          <h1 className="text-4xl font-black text-white mb-4">DR.O 제품</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            제품이 아닌 리셋 솔루션입니다. 당신의 상황에 맞는 제품을 선택하세요.
          </p>
          <Link href={`/${tenant}/moments`}
            className="inline-flex items-center gap-1 mt-4 text-sm font-bold hover:underline"
            style={{ color: GOLD }}>
            상황으로 제품 찾기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hero SKUs */}
        <div className="mb-16">
          <div className="text-xs font-bold uppercase tracking-widest mb-6 text-slate-500">Hero SKU</div>
          <div className="grid md:grid-cols-2 gap-6">
            {heroes.map((p) => {
              const hp = p as typeof heroes[0] & { faq?: {question: string; answer: string}[] };
              return (
                <Link key={p.slug} href={`/${tenant}/products/${p.slug}`}
                  className="group rounded-2xl p-8 border border-white/5 bg-white/[0.02] hover:border-amber-600/20 transition-all">
                  <div className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                    style={{ color: hp.color, backgroundColor: `${hp.color}18` }}>
                    {hp.badge}
                  </div>
                  <h2 className="text-xl font-black text-white mb-2">{hp.name}</h2>
                  <p className="text-slate-500 text-sm mb-1">{hp.role}</p>
                  <p className="text-slate-600 text-xs mb-5 italic">{hp.formulation}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {hp.benefits.map(b => (
                      <span key={b} className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-slate-400">{b}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {hp.moments.map(m => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ color: hp.color, backgroundColor: `${hp.color}10` }}>{m}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all"
                    style={{ color: hp.color }}>
                    제품 상세 보기 <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-5">
            <Link href={`/${tenant}/compare`}
              className="text-sm hover:underline" style={{ color: GOLD }}>
              → 두 제품 Fit Split 비교 보기
            </Link>
          </div>
        </div>

        {/* Portfolio SKUs */}
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-6 text-slate-500">Extended Portfolio</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.map((p) => (
              <Link key={p.slug} href={`/${tenant}/products/${p.slug}`}
                className="group rounded-xl p-5 border border-white/5 bg-white/[0.015] hover:border-white/10 transition-all">
                <div className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-3"
                  style={{ color: p.color, backgroundColor: `${p.color}15` }}>
                  {p.badge}
                </div>
                <h3 className="font-bold text-white mb-1 text-sm">{p.name}</h3>
                <p className="text-slate-600 text-xs mb-3">{p.role}</p>
                <div className="flex flex-wrap gap-1">
                  {p.benefits.map(b => (
                    <span key={b} className="text-xs text-slate-500">{b}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
