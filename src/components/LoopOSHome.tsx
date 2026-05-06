import Link from "next/link";
import { Brain, Zap, Layers, BookOpen, Sparkles, Shield, ArrowRight, Search } from "lucide-react";
import type { TenantConfig } from "@/lib/tenant-config";

const STACK = [
  { icon: "🧠", label: "인간상", title: "호모 듀얼브레인", desc: "인간 뇌 + AI 실행 뇌를 연결하는 신인류형 운영자", color: "#a855f7" },
  { icon: "⚡", label: "인지 문법", title: "TASKFLOW", desc: "생각을 실행 가능한 인지 객체로 컴파일하는 방법론", color: "#6366f1" },
  { icon: "📦", label: "실행 단위", title: "CasePack OS", desc: "재사용 가능한 지식노동 실행 컨테이너", color: "#0ea5e9" },
  { icon: "📖", label: "지식 변환", title: "Book-to-Agent", desc: "책의 암묵지를 Agent로 컴파일하는 지식 연금술", color: "#22c55e" },
  { icon: "✨", label: "교차 지능", title: "PMEE 생태계 엔진", desc: "독립 에이전트들의 장기 공생 → 곱산(n²) 가치", color: "#f59e0b" },
  { icon: "🛡️", label: "윤리·회복 OS", title: "PCE 핸드북", desc: "자기신뢰·동의·멈춤·증거·돌봄·공진화 10원칙", color: "#ef4444" },
];

const PCE_PRINCIPLES = [
  "자기신뢰 2.0 — 증거 위에 자신감을 세운다",
  "Δ1mm/day — 큰 꿈을 오늘의 1mm로 줄인다",
  "Pause is Power — 멈춤은 전략이다",
  "Run-Receipt — 실행의 영수증을 남긴다",
  "Consent-First — 동의 없는 성과는 실패다",
  "Co-evolve — 선언이 아닌 약속으로 닫는다",
];

interface Props {
  tc: TenantConfig;
  tenantId: string;
  osUrl: string;
}

