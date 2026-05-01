import Link from "next/link";
import { Trophy, Image, FileText, Lightbulb, MapPin, Users, Calendar, ArrowRight, Clock } from "lucide-react";

export const metadata = {
  title: "참여 챌린지 | Phalanx Media",
  description: "시민이 직접 참여하는 정책 포토, 기고, 아이디어 공모전. 여러분의 목소리로 변화를 만들어보세요.",
};

const TYPE_META: Record<string, { icon: any; color: string; bgColor: string }> = {
  photo: { icon: Image, color: 'text-pink-600', bgColor: 'bg-pink-50' },
  article: { icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  policy: { icon: Lightbulb, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  fieldwork: { icon: MapPin, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  ugc: { icon: Image, color: 'text-violet-600', bgColor: 'bg-violet-50' },
  factcheck: { icon: Lightbulb, color: 'text-rose-600', bgColor: 'bg-rose-50' },
  testimonial: { icon: Users, color: 'text-teal-600', bgColor: 'bg-teal-50' },
  project: { icon: FileText, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
  idea: { icon: Lightbulb, color: 'text-orange-600', bgColor: 'bg-orange-50' },
};

const CHALLENGES = [
  {
    id: 'ch-1', slug: 'policy-photo-2026',
    title: '우리 동네 정책 현장 포토 공모전',
    type: 'photo', status: 'open',
    description: '지역 정책이 실행되는 현장을 카메라에 담아주세요. 최우수 작품은 메인 페이지에 게재되며, 작성자의 Authority Score에 반영됩니다.',
    deadline: '2026-05-31', submissions: 24,
    reward: 'Authority +15 · 메인 노출 · 정답카드 자동 등록',
  },
  {
    id: 'ch-2', slug: 'lowbirth-idea-2026',
    title: '시민 정책 아이디어 공모전 — 저출산 해법',
    type: 'policy', status: 'open',
    description: '저출산 위기 해결을 위한 시민 아이디어를 받습니다. 채택된 아이디어는 전문가 검수를 거쳐 공식 정책 제안서에 반영됩니다.',
    deadline: '2026-06-15', submissions: 8,
    reward: 'Authority +25 · 정책 제안서 공동 저자 · SSoT 마켓 등록',
  },
  {
    id: 'ch-3', slug: 'dangjeong-article-2026',
    title: '당정분리 쟁점 기고 공모',
    type: 'article', status: 'judging',
    description: '당정분리의 헌법적 근거와 필요성에 대한 기고문을 모집합니다.',
    deadline: '2026-04-30', submissions: 15,
    reward: 'Authority +20 · 웹진 기사 게재',
  },
];

export default function ChallengesPublicPage() {
  const openChallenges = CHALLENGES.filter(c => c.status === 'open');
  const pastChallenges = CHALLENGES.filter(c => c.status !== 'open');

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Hero */}
      <header className="pt-28 pb-16 px-4 text-center border-b border-slate-200 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-amber-700 font-bold tracking-[0.15em] text-xs uppercase mb-6">
            <Trophy className="w-5 h-5" /> 시민 참여 챌린지
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            당신의 참여가 변화를 만듭니다.
          </h1>
          <p className="text-lg text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
            포토, 기고, 정책 아이디어 등 다양한 방식으로 참여하세요.<br />
            채택된 콘텐츠는 <strong>정답카드(SSoT)</strong>로 승격되어 여러분의 <strong>Authority Score</strong>에 반영됩니다.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Open Challenges */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 참여 모집 중
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openChallenges.map(ch => {
              const meta = TYPE_META[ch.type] || TYPE_META.photo;
              const TypeIcon = meta.icon;
              return (
                <article key={ch.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
                  {/* Type Banner */}
                  <div className={`${meta.bgColor} px-5 py-3 flex items-center justify-between border-b border-slate-100`}>
                    <div className={`flex items-center gap-2 ${meta.color} font-bold text-sm`}>
                      <TypeIcon className="w-4 h-4" />
                      {ch.type === 'photo' ? '포토 챌린지' : ch.type === 'article' ? '기고 공모' : ch.type === 'policy' ? '정책 기획 공모' : '참여 챌린지'}
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">모집 중</span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors leading-snug">
                      {ch.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{ch.description}</p>

                    {/* Reward */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 mb-4">
                      <p className="text-xs font-bold text-indigo-700">🏆 참여 보상</p>
                      <p className="text-xs text-indigo-600 mt-0.5">{ch.reward}</p>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> ~{ch.deadline}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {ch.submissions}명 참여</span>
                      </div>
                    </div>

                    <button className="w-full mt-5 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-sm font-bold transition-all shadow-sm">
                      <Trophy className="w-4 h-4" /> 참여하기
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Past Challenges */}
        {pastChallenges.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-slate-400" /> 지난 챌린지
            </h2>
            <div className="space-y-3">
              {pastChallenges.map(ch => {
                const meta = TYPE_META[ch.type] || TYPE_META.photo;
                const TypeIcon = meta.icon;
                return (
                  <div key={ch.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${meta.bgColor}`}>
                        <TypeIcon className={`w-4 h-4 ${meta.color}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{ch.title}</h3>
                        <p className="text-xs text-slate-400">{ch.submissions}명 참여 · 심사 중</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                      심사 중
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
