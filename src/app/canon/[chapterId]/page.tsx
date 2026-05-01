"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Target, Link as LinkIcon, CheckCircle2, MessageSquareText, Shield, User, GitMerge } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const MOCK_FOLLOW_UPS = [
  { id: "f1", type: "L", typeLabel: "시민 저널링", title: "당정분리? 부동산 카페는 집값 얘기뿐입니다", author: "VG-1024", date: "2시간 전" },
  { id: "f2", type: "C", typeLabel: "실험 리포트", title: "대학생 10명 인터뷰: 야당 논리에 대한 20대 반응", author: "VG-4521", date: "5시간 전" },
  { id: "f3", type: "I", typeLabel: "관점 다이버전스", title: "보배드림 베스트글의 논리적 모순점 3가지 해체", author: "VG-8811", date: "12시간 전" }
];

export default function CanonChapterPage({ params }: { params: { chapterId: string } }) {
  // In a real app, fetch based on params.chapterId. Using dummy data for prototype.
  const chapter = {
    vol: "Vol. 1 국가의 뼈대",
    title: "왜 다시 당정분리인가: 권력의 분산과 책임의 집중",
    date: "2026. 04. 15",
    author: "김민석 국무총리",
    paragraphs: [
      { id: "p1", text: "대통령과 여당이 혼연일체가 되어야 국정이 안정된다는 것은 환상이다. 과거 정치사를 보라. 권력이 한 곳으로 집중될수록 작은 충격에도 국가 전체가 흔들리는 구조적 취약성을 갖게 된다." },
      { id: "p2", text: "당정일체는 필연적으로 행정부의 거수기 역할을 하는 여당을 낳는다. 여당이 행정에 대한 견제 기능을 상실하면, 민심의 경고음은 대통령실에 닿기 전에 소멸된다. 이는 곧 정권의 위기로 직결된다." },
      { id: "p3", text: "우리가 당정분리를 외치는 이유는 당내 권력 투쟁이 아니다. 국가 시스템의 복원력(Resilience)을 확보하기 위함이다. 행정부는 속도전을 치르고, 당은 그 속도전이 놓친 민심의 사각지대를 보완하는 '이중 방어벽'이 되어야 한다." },
      { id: "p4", text: "따라서 당대표와 국무총리의 역할을 분리하는 것은 행정의 전문성과 정치의 확장성을 동시에 쥐기 위한 현대 정치의 필연적 구조개혁이다. 이를 특권의 파편화로 해석하는 것은 정치의 본질을 외면한 낡은 프레임이다." }
    ]
  };

  const [selectedParagraph, setSelectedParagraph] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Weaponization Tool: Simulate copying a direct anchor link + utm tag
  const handleWeaponize = (pid: string, text: string) => {
    const url = `https://phalanx.co/canon/${params.chapterId}#${pid}?utm_vanguard=VG-9932`;
    const payload = `[VQCP Statesman]\n"${text}"\n\n📌 원문 좌표: ${url}`;
    
    // navigator.clipboard.writeText(payload);
    // Simulated copy for prototype
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setSelectedParagraph(null);
    }, 2000);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-32">
      
      {/* Editorial Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur border-b border-slate-200 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/canon" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition">
            <ArrowLeft className="w-4 h-4" /> 목차로 돌아가기
          </Link>
          <div className="flex items-center gap-3">
            <button className="text-slate-500 hover:text-indigo-600 transition p-2">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 pt-32 relative">
        
        {/* Article Header */}
        <header className="mb-16">
          <div className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-4">
            {chapter.vol}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8 font-serif break-keep">
            {chapter.title}
          </h1>
          <div className="flex items-center gap-4 text-slate-500 text-sm font-mono border-t border-b border-slate-200 py-4">
            <span className="font-bold text-slate-800">{chapter.author}</span>
            <span>•</span>
            <span>{chapter.date}</span>
          </div>
        </header>

        {/* Article Body (The Canon) */}
        <article className="prose prose-lg prose-slate max-w-none font-serif leading-loose text-slate-800">
          {chapter.paragraphs.map((para) => (
            <div 
              key={para.id} 
              id={para.id}
              className="relative group mb-8"
              onMouseEnter={() => setSelectedParagraph(para.id)}
              onMouseLeave={() => setSelectedParagraph(null)}
            >
              <p className="text-xl md:text-2xl leading-[1.8] font-light text-[#2C2C2C] text-justify break-keep">
                {para.text}
              </p>

              {/* Weaponize Tooltip (Vanguard Feature) */}
              <AnimatePresence>
                {selectedParagraph === para.id && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -left-16 top-2 hidden md:flex flex-col gap-2"
                  >
                    <button 
                      onClick={() => handleWeaponize(para.id, para.text)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full shadow-lg group-hover:block transition"
                      title="이 문단을 무기로 변환 (좌표 복사)"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                    </button>
                    <button 
                      className="bg-white border border-slate-200 text-slate-500 hover:text-slate-900 p-2.5 rounded-full shadow-sm group-hover:block transition"
                      title="단순 링크 복사"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Mobile Tooling */}
              <div className="md:hidden mt-2 flex gap-2">
                 <button 
                    onClick={() => handleWeaponize(para.id, para.text)}
                    className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    {copied ? <CheckCircle2 className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                    문단 좌표 복사 (Weaponize)
                 </button>
              </div>

            </div>
          ))}
        </article>

        {/* Vanguard Swarm-Canon (Hive Tree) */}
        <div className="mt-20 pt-16 border-t-2 border-slate-900 border-dashed">
           <div className="flex items-center gap-3 mb-8">
             <GitMerge className="w-8 h-8 text-fuchsia-600" />
             <div>
               <h2 className="text-2xl font-black text-slate-900 leading-none">Vanguard Oiticles</h2>
               <p className="text-sm font-bold text-slate-500 mt-1">이 정전(Prime Canon)을 바탕으로 배포된 전위대 파생 기사망</p>
             </div>
           </div>

           <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
             {MOCK_FOLLOW_UPS.map(article => (
               <div key={article.id} className="relative">
                 <div className="absolute -left-[29px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-slate-300 rounded-full"></div>
                 <div className="bg-white border border-slate-200 hover:border-fuchsia-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer group">
                   <div className="flex items-center gap-3 mb-2">
                     <span className="text-[10px] uppercase font-black text-white bg-fuchsia-600 px-2 py-0.5 rounded-sm">유형 {article.type}</span>
                     <span className="text-xs font-bold text-slate-500">{article.typeLabel}</span>
                   </div>
                   <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-fuchsia-600 transition-colors">↳ {article.title}</h3>
                   <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                     <div className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</div>
                     <div>{article.date}</div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Footer Vanguard CTA */}
        <div className="mt-16 pt-12 border-t border-slate-200 bg-slate-50 p-8 rounded-3xl text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">당신만의 전술 파생글(Oiticle)을 투척하십시오.</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            요원 번호가 포함된 고유 인용 링크를 병영(Garrison)으로 복사하여, 당신만의 논리가 담긴 후속 무기를 주조하십시오.
          </p>
          <button 
            onClick={() => window.location.href = `http://localhost:3000/v-dash/oiticle/write?seed=${params.chapterId}`}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
          >
             전위대 작전 통제실 연결
          </button>
        </div>

      </main>

      {/* Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-3 text-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 문단 좌표 무기화 완료 (클립보드 복사됨)
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