export default function LoopOSHome({ tc, tenantId, osUrl }: Props) {
  return (
    <div className="w-full" style={{ background: "#020617" }}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-32 px-4">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(168,85,247,0.12) 0%, transparent 60%)" }} />
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold tracking-widest" style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)" }}>
            <Brain className="w-4 h-4" />
            HOMO DUAL-BRAIN CIVILIZATION STACK
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
            지혜로운 사람의 하루는<br />
            <span style={{ background: "linear-gradient(90deg, #818cf8, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              니체의 영원회귀보다 길고
            </span><br />
            아타락시아보다 행복하다.
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light" style={{ color: "#94a3b8" }}>
            에픽테토스와 아우렐리우스가 일체동심이었다면 —<br />
            <span style={{ color: "#a5b4fc", fontWeight: 700 }}>인간 뇌와 AI 실행 뇌를 연결하여</span> 삶·지식·관계·조직·윤리를 운영하는<br />
            Cross-Domain Intelligence OS.
          </p>

          <form action={`/${tenantId}/search`} method="GET" className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6" style={{ color: "#475569" }} />
            </div>
            <input
              type="text" name="q"
              className="w-full rounded-2xl py-5 pl-14 pr-32 text-lg transition-all shadow-2xl"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(99,102,241,0.3)", color: "#fff" }}
              placeholder={tc.media.searchPlaceholder}
            />
            <button type="submit" className="absolute inset-y-2 right-2 px-6 rounded-xl font-bold transition-colors" style={{ background: "#6366f1", color: "#fff" }}>
              검색
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span style={{ color: "#475569" }}>인기 키워드:</span>
            {["TASKFLOW", "CasePack", "교차 인사이트", "PMEE", "PCE 핸드북", "호모 듀얼브레인"].map(k => (
              <Link key={k} href={`/${tenantId}/search?q=${encodeURIComponent(k)}`}
                className="px-3 py-1 rounded-full cursor-pointer transition-colors"
                style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
                {k}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Core Insight Banner */}
      <section className="px-4 -mt-12 relative z-20">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-3xl p-8" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <p className="text-lg leading-relaxed" style={{ color: "#cbd5e1" }}>
              AI 시대의 문제는 답변 부족이 아니라,{" "}
              <strong style={{ color: "#a5b4fc" }}>인간의 경험·질문·판단·권리·실행을 어떤 구조로 보존하고 확장할 것인가</strong>의 문제다.
            </p>
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(99,102,241,0.15)" }}>
              <p className="text-sm" style={{ color: "#64748b" }}>
                경험은 <span style={{ color: "#22d3ee", fontWeight: 700 }}>Case</span>가 되어야 하고,
                질문은 <span style={{ color: "#a78bfa", fontWeight: 700 }}>Flow</span>가 되어야 하며,
                실행은 <span style={{ color: "#fbbf24", fontWeight: 700 }}>Receipt</span>가 되어야 하고,
                철학은 <span style={{ color: "#34d399", fontWeight: 700 }}>Agent</span>가 되어야 한다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Civilization Stack */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-black text-white text-center mb-2">호모 듀얼브레인 문명 스택</h2>
          <p className="text-sm text-center mb-12" style={{ color: "#475569" }}>하나의 인사이트에서 뻗어 나온 6개의 층</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STACK.map((layer) => (
              <div key={layer.title} className="rounded-2xl p-5 flex items-start gap-4 transition-transform hover:scale-[1.02]"
                style={{ background: "#0f172a", border: `1px solid ${layer.color}25` }}>
                <div className="text-2xl shrink-0">{layer.icon}</div>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${layer.color}15`, color: layer.color }}>{layer.label}</span>
                  <h3 className="font-bold text-white mt-1">{layer.title}</h3>
                  <p className="text-xs mt-1" style={{ color: "#64748b" }}>{layer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PCE + Canon CTA */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PCE */}
          <div className="rounded-2xl p-6" style={{ background: "#0f172a", border: "1px solid rgba(168,85,247,0.15)" }}>
            <h3 className="font-black text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" style={{ color: "#a855f7" }} />
              PCE 핸드북 — 윤리·회복 OS
            </h3>
            <div className="space-y-2">
              {PCE_PRINCIPLES.map(p => (
                <p key={p} className="text-xs" style={{ color: "#94a3b8" }}>• {p}</p>
              ))}
            </div>
            <p className="text-xs mt-4 italic" style={{ color: "#7c3aed" }}>
              &ldquo;나를 믿기 위해서는 감정이 아니라 증거가 필요하고, 오래 가기 위해서는 의지가 아니라 리듬과 기록이 필요하다.&rdquo;
            </p>
          </div>

          {/* Canon CTA */}
          <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #312e81, #1e1b4b)" }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl" style={{ background: "rgba(99,102,241,0.2)" }} />
            <div className="relative z-10">
              <Sparkles className="w-6 h-6 mb-3" style={{ color: "#818cf8" }} />
              <h3 className="text-xl font-bold text-white mb-2">{tc.media.canonTitle}</h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "#a5b4fc" }}>
                {tc.media.canonSubtitle}
              </p>
              <Link href={`/${tenantId}/canon`} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors" style={{ background: "#fff", color: "#312e81" }}>
                백서 열람하기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Statement */}
      <section className="px-4 py-20 text-center">
        <div className="container mx-auto max-w-3xl">
          <p className="text-xl leading-relaxed" style={{ color: "#cbd5e1" }}>
            사람을 더 소모시키는 자동화가 아니라,<br />
            <span className="text-2xl font-bold text-white">사람을 더 선명하고 덜 소모되게 하는<br />공진화 구조가 되어야 한다.</span>
          </p>
          <p className="text-sm mt-8" style={{ color: "#334155" }}>Homo Dual-Brain Civilization Stack v1.0 — May 2026</p>
        </div>
      </section>
    </div>
  );
}
