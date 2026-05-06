import Link from "next/link";
import { Trophy, Image, FileText, Lightbulb, MapPin, Users, Calendar, Clock, Brain, BookOpen, Layers, Zap } from "lucide-react";
import { getTenantConfig } from "@/lib/tenant-config";

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }) {
  const p = await params;
  const tenantId = p.tenant || "phalanx";
  const tc = getTenantConfig(tenantId);
  return {
    title: `참여 챌린지 | ${tc.displayName}`,
    description: tc.vertical === 'wedding' ? "웨딩 앰배서더 챌린지에 참여하고 포인트를 적립하세요." : "시민이 직접 참여하는 정책 포토, 기고, 아이디어 공모전.",
  };
}

const TYPE_META: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
  photo:       { icon: Image,     color: 'text-pink-600',   bgColor: 'bg-pink-50',   label: '포토 챌린지' },
  article:     { icon: FileText,  color: 'text-blue-600',   bgColor: 'bg-blue-50',   label: '인사이트 기고' },
  policy:      { icon: Lightbulb, color: 'text-amber-600',  bgColor: 'bg-amber-50',  label: '정책 기획 공모' },
  fieldwork:   { icon: MapPin,    color: 'text-emerald-600',bgColor: 'bg-emerald-50',label: '필드워크' },
  ugc:         { icon: Image,     color: 'text-violet-600', bgColor: 'bg-violet-50', label: 'UGC 챌린지' },
  testimonial: { icon: Users,     color: 'text-teal-600',   bgColor: 'bg-teal-50',   label: '솔직 후기' },
  idea:        { icon: Lightbulb, color: 'text-orange-600', bgColor: 'bg-orange-50', label: '아이디어 공모' },
  casepack:    { icon: Layers,    color: 'text-indigo-600', bgColor: 'bg-indigo-50', label: 'CasePack 스프린트' },
  book_agent:  { icon: BookOpen,  color: 'text-purple-600', bgColor: 'bg-purple-50', label: 'Book-to-Agent' },
  run_receipt: { icon: Zap,       color: 'text-cyan-600',   bgColor: 'bg-cyan-50',   label: 'Run-Receipt' },
};

const POLITICS_CHALLENGES = [
  { id: 'ch-1', slug: 'policy-photo-2026', title: '우리 동네 정책 현장 포토 공모전', type: 'photo', status: 'open', description: '지역 정책이 실행되는 현장을 카메라에 담아주세요.', deadline: '2026-05-31', submissions: 24, reward: 'Authority +15 · 메인 노출 · 정답카드 자동 등록' },
  { id: 'ch-2', slug: 'lowbirth-idea-2026', title: '시민 정책 아이디어 공모전 — 저출산 해법', type: 'policy', status: 'open', description: '저출산 위기 해결을 위한 시민 아이디어를 받습니다.', deadline: '2026-06-15', submissions: 8, reward: 'Authority +25 · SSoT 마켓 등록' },
  { id: 'ch-3', slug: 'dangjeong-article-2026', title: '당정분리 쟁점 기고 공모', type: 'article', status: 'judging', description: '당정분리의 헌법적 근거와 필요성에 대한 기고문을 모집합니다.', deadline: '2026-04-30', submissions: 15, reward: 'Authority +20 · 웹진 기사 게재' },
];

