import Link from "next/link";
import { ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { getTenantConfig } from "@/lib/tenant-config";
import { notFound } from "next/navigation";

// Static data per Reset Moment (production: fetch from reset_moments + derma_products)
const MOMENT_DATA: Record<string, {
  name: string; emoji: string; description: string; user_situation: string;
  answer_cards: Array<{ q: string; a: string; cta_label: string; cta_href?: string }>;
  products: Array<{ name: string; slug: string; role: string; benefits: string[] }>;
  routine_title?: string; routine_steps?: string[];
  boundary: string;
}> = {
  "clinic-care": {
    name: "Clinic-Care", emoji: "🏥",
    description: "시술과 시술 사이의 공백에서 피부 상태를 관리하는 리셋 순간",
    user_situation: "시술 후 집에서 뭘 써야 하나요?",
    answer_cards: [
      { q: "리프팅 시술 후 집에서 무엇을 써야 하나요?", a: "리프팅 후 페이스라인이 일시적으로 흔들립니다. 이때 메디텐션 하이드로겔 마스크가 탄력 환경을 빠르게 복구합니다. 시술 당일~24시간 이내 적용을 권장합니다.", cta_label: "메디텐션 보기" },
      { q: "시술 후 얼마나 기다렸다가 써야 하나요?", a: "시술 당일 귀가 후 세안을 마친 시점이 최적 타이밍입니다. 피부 열감이 남아있다면 메디글로우로 먼저 열감을 진정시킨 후 적용하세요.", cta_label: "루틴 가이드 보기", cta_href: "routines" },
    ],
    products: [
      { name: "메디텐션 하이드로겔 마스크", slug: "meditension-hydrogel-mask", role: "리프팅/라인 리셋 히어로", benefits: ["탄력 환경 형성", "페이스라인 리셋", "밀착 피팅"] },
    ],
    routine_title: "24시간 라인 리셋 루틴",
    routine_steps: ["세안 후 토너로 잔여 자극 제거", "메디텐션 하이드로겔 마스크 20분 적용", "마스크 제거 후 에센스 가볍게 흡수"],
    boundary: "시술 대체 효과를 기대하지 마세요. 시술 후 홈케어 관리 목적입니다.",
  },
  "after-toning": {
    name: "After Toning", emoji: "🌡️",
    description: "토닝 후 열감과 칙칙함을 진정시키는 리셋 순간",
    user_situation: "토닝 받은 후 열감을 어떻게 진정시키나요?",
    answer_cards: [
      { q: "레이저 토닝 후 피부가 빨개요. 어떻게 하나요?", a: "레이저 토닝 후 발생하는 열감은 즉각적인 쿨링이 필요합니다. 메디글로우 모델링 마스크는 쿨링 포뮬레이션으로 열감을 빠르게 낮추고 피부톤을 균일하게 리셋합니다.", cta_label: "메디글로우 보기" },
      { q: "토닝 후 피부톤이 칙칙해졌어요.", a: "토닝 후 멜라닌 분해 과정에서 일시적으로 칙칙함이 나타날 수 있습니다. 메디글로우의 광채 리셋 포뮬레이션이 72시간 내 균일한 안색과 투명한 광채를 복구합니다.", cta_label: "쿨링 광채 루틴 보기", cta_href: "routines" },
    ],
    products: [
      { name: "메디글로우 모델링 마스크", slug: "mediglow-modeling-mask", role: "톤/열감/광채 리셋 히어로", benefits: ["열감 즉각 진정", "톤 리셋", "투명한 광채"] },
    ],
    routine_title: "토닝 후 쿨링 광채 루틴",
    routine_steps: ["귀가 직후 열감 확인", "메디글로우 모델링 마스크 15~20분 적용", "24시간 후 한 번 더 재적용"],
    boundary: "시술 후 의료적 회복 처치로 오해하지 마세요. 홈케어 리셋 목적입니다.",
  },
  "special-day": {
    name: "Special Day", emoji: "✨",
    description: "중요한 날 전 페이스라인과 컨디션을 끌어올리는 리셋 순간",
    user_situation: "중요한 일정 전날, 어떻게 준비하나요?",
    answer_cards: [
      { q: "결혼식/중요한 행사 전날 뭘 써야 하나요?", a: "D-1 저녁, 메디텐션 하이드로겔 마스크 20분 집중 적용. 이 한 번의 정확한 개입으로 페이스라인을 정돈하고 탄력 컨디션을 끌어올립니다.", cta_label: "D-1 루틴 보기" },
    ],
    products: [
      { name: "메디텐션 하이드로겔 마스크", slug: "meditension-hydrogel-mask", role: "Special Day 준비 히어로", benefits: ["페이스라인 리셋", "탄력 컨디션 향상", "즉각 체감"] },
    ],
    routine_title: "D-1 스페셜 라인 리셋 루틴",
    routine_steps: ["행사 전날 저녁 세안", "메디텐션 하이드로겔 마스크 20분 집중 적용", "에센스 흡수 후 가벼운 수분크림 마무리"],
    boundary: "매일 사용하는 제품이 아닙니다. 중요한 순간에 정확하게 사용하세요.",
  },
  "heat-relief": {
    name: "Heat Relief", emoji: "❄️",
    description: "피부 열감과 붉어짐을 빠르게 낮추는 리셋 순간",
    user_situation: "피부가 빨개지고 열이 나는데 빨리 가라앉히고 싶어요",
    answer_cards: [
      { q: "피부에 갑자기 열이 올랐어요. 빨리 진정시킬 수 있나요?", a: "메디글로우의 쿨링 모델링 마스크는 즉각적인 열감 진정을 위해 설계되었습니다. 적용 즉시 쿨링 효과를 체감할 수 있으며, 15분 후 균일한 피부톤으로 리셋됩니다.", cta_label: "메디글로우 보기" },
    ],
    products: [
      { name: "메디글로우 모델링 마스크", slug: "mediglow-modeling-mask", role: "열감 즉각 진정 히어로", benefits: ["즉각 쿨링", "붉어짐 완화", "피부톤 균일화"] },
    ],
    boundary: "피부 질환으로 인한 열감이라면 먼저 전문의 진료를 받으세요.",
  },
  "special-glow": {
    name: "Special Glow", emoji: "💫",
    description: "투명한 광채와 균일한 안색을 준비하는 리셋 순간",
    user_situation: "칙칙한 피부톤을 빠르게 환하게 만들고 싶어요",
    answer_cards: [
      { q: "칙칙한 피부톤을 빠르게 환하게 만드는 방법이 있나요?", a: "메디글로우 모델링 마스크의 광채 리셋 포뮬레이션은 즉각적인 광채와 균일한 안색을 제공합니다. 데일리 사용이 아닌, 광채가 필요한 순간에 정확히 사용하세요.", cta_label: "메디글로우 보기" },
    ],
    products: [
      { name: "메디글로우 모델링 마스크", slug: "mediglow-modeling-mask", role: "광채 리셋 히어로", benefits: ["투명한 광채", "균일한 안색", "즉각 체감"] },
    ],
    boundary: "매일 바르는 기초 보습제가 아닙니다. 광채가 필요한 순간에만 사용하세요.",
  },
};

const GOLD = '#cda434';

export default async function MomentDetailPage({
  params,
}: {
  params: Promise<{ tenant: string; slug: string }>;
}) {
  const { tenant, slug } = await params;
  const tc = getTenantConfig(tenant);
  const moment = MOMENT_DATA[slug];

  if (!moment) notFound();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-200 py-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link href={`/${tenant}/moments`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> 모든 리셋 모먼트
        </Link>

        {/* Hero */}
        <div className="mb-10">
          <div className="text-5xl mb-4">{moment.emoji}</div>
          <div className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">
            Reset Moment
          </div>
          <h1 className="text-4xl font-black text-white mb-3">{moment.name}</h1>
          <p className="text-slate-400 text-lg leading-relaxed">{moment.description}</p>
        </div>

        {/* User Situation */}
        <div className="rounded-2xl p-6 border border-white/5 bg-white/[0.03] mb-8">
          <div className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">당신의 상황</div>
          <p className="text-xl font-bold text-white">"{moment.user_situation}"</p>
        </div>

        {/* Answer Cards */}
        <div className="space-y-4 mb-10">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Answer Hub</div>
          {moment.answer_cards.map((card) => (
            <div key={card.q} className="rounded-2xl p-6 border border-white/5 bg-white/[0.02]">
              <p className="font-bold text-white mb-3">{card.q}</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{card.a}</p>
              <Link href={card.cta_href ? `/${tenant}/${card.cta_href}` : `/${tenant}/products/${moment.products[0]?.slug}`}
                className="text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: GOLD }}>
                {card.cta_label} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Recommended Products */}
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500">이 순간의 솔루션</div>
          <div className="space-y-3">
            {moment.products.map((p) => (
              <Link key={p.slug} href={`/${tenant}/products/${p.slug}`}
                className="flex items-start gap-4 rounded-2xl p-5 border border-white/5 bg-white/[0.02] hover:border-amber-600/30 transition-all group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: 'rgba(205,164,52,0.1)' }}>🧬</div>
                <div className="flex-1">
                  <div className="font-bold text-white mb-1">{p.name}</div>
                  <div className="text-xs text-slate-500 mb-2">{p.role}</div>
                  <div className="flex flex-wrap gap-2">
                    {p.benefits.map(b => (
                      <span key={b} className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-slate-400">{b}</span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </div>

        {/* Routine */}
        {moment.routine_title && moment.routine_steps && (
          <div className="mb-10 rounded-2xl p-6 border border-amber-900/20 bg-amber-950/10">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
              Reset Routine
            </div>
            <h3 className="text-lg font-black text-white mb-4">{moment.routine_title}</h3>
            <ol className="space-y-3">
              {moment.routine_steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-black"
                    style={{ backgroundColor: GOLD }}>{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Boundary */}
        <div className="rounded-xl p-4 border border-white/5 bg-white/[0.01] flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
          <p className="text-slate-500 text-xs leading-relaxed">{moment.boundary}</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
          <Link href={`/${tenant}/moments`} className="text-sm text-slate-500 hover:text-white transition-colors">
            ← 모든 리셋 모먼트
          </Link>
          <Link href={`/${tenant}/compare`}
            className="text-sm font-bold" style={{ color: GOLD }}>
            메디텐션 vs 메디글로우 비교 →
          </Link>
        </div>
      </div>
    </div>
  );
}
