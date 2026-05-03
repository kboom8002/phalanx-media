import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTenantConfig } from "@/lib/tenant-config";

const RESET_MOMENTS = [
  { slug: "clinic-care",       name: "Clinic-Care",        emoji: "🏥", situation: "시술 후 집에서 뭘 써야 하나요?",         product_hint: "메디텐션", product_slug: "meditension-hydrogel-mask" },
  { slug: "special-day",       name: "Special Day",         emoji: "✨", situation: "중요한 날 전날 어떻게 준비하나요?",      product_hint: "메디텐션", product_slug: "meditension-hydrogel-mask" },
  { slug: "after-toning",      name: "After Toning",        emoji: "🌡️", situation: "토닝 후 열감, 어떻게 진정시키나요?",    product_hint: "메디글로우", product_slug: "mediglow-modeling-mask" },
  { slug: "heat-relief",       name: "Heat Relief",         emoji: "❄️", situation: "피부가 빨개지고 열이 나요",              product_hint: "메디글로우", product_slug: "mediglow-modeling-mask" },
  { slug: "special-glow",      name: "Special Glow",        emoji: "💫", situation: "칙칙한 톤을 빠르게 환하게 하고 싶어요",   product_hint: "메디글로우", product_slug: "mediglow-modeling-mask" },
  { slug: "wash-reset",        name: "Wash & Reset",        emoji: "🚿", situation: "세안 후 피부가 당기고 불균형해요",        product_hint: "워시리셋", product_slug: "wash-reset-mask" },
  { slug: "barrier-emergency", name: "Barrier Emergency",   emoji: "🛡️", situation: "피부가 따갑고 민감해져서 긴급 진정이 필요해요", product_hint: "배리어리셋", product_slug: "barrier-reset-mask" },
  { slug: "renewing-treatment",name: "Renewing Treatment",  emoji: "🔄", situation: "일주일에 한 번 피부를 완전히 리셋하고 싶어요", product_hint: "덴시티리셋", product_slug: "density-reset-treatment" },
  { slug: "overnight-repair",  name: "8-Hour Repair",       emoji: "🌙", situation: "자는 동안 집중 케어로 아침에 다른 피부를 원해요", product_hint: "나이트리셋", product_slug: "night-reset-cream-mask" },
  { slug: "concentrated-repair", name: "Concentrated Repair", emoji: "⚡", situation: "빠른 시간 안에 최대 효과의 집중 케어가 필요해요", product_hint: "나이트리셋 하이드로겔", product_slug: "night-reset-hydrogel-mask" },
];

export default async function MomentsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const tc = getTenantConfig(tenant);
  const gold = tc.theme.primaryColor;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-200 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500">
            이럴 때 DR.O — Reset Moment
          </div>
          <h1 className="text-4xl font-black text-white mb-4">
            지금의 피부 상황을 선택하세요
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            DR.O는 데일리 기초가 아닙니다. 당신의 정확한 상황에 맞는 리셋 솔루션을 찾아드립니다.
          </p>
        </div>

        {/* Moment Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESET_MOMENTS.map((m) => (
            <Link key={m.slug} href={`/${tenant}/moments/${m.slug}`}
              className="group rounded-2xl p-6 border border-white/5 bg-white/[0.02] hover:border-amber-600/30 hover:bg-white/[0.04] transition-all">
              <div className="text-4xl mb-4">{m.emoji}</div>
              <div className="font-black text-white text-lg mb-2">{m.name}</div>
              <div className="text-slate-400 text-sm leading-relaxed mb-5">{m.situation}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                  style={{ color: gold, backgroundColor: 'rgba(205,164,52,0.1)' }}>
                  → {m.product_hint}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm mb-4">어떤 상황인지 모르겠다면?</p>
          <Link href={`/${tenant}/compare`}
            className="text-sm font-bold hover:underline" style={{ color: gold }}>
            메디텐션 vs 메디글로우 Fit Split 비교 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
