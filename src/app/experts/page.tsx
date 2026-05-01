import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Landmark } from "lucide-react";

export const metadata = {
  title: "정책 및 자문 위원회 네트워크 | VQCP Statesman",
  description: "국가 전략을 보증하는 각 분야 최고 전문가와 지지 명사들의 연대망입니다.",
};

const EXPERTS_MOCK = [
  {
    id: "exp-01",
    name: "박형준",
    title: "석좌교수, 전 국무조정실장",
    institution: "국가행정전략연구소",
    category: "국정 운영 및 행정",
    avatar: "bg-slate-300", 
    contributions: 12
  },
  {
    id: "exp-02",
    name: "이수진",
    title: "보건경제학 박사",
    institution: "대한보건미래포럼",
    category: "복지 및 예산 효율화",
    avatar: "bg-slate-400",
    contributions: 8
  },
  {
    id: "exp-03",
    name: "김태영",
    title: "전 지역자치위원장",
    institution: "지방소멸위기대응본부",
    category: "지방 분권 및 주거",
    avatar: "bg-slate-500",
    contributions: 15
  },
  {
    id: "exp-04",
    name: "최성호",
    title: "데이터 사이언티스트",
    institution: "Tech & Society Lab",
    category: "미래 산업 및 AI 정책",
    avatar: "bg-slate-600",
    contributions: 5
  }
];

export default function ExpertsRosterPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      
      {/* High-end Think-Tank Header */}
      <header className="pt-32 pb-20 px-4 text-center border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-slate-500 font-bold tracking-[0.2em] text-xs uppercase mb-8">
            <Landmark className="w-5 h-5" />
            <span>Verified Experts Network (VEN)</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6 font-serif">
            지성과 경험을 무기화하다.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed mb-10 max-w-3xl mx-auto">
            캠프의 해명은 의심받을 수 있으나, 학계와 현장을 지배하는 <br className="hidden md:block"/>
            최고 전문가 네트워크의 팩트는 여론의 최종 심판 기준이 됩니다.
          </p>
          <div className="inline-flex items-center gap-2 bg-indigo-50/50 border border-indigo-200 text-indigo-800 px-6 py-3 rounded-full text-sm font-bold shadow-sm">
             <ShieldCheck className="w-5 h-5 text-indigo-600" /> 공식 기고(Guest Canon) 및 정책 보증 네트워크
          </div>
        </div>
      </header>

      {/* Roster Grid */}
      <main className="max-w-6xl mx-auto px-4 py-24">
        
        <div className="flex items-center justify-between mb-12 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-serif font-bold text-slate-800">초빙 정책/자문 위원단</h2>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            총 {EXPERTS_MOCK.length}명 등록됨
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {EXPERTS_MOCK.map((expert) => (
            <Link key={expert.id} href={`/experts/${expert.id}`} className="group block">
              <div className="bg-white border border-slate-200 rounded-lg p-6 h-full shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
                {/* Avatar Placeholder */}
                <div className={`w-20 h-20 rounded-full ${expert.avatar} mx-auto mb-6 shadow-inner ring-4 ring-slate-50 group-hover:ring-indigo-50 transition-all`}></div>
                
                <div className="text-center">
                  <div className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wider">{expert.category}</div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-1 mb-1 font-serif">
                    {expert.name} <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </h3>
                  <div className="text-sm text-slate-800 font-bold mb-1">{expert.title}</div>
                  <div className="text-xs text-slate-500 mb-6">{expert.institution}</div>
                  
                  <div className="w-8 h-px bg-slate-200 mx-auto mb-6 group-hover:bg-indigo-300 transition-colors"></div>
                  
                  <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                    발행된 팩트/어젠다: {expert.contributions}건 <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}
