import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { getTenantConfig } from "@/lib/tenant-config";

const GOLD = '#cda434';

const COMPARE_DATA = {
  "meditension-vs-mediglow": {
    product_a: {
      name: "메디텐션", sub: "하이드로겔 마스크", slug: "meditension-hydrogel-mask",
      badge: "라인 · 리프팅 리셋", color: "#c8a2c8",
      formulation: "하이드로겔 기반 밀착 리프팅 케어",
      benefits: ["탄력 환경 형성", "페이스라인 리셋", "밀착 피팅"],
      fits: ["리프팅 시술 후", "페이스라인 처짐", "중요한 날 전 라인 정리", "Clinic-Care Moment", "Special Day Moment"],
      not_fits: ["열감 진정이 주목적인 경우", "토닝 시술 직후"],
      usage: "주 1~2회 집중 적용 / 시술 후 24~72시간",
      timing: "리프팅/HIFU/리니어 시술 후 귀가 즉시",
    },
    product_b: {
      name: "메디글로우", sub: "모델링 마스크", slug: "mediglow-modeling-mask",
      badge: "열감 · 광채 리셋", color: GOLD,
      formulation: "쿨링 모델링 케어",
      benefits: ["열감 즉각 진정", "톤 리셋", "투명한 광채"],
      fits: ["레이저 토닝 후", "피부 열감/붉어짐", "칙칙한 피부톤 개선", "After Toning Moment", "Heat Relief Moment", "Special Glow Moment"],
      not_fits: ["라인/탄력이 주목적인 경우", "리프팅 시술 직후"],
      usage: "주 1~2회 집중 적용 / 시술 후 당일~72시간",
      timing: "레이저/IPL/토닝 시술 후 귀가 즉시",
    },
    not_competition_note: "두 제품은 우열 비교가 아닌 상황 적합도 분기입니다. 같은 상황에서도 두 제품이 함께 필요할 수 있습니다.",
    faq: [
      { q: "두 제품 중 어떤 것이 더 좋은가요?", a: "더 좋은 제품은 없습니다. 당신의 시술 종류와 현재 피부 상황에 따라 적합한 제품이 다를 뿐입니다. 라인 리셋이 목적이면 메디텐션, 열감·광채 리셋이 목적이면 메디글로우입니다." },
      { q: "두 제품을 함께 써도 되나요?", a: "네. 리프팅 시술 후 열감도 있다면 메디글로우로 열감을 먼저 진정한 후, 다음 날 메디텐션으로 라인을 리셋하는 방식으로 함께 활용하실 수 있습니다." },
    ],
  },
};

export default async function ComparePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const tc = getTenantConfig(tenant);
  const compare = COMPARE_DATA["meditension-vs-mediglow"];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-200 py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <Link href={`/${tenant}/moments`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> 리셋 모먼트로 돌아가기
        </Link>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">
            Fit Split — 우열이 아닌 상황 분기
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            메디텐션 vs 메디글로우
          </h1>
        </div>

        {/* Not Competition Notice */}
        <div className="rounded-2xl p-5 border border-amber-900/20 bg-amber-950/10 text-center mb-10">
          <ShieldCheck className="w-5 h-5 mx-auto mb-2" style={{ color: GOLD }} />
          <p className="text-sm text-slate-300 leading-relaxed">
            {compare.not_competition_note}
          </p>
        </div>

        {/* Fit Split Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {[compare.product_a, compare.product_b].map((p) => (
            <div key={p.name} className="rounded-2xl p-8 border border-white/5 bg-white/[0.02]">
              <div className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                style={{ color: p.color, backgroundColor: `${p.color}18` }}>
                {p.badge}
              </div>
              <h2 className="text-2xl font-black text-white mb-1">{p.name}</h2>
              <p className="text-slate-500 text-sm mb-2">{p.sub}</p>
              <p className="text-xs text-slate-600 mb-6 italic">{p.formulation}</p>

              {/* Benefits */}
              <div className="mb-5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">주요 효능</div>
                <div className="flex flex-wrap gap-2">
                  {p.benefits.map(b => (
                    <span key={b} className="text-xs px-2.5 py-1 rounded-full border"
                      style={{ color: p.color, borderColor: `${p.color}30` }}>{b}</span>
                  ))}
                </div>
              </div>

              {/* Fits */}
              <div className="mb-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">✅ 이럴 때 사용</div>
                <ul className="space-y-1.5">
                  {p.fits.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Fits */}
              <div className="mb-6">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">🚫 이럴 때는 비적합</div>
                <ul className="space-y-1.5">
                  {p.not_fits.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-500 line-through">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timing */}
              <div className="rounded-lg p-3 bg-white/[0.03] mb-6 text-xs text-slate-400">
                <span className="font-bold text-slate-300">최적 타이밍:</span> {p.timing}<br />
                <span className="font-bold text-slate-300">사용 빈도:</span> {p.usage}
              </div>

              <Link href={`/${tenant}/products/${p.slug}`}
                className="text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: p.color }}>
                {p.name} 상세 보기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Decision Matrix Table */}
        <div className="rounded-2xl overflow-hidden border border-white/5 mb-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left p-4 text-slate-500 font-medium">상황/목적</th>
                <th className="text-center p-4 font-bold" style={{ color: "#c8a2c8" }}>메디텐션</th>
                <th className="text-center p-4 font-bold" style={{ color: GOLD }}>메디글로우</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["리프팅/HIFU 시술 후", "✅ 최적", "△ 보조 가능"],
                ["레이저 토닝/IPL 시술 후", "△ 보조 가능", "✅ 최적"],
                ["페이스라인 리셋", "✅ 최적", "❌ 비적합"],
                ["열감/붉어짐 진정", "❌ 비적합", "✅ 최적"],
                ["광채/피부톤 균일화", "△ 보조 가능", "✅ 최적"],
                ["중요한 날 D-1 준비", "✅ 최적", "△ 보조 가능"],
                ["수분 공급", "✅ 동시 제공", "✅ 동시 제공"],
              ].map(([situation, a, b]) => (
                <tr key={situation} className="border-t border-white/5 hover:bg-white/[0.01]">
                  <td className="p-4 text-slate-300">{situation}</td>
                  <td className="p-4 text-center text-sm">{a}</td>
                  <td className="p-4 text-center text-sm">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-widest mb-5 text-slate-500">자주 묻는 질문</div>
          <div className="space-y-4">
            {compare.faq.map((item) => (
              <div key={item.q} className="rounded-2xl p-6 border border-white/5 bg-white/[0.02]">
                <p className="font-bold text-white mb-3">{item.q}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center border-t border-white/5 pt-10">
          <Link href={`/${tenant}/moments`}
            className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:border-white/20 text-sm font-bold text-center transition-all">
            리셋 모먼트로 상황 선택하기
          </Link>
          <Link href={`/${tenant}/products`}
            className="px-6 py-3 rounded-xl text-black text-sm font-bold text-center transition-all hover:scale-105"
            style={{ backgroundColor: GOLD }}>
            전체 제품 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
