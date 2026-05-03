import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Landmark, Award } from "lucide-react";

export const metadata = {
  title: "전문가 Authority 네트워크 | Phalanx Media",
  description: "검증된 Authority Score로 신뢰를 증명하는 전문가 네트워크. 각 분야 최고의 지식 생산자들을 만나보세요.",
};

function getAuthorityTier(score: number) {
  if (score >= 90) return { label: 'Platinum', color: 'text-violet-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-200', emoji: '💎' };
  if (score >= 75) return { label: 'Gold', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', emoji: '🥇' };
  if (score >= 55) return { label: 'Silver', color: 'text-slate-600', bgColor: 'bg-slate-100', borderColor: 'border-slate-200', emoji: '🥈' };
  return { label: 'Bronze', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', emoji: '🥉' };
}

const EXPERTS = [
  { slug: 'hyungjun-park', name: '박형준', title: '석좌교수, 전 국무조정실장', institution: '국가행정전략연구소', category: '국정 운영 및 행정', score: 87, contributions: 12 },
  { slug: 'sujin-lee', name: '이수진', title: '보건경제학 박사', institution: '대한보건미래포럼', category: '복지 및 예산 효율화', score: 72, contributions: 8 },
  { slug: 'taeyoung-kim', name: '김태영', title: '전 지역자치위원장', institution: '지방소멸위기대응본부', category: '지방 분권 및 주거', score: 45, contributions: 15 },
  { slug: 'minjoo-kim', name: '김민주', title: '제품 성분 분석 전문가', institution: 'K-Beauty Lab', category: '성분 분석 · K-뷰티', score: 68, contributions: 5 },
];

export default async function ExpertsRosterPage({ params }: { params: Promise<{ tenant: string }> }) {
  const p = await params;
  const tenantId = p.tenant || process.env.NEXT_PUBLIC_TENANT_ID || "phalanx";
  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      
      {/* Think-Tank Header */}
      <header className="pt-32 pb-20 px-4 text-center border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-slate-500 font-bold tracking-[0.2em] text-xs uppercase mb-8">
            <Landmark className="w-5 h-5" />
            <span>Authority Engine — 전문가 네트워크</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6 font-serif">
            신뢰를 수치로 증명하는 전문가들.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed mb-10 max-w-3xl mx-auto">
            Authority Score로 검증된 전문가 네트워크입니다.<br className="hidden md:block" />
            각 전문가의 콘텐츠 품질, 인용 횟수, 커뮤니티 신뢰도가 실시간으로 반영됩니다.
          </p>
          <div className="inline-flex items-center gap-2 bg-indigo-50/50 border border-indigo-200 text-indigo-800 px-6 py-3 rounded-full text-sm font-bold shadow-sm">
             <ShieldCheck className="w-5 h-5 text-indigo-600" /> E-E-A-T Verified · Authority Score Ranked
          </div>
        </div>
      </header>

      {/* Roster Grid */}
      <main className="max-w-6xl mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-12 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-serif font-bold text-slate-800">공인 전문가 · 활동가</h2>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            총 {EXPERTS.length}명 등록됨
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {EXPERTS
            .sort((a, b) => b.score - a.score)
            .map((expert) => {
              const tier = getAuthorityTier(expert.score);
              return (
                <Link key={expert.slug} href={`/${tenantId}/experts/${expert.slug}`} className="group block">
                  <div className="bg-white border border-slate-200 rounded-lg p-6 h-full shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 mx-auto mb-4 shadow-inner ring-4 ring-slate-50 group-hover:ring-indigo-50 transition-all flex items-center justify-center text-white text-2xl font-black">
                      {expert.name[0]}
                    </div>
                    
                    {/* Authority Badge */}
                    <div className="flex justify-center mb-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${tier.bgColor} ${tier.color} border ${tier.borderColor}`}>
                        {tier.emoji} Authority {expert.score}
                      </span>
                    </div>

                    <div className="text-center">
                      <div className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wider">{expert.category}</div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-1 mb-1 font-serif">
                        {expert.name} <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </h3>
                      <div className="text-sm text-slate-800 font-bold mb-1">{expert.title}</div>
                      <div className="text-xs text-slate-500 mb-6">{expert.institution}</div>
                      
                      <div className="w-8 h-px bg-slate-200 mx-auto mb-6 group-hover:bg-indigo-300 transition-colors"></div>
                      
                      <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                        발행된 SSoT: {expert.contributions}건 <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </main>
    </div>
  );
}
