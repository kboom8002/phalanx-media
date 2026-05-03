import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { getTenantConfig } from "@/lib/tenant-config";

const GOLD = '#cda434';

const ROUTINES = [
  {
    slug: "24hr-line-reset", name: "24시간 라인 리셋 루틴",
    duration: "24시간", moment: "Clinic-Care", moment_slug: "clinic-care",
    product: "메디텐션 하이드로겔 마스크", product_slug: "meditension-hydrogel-mask",
    goal: "리프팅 시술 후 페이스라인을 빠르게 안정시키고 탄력 환경을 복구",
    steps: [
      { order: 1, title: "피부 진정", instruction: "세안 후 토너로 잔여 자극을 제거합니다.", timing: "시술 후 귀가 즉시" },
      { order: 2, title: "메디텐션 적용", instruction: "메디텐션 하이드로겔 마스크를 20분 밀착 적용합니다.", timing: "세안 직후" },
      { order: 3, title: "에센스 마무리", instruction: "마스크 제거 후 남은 에센스를 가볍게 흡수시킵니다.", timing: "마스크 후" },
    ],
    caution: "시술 후 48시간 이내에 사용하세요. 시술 대체가 아닌 홈케어입니다.",
  },
  {
    slug: "post-toning-glow", name: "토닝 후 쿨링 광채 루틴",
    duration: "시술 당일~72시간", moment: "After Toning", moment_slug: "after-toning",
    product: "메디글로우 모델링 마스크", product_slug: "mediglow-modeling-mask",
    goal: "토닝 후 열감 즉각 진정, 24~72시간 내 균일한 안색과 광채 복구",
    steps: [
      { order: 1, title: "열감 확인", instruction: "귀가 후 피부 열감이 남아있는지 확인합니다.", timing: "시술 후 귀가 직후" },
      { order: 2, title: "메디글로우 적용", instruction: "메디글로우 모델링 마스크를 15~20분 적용합니다.", timing: "즉시" },
      { order: 3, title: "24시간 후 재적용", instruction: "다음날 세안 후 한 번 더 적용하여 광채를 완성합니다.", timing: "24시간 후" },
    ],
    caution: "토닝 후 강한 마찰과 각질 제거는 피하세요.",
  },
  {
    slug: "special-day-d1", name: "스페셜 데이 D-1 루틴",
    duration: "D-1 저녁 30분", moment: "Special Day", moment_slug: "special-day",
    product: "메디텐션 하이드로겔 마스크", product_slug: "meditension-hydrogel-mask",
    goal: "중요한 행사 전날 페이스라인 리셋 및 탄력 컨디션 극대화",
    steps: [
      { order: 1, title: "저녁 세안", instruction: "행사 전날 저녁, 깨끗이 세안합니다.", timing: "행사 D-1 저녁" },
      { order: 2, title: "메디텐션 집중 적용", instruction: "메디텐션 하이드로겔 마스크를 20~30분 집중 적용합니다.", timing: "세안 직후" },
      { order: 3, title: "수분 마무리", instruction: "에센스 흡수 후 가벼운 수분크림으로 마무리합니다.", timing: "마스크 후" },
    ],
    caution: "매일 사용하는 제품이 아닙니다. 중요한 순간에 정확하게 한 번 사용하세요.",
  },
];

export default async function RoutinesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const tc = getTenantConfig(tenant);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-200 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500">Reset Routine</div>
          <h1 className="text-4xl font-black text-white mb-4">상황별 리셋 루틴 가이드</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            DR.O는 매일 바르는 데일리 제품이 아닙니다. 정확한 상황에, 정확한 타이밍에, 단 한 번의 리셋.
          </p>
        </div>

        <div className="space-y-8">
          {ROUTINES.map((r) => (
            <div key={r.slug} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ color: GOLD, backgroundColor: 'rgba(205,164,52,0.1)' }}>
                        {r.moment}
                      </span>
                      <span className="text-xs text-slate-500">⏱ {r.duration}</span>
                    </div>
                    <h2 className="text-xl font-black text-white">{r.name}</h2>
                    <p className="text-sm text-slate-500 mt-1">{r.goal}</p>
                  </div>
                  <Link href={`/${tenant}/products/${r.product_slug}`}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0"
                    style={{ color: GOLD, backgroundColor: 'rgba(205,164,52,0.1)' }}>
                    → {r.product.split(' ')[0]}
                  </Link>
                </div>
              </div>

              {/* Steps */}
              <div className="p-6">
                <ol className="space-y-4">
                  {r.steps.map((step) => (
                    <li key={step.order} className="flex gap-4">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-black"
                        style={{ backgroundColor: GOLD }}>{step.order}</div>
                      <div>
                        <div className="font-bold text-white text-sm mb-0.5">{step.title}</div>
                        <div className="text-slate-400 text-sm">{step.instruction}</div>
                        <div className="text-xs text-slate-600 mt-1">⏰ {step.timing}</div>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* Caution */}
                <div className="mt-5 flex items-start gap-2 rounded-xl p-3 bg-black/20 border border-white/5">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                  <p className="text-xs text-slate-500">{r.caution}</p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4 mt-5">
                  <Link href={`/${tenant}/moments/${r.moment_slug}`}
                    className="text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                    style={{ color: GOLD }}>
                    {r.moment} 상황 보기 <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href={`/${tenant}/products/${r.product_slug}`}
                    className="text-sm text-slate-500 hover:text-white transition-colors">
                    → 제품 상세
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 pt-8 border-t border-white/5">
          <p className="text-slate-500 text-sm mb-3">루틴에 맞는 제품을 먼저 확인하세요</p>
          <Link href={`/${tenant}/moments`}
            className="text-sm font-bold hover:underline" style={{ color: GOLD }}>
            ← 내 상황 다시 선택하기
          </Link>
        </div>
      </div>
    </div>
  );
}