// ── LoopOS: TASKFLOW/CasePack 챌린지 ─────────────────────────
const LOOPOS_CHALLENGES = [
  {
    id: 'tf-ch-1', slug: 'casepack-sprint-2026',
    title: 'CasePack 스프린트 — 당신의 노하우를 실행 컨테이너로',
    type: 'casepack', status: 'open',
    description: '당신의 전문 경험을 TASKFLOW 8-Block(역할·상황·과업·입력지식·주의사항·흐름·톤·출력계약)으로 구조화하세요. SCL 검증을 통과한 팩은 커뮤니티 마켓에 등재되어 PoK 로열티를 받습니다.',
    deadline: '2026-06-30', submissions: 31,
    reward: 'PoK 로열티 40% · SCL_VERIFIED 배지 · Featured 피드 등재',
    badge: 'BUILDER',
    tier: 'P0',
  },
  {
    id: 'tf-ch-2', slug: 'book-to-agent-2026',
    title: 'Book-to-Agent 퀘스트 — 베스트셀러를 인지 자산으로',
    type: 'book_agent', status: 'open',
    description: '읽은 책의 핵심 프레임워크를 Auto-Miner로 역공학하여 실행 가능한 AgentPack으로 만드세요. 환각률 0%, Output Contract 99% 이상 통과 시 SCL Certified 등재.',
    deadline: '2026-06-15', submissions: 14,
    reward: 'PoK 로열티 40% · Author-Tenant 공동 저자 · BaaS 수익 배당',
    badge: 'BUILDER',
    tier: 'P0',
  },
  {
    id: 'tf-ch-3', slug: 'cross-insight-2026',
    title: 'Cross-Domain Insight 기고 — 교차점에서 발견한 지혜',
    type: 'article', status: 'open',
    description: '2개 이상의 도메인을 교차하여 발견한 비자명(non-obvious) 인사이트를 기고하세요. "CBT 인지왜곡 = 행동경제학 편향"처럼, 등가 발견이 핵심입니다. 채택 시 듀얼브레인 백서 Chapter로 승격됩니다.',
    deadline: '2026-07-01', submissions: 9,
    reward: 'Cross-Domain Architect 배지 · 백서 공동 저자 · Canon 등재',
    badge: 'ARCHITECT',
    tier: 'P1',
  },
  {
    id: 'tf-ch-4', slug: 'run-receipt-2026',
    title: 'Run-Receipt 챌린지 — 실행의 영수증을 남겨라',
    type: 'run_receipt', status: 'judging',
    description: 'PCE 핸드북의 Run-Receipt 원칙에 따라 실제 실행 기록(무엇을 결정했고, 왜 결정했으며, 결과는 무엇이었는가)을 공개 제출하세요. Δ1mm/day로 쌓인 증거가 가장 강력한 자기신뢰입니다.',
    deadline: '2026-05-20', submissions: 22,
    reward: 'Dual-Brain Learner → Architect 등급 상승 · PCE 마스터 인증',
    badge: 'PCE',
    tier: 'P1',
  },
];

const WEDDING_CHALLENGES = [
  {
    id: 'ch-w1', slug: 'wedding-photo-2026',
    title: '5월 웨딩 스냅 인생샷 챌린지',
    type: 'photo', status: 'open',
    description: '가장 아름다웠던 스튜디오/본식 스냅 사진을 자랑해주세요! 우수작은 공식 인스타그램에 소개됩니다.',
    deadline: '2026-05-31', submissions: 142,
    reward: '포인트 +500 · 앰배서더 추천 · 챕터 기여도 +1',
  },
  {
    id: 'ch-w2', slug: 'honest-review-2026',
    title: '스드메 찐 후기 공모전',
    type: 'testimonial', status: 'open',
    description: '결혼 준비하며 겪은 시행착오나 꿀팁, 그리고 추천하고 싶은 업체의 솔직한 후기를 남겨주세요.',
    deadline: '2026-06-15', submissions: 56,
    reward: '포인트 +1,000 · 메인 페이지 리뷰 등재',
  },
  {
    id: 'ch-w3', slug: 'wedding-idea-2026',
    title: '나만의 셀프 웨딩 기획안',
    type: 'idea', status: 'judging',
    description: '남들과 다른 특별한 웨딩을 기획하셨나요? 나만의 특별한 예식 식순과 아이디어를 공유해주세요.',
    deadline: '2026-04-30', submissions: 34,
    reward: '포인트 +2,000 · 매거진 에디터 초빙',
  },
];

