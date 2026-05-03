import type { Metadata } from "next";
import { Suspense } from "react";
import { TelemetryProvider } from "@/components/telemetry-provider";
import "../globals.css";
import { getTenantConfig } from "@/lib/tenant-config";
import { MobileNav } from "@/components/MobileNav";
import {
  Newspaper, BookOpen, Landmark, Trophy, MessageSquare,
  ChevronDown, ExternalLink
} from "lucide-react";
import { StickyHeader } from "@/components/StickyHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WeddingNav } from "@/components/WeddingNav";

export const metadata: Metadata = {
  title: "Phalanx Media Hub | 공식 검증 자료실",
  description: "공식 문서와 데이터 포렌식을 통한 검증된 팩트체크를 제공하는 미디어 허브입니다.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ tenant: string }> }>) {
  const p = await params;
  const tenantId = p.tenant || process.env.NEXT_PUBLIC_TENANT_ID || "phalanx";
  const tc = getTenantConfig(tenantId);

  const themeVars = {
    "--primary": tc.theme.primaryColor,
    "--accent": tc.theme.accentColor,
    "--selection": tc.theme.selectionColor,
  } as React.CSSProperties;

  const osUrl = process.env.NEXT_PUBLIC_OS_URL || "https://phalanx-os.vercel.app";
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: "https://phalanx.co",
    name: tc.displayName,
    description: `${tc.displayName} SSoT 허브`,
  };

  const terminology = tc.terminology;

  return (
    <div className="font-sans min-h-screen bg-[var(--surface-secondary)] text-[var(--text-primary)] flex flex-col antialiased" style={themeVars}>
        <ThemeProvider>
        <Suspense fallback={null}>
          <TelemetryProvider />
        </Suspense>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />

        {/* ── Global Navigation Header (DS-8: Sticky shrink) ── */}
        <StickyHeader>

            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2.5 font-black text-xl tracking-tighter hover:opacity-80 transition-opacity flex-shrink-0"
              style={{ color: "var(--primary)" }}
            >
              <span
                className="w-5 h-5 rounded-bl-xl rounded-tr-xl flex-shrink-0"
                style={{ backgroundColor: "var(--primary)" }}
              />
              {tc.displayName.split(" ")[0]}
              <span className="font-light text-sm hidden sm:inline text-slate-400">
                {tc.vertical === "sales" ? "공식 카탈로그" : "공식 검증 자료실"}
              </span>
            </a>

            {/* ── Center: Desktop Nav (vertical-polymorphic) ── */}
            {tc.vertical === 'wedding' ? (
              <WeddingNav osUrl={osUrl} />
            ) : tc.vertical === 'clinic_derma' ? (
              <nav className="hidden md:flex items-center gap-1 text-sm font-semibold h-full flex-1 justify-center" style={{ color: tc.theme.primaryColor }}>
                <a href={`/${tenantId}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">홈</a>
                <a href={`/${tenantId}/moments`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">이럴 때 DR.O</a>
                <a href={`/${tenantId}/compare`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">제품 비교</a>
                <a href={`/${tenantId}/routines`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">루틴 가이드</a>
                <a href={`/${tenantId}/products`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">제품</a>
              </nav>
            ) : (
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-700 h-full flex-1 justify-center">

              {/* Group 1: 콘텐츠 */}
              <div className="group h-full flex items-center relative">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700">
                  <Newspaper className="w-4 h-4" />
                  콘텐츠
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute top-full mt-[-1px] left-0 hidden group-hover:block z-50 pt-2">
                  <div className="bg-white border border-slate-200 shadow-xl rounded-2xl py-2 min-w-[200px]">
                    <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">콘텐츠</div>
                    <a href={`/${tenantId}/webzine`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      <Newspaper className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="font-semibold">웹진</div>
                        <div className="text-xs text-slate-400">최신 기사 · 사설 · 인터뷰</div>
                      </div>
                    </a>
                    <a href={`/${tenantId}/webzine?category=editorial`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 pl-10 transition-colors">
                      사설 / 오피니언
                    </a>
                    <a href={`/${tenantId}/webzine?category=interview`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 pl-10 transition-colors">
                      스페셜 인터뷰
                    </a>
                    <a href={`/${tenantId}/webzine?category=trend`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 pl-10 transition-colors">
                      트렌드 리포트
                    </a>
                    <div className="h-px bg-slate-100 my-1" />
                    <a href={`/${tenantId}/canon`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="font-semibold">{terminology.canon} (정답카드)</div>
                        <div className="text-xs text-slate-400">팩트체크 · 정책 · FAQ</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Group 2: 커뮤니티 */}
              <div className="group h-full flex items-center relative">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700">
                  <MessageSquare className="w-4 h-4" />
                  커뮤니티
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute top-full mt-[-1px] left-0 hidden group-hover:block z-50 pt-2">
                  <div className="bg-white border border-slate-200 shadow-xl rounded-2xl py-2 min-w-[220px]">
                    <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">커뮤니티</div>
                    <a href={`/${tenantId}/experts`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      <Landmark className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="font-semibold">전문가 네트워크</div>
                        <div className="text-xs text-slate-400">Authority 전문가 · 자문 요청</div>
                      </div>
                    </a>
                    <a href={`/${tenantId}/challenges`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      <Trophy className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="font-semibold">챌린지</div>
                        <div className="text-xs text-slate-400">포토 · 기고 · 정책 아이디어 공모</div>
                      </div>
                    </a>
                    <a href={`/${tenantId}/agora`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" style={{ color: "var(--accent)" }}>
                      <MessageSquare className="w-4 h-4" />
                      <div>
                        <div className="font-semibold">{terminology.agora}</div>
                        <div className="text-xs text-slate-400 text-slate-400">질문 · 토론 · 시민 의견</div>
                      </div>
                    </a>
              </div>

              {/* CMS (Added for Media Enhancement) */}
              <div className="group h-full flex items-center">
                <a href={`/${tenantId}/cms`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
                  <FileText className="w-4 h-4" />
                  콘텐츠 데스크
                </a>
              </div>
            </nav>
            )}

            {/* Right CTA */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href={`${osUrl}/${tenantId}/home`}
                className="hidden sm:flex items-center gap-2 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors shadow-md"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                {tc.vertical === 'wedding' ? '앰배서더 참여 →' : '참여 공간 →'}
              </a>

              {/* DS-10: Dark Mode Toggle */}
              <ThemeToggle />

              {/* Mobile Nav (WP-4) */}
              <MobileNav osUrl={`${osUrl}/${tenantId}`} terminology={terminology} />
            </div>
        </StickyHeader>

        <main className="flex-1 w-full relative">{children}</main>

        {/* ── Global Footer (WP-7 synced) ── */}
        <footer className="border-t bg-slate-900 text-slate-400 py-16 mt-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 font-black text-white text-lg mb-3">
                  <span className="w-4 h-4 rounded-bl-lg rounded-tr-lg" style={{ backgroundColor: "var(--primary)" }} />
                  {tc.displayName}
                </div>
                <p className="text-sm leading-relaxed">
                  본 사이트의 데이터는 감정을 배제하고 공식 문서와 데이터를 근거로 발행됩니다.
                </p>
              </div>

              {/* 콘텐츠 */}
              <div>
                <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">콘텐츠</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href={`/${tenantId}/webzine`} className="hover:text-white transition-colors">웹진</a></li>
                  <li><a href={`/${tenantId}/webzine?category=editorial`} className="hover:text-white transition-colors">사설 / 오피니언</a></li>
                  <li><a href={`/${tenantId}/webzine?category=trend`} className="hover:text-white transition-colors">트렌드 리포트</a></li>
                  <li><a href={`/${tenantId}/canon`} className="hover:text-white transition-colors">{terminology.canon} (정답카드)</a></li>
                </ul>
              </div>

              {/* 커뮤니티 */}
              <div>
                <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">커뮤니티</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href={`/${tenantId}/experts`} className="hover:text-white transition-colors">전문가 네트워크</a></li>
                  <li><a href={`/${tenantId}/challenges`} className="hover:text-white transition-colors">챌린지</a></li>
                  <li><a href={`/${tenantId}/agora`} className="hover:text-white transition-colors">{terminology.agora}</a></li>
                </ul>
              </div>

              {/* 시민 참여 CTA */}
              <div>
                <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">시민 참여</h4>
                <p className="text-sm mb-4 leading-relaxed">
                  플랫폼 검증 활동에 함께하고 싶다면, 참여 공간으로 이동하십시오.
                </p>
                <a
                  href={`${osUrl}/${tenantId}/home`}
                  className="inline-flex items-center gap-2 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  참여자 홈 →
                </a>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6 text-center text-xs">
              © 2026 {tc.displayName}. All Rights Reserved.
            </div>
          </div>
        </footer>
        </ThemeProvider>
    </div>
  );
}
