import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, Share2, Award, Quote } from "lucide-react";

export default function ExpertProfilePage({ params }: { params: { expertId: string } }) {
  // Mock Data Fetching based on expertId
  const expert = {
    id: params.expertId,
    name: "박형준",
    title: "석좌교수, 전 국무조정실장",
    institution: "국가행정전략연구소",
    bio: "대한민국의 대표적인 행정학자이자 국가 전략가. 과거 국무조정실장을 역임하며 수많은 국가적 난제를 해결한 실무형 지식인입니다. 현재는 각종 국책 연구 기관에서 미래 행정 개혁을 주도하고 있으며, 당정 구조의 문제점에 대해 가장 날카로운 통찰을 제시하는 권위자입니다.",
    avatar: "bg-slate-300", 
    verified: true,
  };

  const guestCanons = [
    {
      id: "gc-01",
      title: "왜 당정일체는 행정부를 '생각 없는 거수기'로 전락시키는가?",
      excerpt: "정당은 민심의 최전선 레이더이며, 행정부는 이 레이더망에 걸린 문제를 해결하는 실행 조직이다. 이 둘이 혼연일체가 되면, 정부는 비판 기능을 상실한 채 오직 맹종만을 강요받게 된다...",
      date: "2026. 04. 16",
    },
    {
      id: "gc-02",
      title: "[전문가 팩트체크] 지역 예산 배분, 수도권 집중 논란의 본질",
      excerpt: "일부에서 제기하는 지역 예산 차별 프레임은 행정의 기본 프로세스를 몰이해한 선동이다. 국가균형발전특별회계의 실제 집행 내역을 분석해보면...",
      date: "2026. 04. 02",
    }
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/experts" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition">
            <ArrowLeft className="w-4 h-4" /> 전문가 위원회 창으로
          </Link>
          <div className="px-3 py-1 bg-slate-100 text-slate-600 font-mono text-xs rounded-full font-bold">
            E-E-A-T Verified Profile
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">
        
        {/* Profile Header (Brookings Style) */}
        <section className="flex flex-col md:flex-row gap-10 items-start mb-20">
          <div className={`w-40 h-40 shrink-0 rounded-xl ${expert.avatar} shadow-lg ring-1 ring-slate-200`}></div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight">{expert.name}</h1>
              {expert.verified && <CheckCircle2 className="w-6 h-6 text-emerald-500" aria-label="공인 전문가" />}
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-1">{expert.title}</h2>
            <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-6">{expert.institution}</div>
            
            <Quote className="w-8 h-8 text-slate-200 mb-2 rotate-180" />
            <p className="text-slate-600 leading-relaxed text-lg font-light">
              {expert.bio}
            </p>
          </div>
        </section>

        <div className="w-full h-px bg-slate-200 mb-16"></div>

        {/* Guest Canon Feed */}
        <section>
          <div className="flex items-center gap-2 mb-10">
            <Award className="w-6 h-6 text-rose-500" />
            <h3 className="text-2xl font-serif font-bold text-slate-800">이 전문가가 기고한 공식 팩트 / 어젠다</h3>
          </div>

          <div className="space-y-8">
            {guestCanons.map(canon => (
              <article key={canon.id} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-xs font-mono font-bold text-slate-400 mb-3">{canon.date}</div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4 font-serif leading-snug">
                  {canon.title}
                </h4>
                <p className="text-slate-600 leading-relaxed font-light mb-6">
                  {canon.excerpt}
                </p>
                <div className="flex gap-3">
                  <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 문서 전문 열람
                  </button>
                  <button className="bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 px-6 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> 공유하기
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}