export default async function ChallengesPublicPage({ params }: { params: Promise<{ tenant: string }> }) {
  const p = await params;
  const tenantId = p.tenant || "phalanx";
  const tc = getTenantConfig(tenantId);
  const isWedding = tc.vertical === 'wedding';
  const isLoopOS = (tc.vertical as string) === 'ai_productivity';

  const CHALLENGES = isLoopOS ? LOOPOS_CHALLENGES : isWedding ? WEDDING_CHALLENGES : POLITICS_CHALLENGES;
  const openChallenges = CHALLENGES.filter((c: any) => c.status === 'open');
  const pastChallenges = CHALLENGES.filter((c: any) => c.status !== 'open');

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Hero */}
      {isLoopOS ? (
        <header className="pt-28 pb-16 px-4 text-center border-b" style={{ background: 'linear-gradient(180deg,#0f0c29 0%,#1e1b4b 60%,#020617 100%)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 font-bold tracking-[0.15em] text-xs uppercase mb-6 px-4 py-2 rounded-full" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}>
              <Brain className="w-4 h-4" /> DUAL-BRAIN QUEST
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-5 text-white">
              경험을 <span style={{ background: 'linear-gradient(90deg,#818cf8,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CasePack</span>으로,<br />
              지식을 <span style={{ background: 'linear-gradient(90deg,#a78bfa,#f0abfc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Agent</span>으로.
            </h1>
            <p className="text-lg font-light leading-relaxed max-w-2xl mx-auto" style={{ color: '#94a3b8' }}>
              TASKFLOW 8-Block으로 구조화된 CasePack을 제출하세요.<br />
              SCL 검증을 통과하면 <strong style={{ color: '#a5b4fc' }}>SCL_VERIFIED 배지</strong>와 <strong style={{ color: '#22d3ee' }}>PoK 로열티</strong>가 자동 지급됩니다.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-bold">
              {['TASKFLOW 8-Block', 'SCL 검증', 'PoK 로열티', 'Cross-Domain Insight', 'Run-Receipt'].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>{tag}</span>
              ))}
            </div>
          </div>
        </header>
      ) : (
        <header className="pt-28 pb-16 px-4 text-center border-b border-slate-200 bg-gradient-to-b from-amber-50 to-white">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 text-amber-700 font-bold tracking-[0.15em] text-xs uppercase mb-6">
              <Trophy className="w-5 h-5" /> 시민 참여 챌린지
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
              당신의 참여가 변화를 만듭니다.
            </h1>
            <p className="text-lg text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
              {isWedding
                ? <>포토, 리뷰, 꿀팁 등 다양한 방식으로 참여하세요.<br />채택된 콘텐츠는 <strong>공식 추천 가이드</strong>로 승격됩니다.</>
                : <>포토, 기고, 정책 아이디어 등 다양한 방식으로 참여하세요.<br />채택된 콘텐츠는 <strong>정답카드(SSoT)</strong>로 승격됩니다.</> }
            </p>
          </div>
        </header>
      )}

      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Open Challenges */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 참여 모집 중
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openChallenges.map((ch: any) => {
              const meta = TYPE_META[ch.type] || TYPE_META.article;
              const TypeIcon = meta.icon;
              const isLoopCard = isLoopOS;
              return (
                <article key={ch.id}
                  className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                  style={isLoopCard ? { background: '#0f172a', border: '1px solid rgba(99,102,241,0.2)' } : { background: '#fff', border: '1px solid #e2e8f0' }}>
                  {/* Type Banner */}
                  <div className={`${isLoopCard ? '' : meta.bgColor} px-5 py-3 flex items-center justify-between`}
                    style={isLoopCard ? { background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.15)' } : { borderBottom: '1px solid #f1f5f9' }}>
                    <div className={`flex items-center gap-2 font-bold text-sm ${isLoopCard ? '' : meta.color}`}
                      style={isLoopCard ? { color: '#818cf8' } : {}}>
                      <TypeIcon className="w-4 h-4" />
                      {meta.label}
                    </div>
                    <div className="flex items-center gap-2">
                      {ch.badge && <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: ch.badge === 'BUILDER' ? 'rgba(168,85,247,0.15)' : ch.badge === 'ARCHITECT' ? 'rgba(34,211,238,0.15)' : 'rgba(16,185,129,0.15)', color: ch.badge === 'BUILDER' ? '#c084fc' : ch.badge === 'ARCHITECT' ? '#22d3ee' : '#34d399' }}>{ch.badge}</span>}
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={isLoopCard ? { background: 'rgba(34,197,94,0.12)', color: '#4ade80' } : { background: '#d1fae5', color: '#065f46' }}>모집 중</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className={`text-lg font-bold mb-2 leading-snug transition-colors ${isLoopCard ? 'text-white group-hover:text-indigo-300' : 'text-slate-900 group-hover:text-indigo-700'}`}>
                      {ch.title}
                    </h3>
                    <p className="text-sm mb-4 line-clamp-3" style={{ color: isLoopCard ? '#64748b' : '#64748b' }}>{ch.description}</p>

                    {/* Reward */}
                    <div className="rounded-xl px-4 py-2.5 mb-4" style={isLoopCard ? { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' } : { background: '#eef2ff', border: '1px solid #c7d2fe' }}>
                      <p className="text-xs font-bold" style={{ color: isLoopCard ? '#818cf8' : '#4338ca' }}>⚡ 참여 보상</p>
                      <p className="text-xs mt-0.5" style={{ color: isLoopCard ? '#6366f1' : '#4f46e5' }}>{ch.reward}</p>
                    </div>

                    <div className="flex items-center gap-3 text-xs" style={{ color: '#475569' }}>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> ~{ch.deadline}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {ch.submissions}명 참여</span>
                    </div>

                    <button className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-sm"
                      style={isLoopCard
                        ? { background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', color: '#fff' }
                        : { background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff' }}>
                      {isLoopCard ? <><Layers className="w-4 h-4" /> 퀘스트 참여하기</> : <><Trophy className="w-4 h-4" /> 참여하기</>}
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
