"use client";

import Link from "next/link";
import { ArrowRight, Clock, Sparkles, ShieldCheck } from "lucide-react";
import type { TenantConfig } from "@/lib/tenant-config";

// ── Reset Moment Card Data (shown in ResetMomentRouter) ──────────────────────
const RESET_MOMENTS = [
  { slug: "clinic-care",  name: "Clinic-Care",  emoji: "🏥", situation: "시술 후 집에서 뭘 써야 하나요?",  product_hint: "메디텐션" },
  { slug: "special-day",  name: "Special Day",  emoji: "✨", situation: "중요한 날 전날 어떻게 준비하나요?", product_hint: "메디텐션" },
  { slug: "after-toning", name: "After Toning", emoji: "🌡️", situation: "토닝 후 열감, 어떻게 진정시키나요?", product_hint: "메디글로우" },
  { slug: "heat-relief",  name: "Heat Relief",  emoji: "❄️", situation: "피부가 빨개지고 열이 나요",           product_hint: "메디글로우" },
  { slug: "special-glow", name: "Special Glow", emoji: "💫", situation: "칙칙한 톤을 빠르게 환하게 하고 싶어요", product_hint: "메디글로우" },
];

const SITUATION_CARDS = [
  {
    question: "시술 후 집에서 뭘 써야 하나요?",
    type: "situation",
    short_answer: "시술 종류에 따라 목적이 다릅니다. 리프팅 후엔 라인 리셋, 토닝 후엔 열감 진정과 광채 리셋이 우선입니다.",
    product_slug: "meditension-hydrogel-mask",
    product_name: "메디텐션",
    moment_slug: "clinic-care",
    cta_label: "리셋 솔루션 찾기",
  },
  {
    question: "메디텐션과 메디글로우는 어떻게 다른가요?",
    type: "compare",
    short_answer: "두 제품은 우열 비교가 아닌 상황 분기입니다. 메디텐션은 라인 리셋, 메디글로우는 열감·광채 리셋에 최적입니다.",
    product_slug: null,
    product_name: null,
    moment_slug: null,
    cta_label: "Fit Split 비교 보기",
    cta_href: "compare",
  },
  {
    question: "중요한 날 전날 어떻게 준비하나요?",
    type: "action",
    short_answer: "D-1 저녁, 메디텐션 하이드로겔 마스크 20분 집중 리프팅. 데일리 루틴이 아닌 단 한 번의 정확한 개입.",
    product_slug: "meditension-hydrogel-mask",
    product_name: "메디텐션",
    moment_slug: "special-day",
    cta_label: "D-1 루틴 보기",
  },
  {
    question: "DR.O는 데일리 스킨케어인가요?",
    type: "brand_truth",
    short_answer: "아닙니다. DR.O는 주 1~2회 사용하는 집중형 스페셜 트리트먼트입니다. 매일 바르는 제품이 아닙니다.",
    product_slug: null,
    product_name: null,
    moment_slug: null,
    cta_label: "DR.O란? 자세히 보기",
    cta_href: "canon?category=brand_truth",
  },
];

interface Props {
  tc: TenantConfig;
  tenantId: string;
  osUrl: string;
}

