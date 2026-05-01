import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { TelemetryProvider } from "@/components/telemetry-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "VQCP Statesman | 공식 문화정책 데이터 아카이브",
  description: "선거 및 정책 관련 의혹에 대한 공식적이고 검증된 팩트체크를 제공하는 정책형 미디어 허브입니다.",
  openGraph: {
    title: "VQCP Statesman | 문화강국 팩트체크",
    description: "공식 문서와 데이터 포렌식을 통한 가장 정확한 사실관계 지표.",
    url: "https://phalanx.co",
    siteName: "VQCP Statesman",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": "https://phalanx.co",
    "name": "VQCP Statesman",
    "description": "국가 문화전략 플랫폼 및 공식 팩트체크 SSoT 허브",
    "sameAs": ["https://youtube.com/minjoo"],
  };

  return (
    <html lang="ko" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 flex flex-col`}>
        <Suspense fallback={null}>
          <TelemetryProvider />
        </Suspense>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />

        {/* ── Global Navigation Header ── */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 font-black text-xl tracking-tighter text-blue-900 hover:opacity-80 transition-opacity flex-shrink-0">
              <span className="w-5 h-5 bg-blue-600 rounded-bl-xl rounded-tr-xl"></span>
              Statesman
              <span className="text-blue-400 font-light text-base hidden sm:inline">| 공식 검증 자료실</span>
            </a>

            {/* Center Nav Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600">
              <a href="/" className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
                최신 의제
              </a>
              <a href="/canon" className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
                📋 정책 칼럼
              </a>
              <a href="/experts" className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
                🏛️ 전문가 자문단
              </a>
              <a href="/agora" className="px-3 py-2 rounded-lg hover:bg-violet-50 hover:text-violet-700 transition-colors font-bold">
                💬 공론장(아고라)
              </a>
            </nav>

            {/* Right CTA */}
            <div className="flex items-center gap-3">
              <a
                href="http://localhost:3000/v-dash"
                className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors shadow-md"
              >
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                시민 참여하기 →
              </a>
              <button className="md:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="메뉴 열기">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full relative">
          {children}
        </main>

        {/* ── Global Footer ── */}
        <footer className="border-t bg-slate-900 text-slate-400 py-16 mt-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              <div>
                <div className="flex items-center gap-2 font-black text-white text-lg mb-3">
                  <span className="w-4 h-4 bg-blue-500 rounded-bl-lg rounded-tr-lg"></span>
                  VQCP Statesman
                </div>
                <p className="text-sm leading-relaxed">
                  본 사이트의 데이터는 감정을 배제하고 공식 문서와 포렌식 지표만을 근거로 발행됩니다.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-widest">탐색</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/" className="hover:text-white transition-colors">최신 팩트체크</a></li>
                  <li><a href="/canon" className="hover:text-white transition-colors">정책 칼럼</a></li>
                  <li><a href="/experts" className="hover:text-white transition-colors">전문가 자문단</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-widest">시민 참여</h4>
                <p className="text-sm mb-4">정책 검증 활동에 함께하고 싶다면, 시민 참여 공간으로 이동하십시오.</p>
                <a
                  href="http://localhost:3000/v-dash"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
                >
                  참여자 공간 →
                </a>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-6 text-center text-xs">
              © 2026 VQCP Project. All Rights Reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
