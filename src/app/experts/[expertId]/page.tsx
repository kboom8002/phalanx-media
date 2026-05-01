import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, Award, BookOpen, MessageSquare, TrendingUp,
  Calendar, ExternalLink, Heart, Globe, Send, Pin
} from "lucide-react";

// Types (shared concept from phalanx-os/src/lib/expert-types.ts)
function getAuthorityTier(score: number) {
  if (score >= 90) return { label: 'Platinum', color: 'text-violet-600', bgColor: 'bg-violet-100', borderColor: 'border-violet-200', emoji: '💎' };
  if (score >= 75) return { label: 'Gold', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', emoji: '🥇' };
  if (score >= 55) return { label: 'Silver', color: 'text-slate-600', bgColor: 'bg-slate-100', borderColor: 'border-slate-200', emoji: '🥈' };
  return { label: 'Bronze', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', emoji: '🥉' };
}

// Mock data for SSR (will be replaced by Supabase fetch)
const EXPERT_DATA: Record<string, any> = {
  'hyungjun-park': {
    slug: 'hyungjun-park', display_name: '박형준', bio: '석좌교수, 전 국무조정실장',
    full_bio: '대한민국의 대표적인 행정학자이자 국가 전략가. 과거 국무조정실장을 역임하며 수많은 국가적 난제를 해결한 실무형 지식인입니다. 현재는 각종 국책 연구 기관에서 미래 행정 개혁을 주도하고 있으며, 당정 구조의 문제점에 대해 가장 날카로운 통찰을 제시하는 권위자입니다.',
    institution: '국가행정전략연구소',
    specialty_tags: ['국정 운영', '행정 개혁', '당정분리'],
    consulting_enabled: true, consulting_url: 'https://calendly.com/demo',
    external_links: { linkedin: '#', website: '#' },
    score: { total: 87, content_quality: 92, citation_count: 45, community_trust: 88, consistency: 75, cross_tenant_reach: 30 },
    canons: [
      { id: 'c-1', title: '당정분리 원칙의 헌법적 근거는?', excerpt: '헌법 제7조 및 정당법에 근거하여 공무원의 정치적 중립성이 보장되며...', date: '2026-04-28', pinned: true, category: '정치 구조' },
      { id: 'c-2', title: '저출산 대응, 현금 vs 인프라 효과 비교', excerpt: 'OECD 비교 연구에 따르면 현금 지급보다 인프라 투자가 장기적으로...', date: '2026-04-27', pinned: false, category: '복지·경제' },
    ],
    agora_activity: [
      { id: 'a1', question: '국무조정실이 실질적으로 할 수 있는 일은?', upvotes: 42, date: '2026-04-25' },
      { id: 'a2', question: '대통령제에서 총리의 역할은 왜 모호한가?', upvotes: 38, date: '2026-04-20' },
    ],
    topic_distribution: [
      { topic: '국정 운영', pct: 42 },
      { topic: '외교·안보', pct: 28 },
      { topic: '복지·경제', pct: 18 },
      { topic: '기술·산업', pct: 12 },
    ],
  },
  'sujin-lee': {
    slug: 'sujin-lee', display_name: '이수진', bio: '보건경제학 박사',
    full_bio: '복지 및 예산 효율화에 대한 국내 최고의 전문가로, OECD 비교 연구를 통해 저출산 대응 전략을 제시합니다.',
    institution: '대한보건미래포럼',
    specialty_tags: ['복지', '보건경제', '저출산'],
    consulting_enabled: false, consulting_url: null,
    external_links: {},
    score: { total: 72, content_quality: 85, citation_count: 22, community_trust: 70, consistency: 90, cross_tenant_reach: 10 },
    canons: [
      { id: 'c-4', title: '저출산 해결, 현금 지급의 한계와 대안', excerpt: '출산율 회복을 위해서는 단기적 현금 지원을 넘어서는 구조적 접근이 필요합니다...', date: '2026-04-22', pinned: true, category: '복지' },
    ],
    agora_activity: [],
    topic_distribution: [
      { topic: '복지', pct: 55 },
      { topic: '보건경제', pct: 30 },
      { topic: '저출산', pct: 15 },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ expertId: string }> }) {
  const { expertId } = await params;
  const expert = EXPERT_DATA[expertId];
  if (!expert) return { title: '전문가를 찾을 수 없습니다' };
  return {
    title: `${expert.display_name} — ${expert.bio} | Authority Engine`,
    description: expert.full_bio.substring(0, 160),
    openGraph: { title: `${expert.display_name} · Authority ${expert.score.total}`, type: 'profile' },
  };
}

export default async function ExpertAuthorityPage({ params }: { params: Promise<{ expertId: string }> }) {
  const { expertId } = await params;
  const expert = EXPERT_DATA[expertId];

  if (!expert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">전문가를 찾을 수 없습니다</h1>
          <Link href="/experts" className="text-blue-600 text-sm font-bold">← 전문가 목록으로</Link>
        </div>
      </div>
    );
  }

  const tier = getAuthorityTier(expert.score.total);
  const pinnedCanons = expert.canons.filter((c: any) => c.pinned);
  const otherCanons = expert.canons.filter((c: any) => !c.pinned);

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/experts" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition">
            <ArrowLeft className="w-4 h-4" /> 전문가 네트워크
          </Link>
          <div className={`px-3 py-1 ${tier.bgColor} ${tier.color} font-mono text-xs rounded-full font-bold border ${tier.borderColor}`}>
            {tier.emoji} Authority {expert.score.total} · {tier.label}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Profile */}
        <section className="flex flex-col md:flex-row gap-8 items-start mb-16">
          <div className="w-32 h-32 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl flex items-center justify-center text-white text-5xl font-black">
            {expert.display_name[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{expert.display_name}</h1>
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-lg font-bold text-slate-700 mb-1">{expert.bio}</p>
            <p className="text-sm text-indigo-600 font-bold uppercase tracking-widest mb-4">{expert.institution}</p>
            
            {/* Specialty Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {expert.specialty_tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-600">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-slate-600 leading-relaxed">{expert.full_bio}</p>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              {expert.consulting_enabled && (
                <a href={expert.consulting_url || '#'} target="_blank" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
                  <Calendar className="w-4 h-4" /> 전문 상담 예약
                </a>
              )}
              {expert.external_links.linkedin && (
                <a href={expert.external_links.linkedin} target="_blank" className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors border border-slate-200">
                  <ExternalLink className="w-4 h-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Authority Score Visual */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 mb-12 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-violet-500" /> Authority Score
          </h2>
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-full border-4 border-indigo-500 flex items-center justify-center bg-indigo-50">
              <span className="text-3xl font-black text-indigo-700">{expert.score.total}</span>
            </div>
            <div className="flex-1 grid grid-cols-5 gap-4">
              {[
                { label: '콘텐츠 품질', value: expert.score.content_quality, color: 'bg-blue-500' },
                { label: '인용 횟수', value: expert.score.citation_count, color: 'bg-indigo-500' },
                { label: '커뮤니티 신뢰', value: expert.score.community_trust, color: 'bg-rose-500' },
                { label: '활동 꾸준함', value: expert.score.consistency, color: 'bg-emerald-500' },
                { label: '크로스 테넌트', value: expert.score.cross_tenant_reach, color: 'bg-violet-500' },
              ].map(m => (
                <div key={m.label} className="text-center">
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                    <div className={`${m.color} h-2 rounded-full transition-all`} style={{ width: `${Math.min(m.value, 100)}%` }} />
                  </div>
                  <p className="text-xs font-bold text-slate-500">{m.label}</p>
                  <p className="text-lg font-black text-slate-900">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Topic Distribution (Topic Map View) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 mb-12 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-indigo-500" /> 전문 영역 분포
          </h2>
          <div className="flex gap-3 flex-wrap">
            {expert.topic_distribution.map((td: any) => (
              <div
                key={td.topic}
                className="flex items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100 transition-colors px-5 py-3"
                style={{ fontSize: `${Math.max(12, td.pct * 0.4)}px` }}
              >
                <span className="font-bold text-indigo-800">{td.topic}</span>
                <span className="ml-2 text-xs text-indigo-500 font-mono">{td.pct}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pinned Canon Cards */}
        {pinnedCanons.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Pin className="w-5 h-5 text-amber-500" /> 대표 정답카드
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pinnedCanons.map((canon: any) => (
                <article key={canon.id} className="bg-white border-2 border-amber-200 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">📌 대표작</span>
                    <span className="text-xs font-mono text-slate-400">{canon.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{canon.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{canon.excerpt}</p>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors">
                      <BookOpen className="w-3.5 h-3.5" /> 전문 읽기
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Canon Cards (Timeline View) */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-sky-500" /> 지식 서재 (타임라인)
          </h2>
          <div className="space-y-4 border-l-2 border-slate-200 pl-6">
            {[...pinnedCanons, ...otherCanons].map((canon: any) => (
              <div key={canon.id} className="relative">
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white" />
                <div className="bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600">{canon.category}</span>
                    <span className="text-xs text-slate-400 font-mono">{canon.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{canon.title}</h3>
                  <p className="text-sm text-slate-500">{canon.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Agora Activity (Community Footprint) */}
        {expert.agora_activity.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-emerald-500" /> 공론장 활동 기록
            </h2>
            <div className="space-y-3">
              {expert.agora_activity.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Q. {a.question}</p>
                    <p className="text-xs text-slate-400 mt-1">{a.date}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-500">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-bold">{a.upvotes}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Personal Q&A Form */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Send className="w-5 h-5 text-blue-500" /> 이 전문가에게 질문하기
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {expert.display_name} 전문가에게 직접 질문을 남기세요. 답변은 정답카드(SSoT)로 공개됩니다.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="이름" className="px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400" />
              <input placeholder="이메일 (선택)" type="email" className="px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400" />
            </div>
            <textarea placeholder="질문 내용을 입력하세요..." rows={4} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 resize-none" />
            <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-bold transition-all shadow-md">
              <Send className="w-4 h-4" /> 질문 보내기
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