export default function DROHome({ tc, tenantId, osUrl }: Props) {
  const gold = tc.theme.primaryColor; // #cda434

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-200 font-sans">

      {/* ── Section 1: Hero Brand Thesis ───────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0f0f0f] to-[#0f0f0f]" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #cda434 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Brand category pill */}
          <div className="inline-flex items-center gap-2 border border-amber-700/40 rounded-full px-4 py-1.5 mb-8 text-xs font-semibold tracking-widest uppercase"
            style={{ color: gold, backgroundColor: 'rgba(205,164,52,0.08)' }}>
            <Sparkles className="w-3 h-3" />
            Clinic-derived Home Derma Reset Solution
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}>
            {tc.media.heroTitle}
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            {tc.media.heroSubtitle}
          </p>

          {/* Primary CTA — not product first, situation first */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${tenantId}/moments`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black transition-all hover:scale-105 hover:shadow-2xl"
              style={{ backgroundColor: gold }}>
              지금 내 상황 선택하기 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/${tenantId}/compare`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white border border-white/20 hover:border-amber-600/60 transition-all">
              메디텐션 vs 메디글로우
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-600">
          <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-slate-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Section 2: The Interval Explainer ───────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: gold }}>
                The Interval
              </div>
              <h2 className="text-3xl font-black text-white mb-6">
                시술과 시술 사이의<br/>공백, 그것이 The Interval
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                피부과 시술은 끝났지만, 다음 시술까지의 공백에서 피부는 조용히 무너집니다.
                DR.O는 이 공백을 정확하게 개입하여 리셋합니다.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed border-l-2 pl-4" style={{ borderColor: gold }}>
                데일리 기초가 아닙니다. 매일 바르는 제품이 아닙니다.<br/>
                정확한 타이밍에, 정확한 목적으로, 단 한 번의 개입.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "⏱️", label: "Timing", desc: "정확한 타이밍의 개입" },
                { icon: "🔄", label: "Reset", desc: "피부 상태 빠른 리셋" },
                { icon: "🏥", label: "Clinic Logic", desc: "클리닉 로직 기반 설계" },
                { icon: "🎯", label: "Context First", desc: "상황 적합성이 핵심" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl p-5 border border-white/5 bg-white/[0.02]">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-bold text-white text-sm">{item.label}</div>
                  <div className="text-slate-500 text-xs mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Reset Moment Router ──────────────────────────────────── */}
      <section className="py-20 px-6 bg-white/[0.015] border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">
              상황별 리셋 모먼트
            </div>
            <h2 className="text-3xl font-black text-white">지금 필요한 리셋 순간을 선택하세요</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESET_MOMENTS.map((m) => (
              <Link key={m.slug} href={`/${tenantId}/moments/${m.slug}`}
                className="group rounded-2xl p-6 border border-white/5 bg-white/[0.02] hover:border-amber-600/30 hover:bg-white/[0.04] transition-all">
                <div className="text-3xl mb-3">{m.emoji}</div>
                <div className="font-bold text-white mb-2">{m.name}</div>
                <div className="text-slate-400 text-sm mb-4 leading-relaxed">{m.situation}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-1 rounded-md"
                    style={{ color: gold, backgroundColor: 'rgba(205,164,52,0.1)' }}>
                    → {m.product_hint}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Hero Fit Split Compare ───────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">
              Fit Split — 우열이 아닌 상황 분기
            </div>
            <h2 className="text-3xl font-black text-white mb-2">메디텐션 vs 메디글로우</h2>
            <p className="text-slate-500 text-sm">두 제품은 경쟁이 아닙니다. 당신의 상황에 따라 분기됩니다.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {[
              {
                name: "메디텐션", sub: "하이드로겔 마스크",
                badge: "라인 · 리프팅 리셋",
                fits: ["리프팅 후", "페이스라인 처짐", "중요한 날 전 라인 정리", "Clinic-Care", "Special Day"],
                color: "#c8a2c8", slug: "meditension-hydrogel-mask",
              },
              {
                name: "메디글로우", sub: "모델링 마스크",
                badge: "열감 · 광채 리셋",
                fits: ["토닝 후 열감", "칙칙한 피부톤", "투명한 광채 준비", "After Toning", "Heat Relief"],
                color: gold, slug: "mediglow-modeling-mask",
              },
            ].map((product) => (
              <div key={product.name} className="rounded-2xl p-8 border border-white/5 bg-white/[0.02]">
                <div className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                  style={{ color: product.color, backgroundColor: `${product.color}15` }}>
                  {product.badge}
                </div>
                <h3 className="text-2xl font-black text-white mb-1">{product.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{product.sub}</p>
                <ul className="space-y-2 mb-8">
                  {product.fits.map((fit) => (
                    <li key={fit} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: product.color }} />
                      {fit}
                    </li>
                  ))}
                </ul>
                <Link href={`/${tenantId}/products/${product.slug}`}
                  className="text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: product.color }}>
                  제품 상세 보기 <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href={`/${tenantId}/compare`}
              className="text-sm text-slate-500 hover:text-amber-500 transition-colors">
              → 두 제품 Fit Split 비교 전체 보기
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 5: Situation Answer Cards ───────────────────────────────── */}
      <section className="py-20 px-6 bg-white/[0.015] border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Answer Hub</div>
            <h2 className="text-3xl font-black text-white">상황별 정답을 확인하세요</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {SITUATION_CARDS.map((card) => (
              <div key={card.question} className="rounded-2xl p-6 border border-white/5 bg-white/[0.02]">
                <div className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">
                  {card.type === 'brand_truth' ? 'Brand Truth' : card.type === 'compare' ? 'Compare' : card.type === 'situation' ? 'Situation' : 'Action'}
                </div>
                <p className="font-bold text-white mb-3 leading-snug">{card.question}</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{card.short_answer}</p>
                <Link href={`/${tenantId}/${card.cta_href || `moments/${card.moment_slug}`}`}
                  className="text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: gold }}>
                  {card.cta_label} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Trust Layer ───────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Clinic Logic & Expert Trust</div>
            <h2 className="text-3xl font-black text-white">Oracle Dermatology Network 기반</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🏥", title: "20년 시술 노하우", desc: "Oracle Dermatology Network의 20년 이상 임상 데이터를 재설계했습니다." },
              { icon: "🧬", title: "전문의 직접 참여", desc: "피부과 전문의, 전문가, 뷰티 인플루언서 그룹이 기획·포뮬러 설계·임상 테스트에 참여했습니다." },
              { icon: "⚗️", title: "Medical Active Ingredients", desc: "Advanced Formulation과 구조적 포뮬레이션으로 즉각 체감 효과를 설계했습니다." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl p-6 border border-white/5 bg-white/[0.02]">
                <div className="text-3xl mb-4">{item.icon}</div>
                <div className="font-bold text-white mb-2">{item.title}</div>
                <div className="text-slate-400 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href={`/${tenantId}/canon?category=trust_evidence`}
              className="text-sm font-bold hover:underline" style={{ color: gold }}>
              Clinic Logic 백서 전체 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 7: Boundary Layer ────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white/[0.015] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl p-8 border border-amber-900/20 bg-amber-950/10 text-center">
            <ShieldCheck className="w-10 h-10 mx-auto mb-4" style={{ color: gold }} />
            <h3 className="text-xl font-black text-white mb-4">DR.O는 시술 대체가 아닙니다</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-left">
              {[
                { no: "일반 마스크팩 브랜드가 아닙니다", yes: "클리닉 로직 기반 홈 트리트먼트" },
                { no: "매일 바르는 데일리 기초가 아닙니다", yes: "주 1~2회 집중형 스페셜 트리트먼트" },
                { no: "시술을 대체하지 않습니다", yes: "시술과 시술 사이의 홈케어 개입" },
                { no: "성분 중심 브랜드가 아닙니다", yes: "타이밍과 상황 적합성이 핵심" },
              ].map((item) => (
                <div key={item.no} className="rounded-lg p-3 bg-black/20">
                  <div className="text-xs text-slate-600 mb-1">🚫 {item.no}</div>
                  <div className="text-xs font-bold" style={{ color: gold }}>✓ {item.yes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 8: Ambassador CTA ────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500">Interval Expert Network</div>
          <h2 className="text-3xl font-black text-white mb-4">DR.O Interval Expert가 되어보세요</h2>
          <p className="text-slate-400 mb-8">클리닉 컨텍스트를 이해하는 전문가·고관여 고객으로 구성된 네트워크. 솔루션을 공유하고 커미션을 트래킹하세요.</p>
          <Link href={`${osUrl}/${tenantId}/ambassador`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black transition-all hover:scale-105"
            style={{ backgroundColor: gold }}>
            Interval Expert 신청하기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
