"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Image, FileText, Lightbulb, MapPin, Upload, Send, CheckCircle2, Loader2, Calendar, Users, Star } from "lucide-react";

// Mock challenge data — in production fetch by slug from DB
const MOCK_CHALLENGES: Record<string, any> = {
  "policy-photo-2026": {
    id: "ch-1", slug: "policy-photo-2026",
    title: "우리 동네 정책 현장 포토 공모전",
    type: "photo",
    status: "open",
    description: "지역 정책이 실행되는 현장을 카메라에 담아주세요. 도로 보수 공사, 노인 복지관 운영, 어린이 공원 조성 등 공공 행정이 시민 삶과 만나는 순간을 기록합니다.",
    guidelines: ["실제 정책 현장을 촬영한 사진이어야 합니다", "최소 1MB 이상의 고화질 이미지", "사진 1~3장 첨부 가능", "캡션(설명)을 반드시 포함하세요"],
    deadline: "2026-05-31",
    submissions: 24,
    reward: "Authority +15 · 메인 페이지 노출 · 정답카드 자동 등록",
    authorityPoints: 15,
  },
  "lowbirth-idea-2026": {
    id: "ch-2", slug: "lowbirth-idea-2026",
    title: "시민 정책 아이디어 공모전 — 저출산 해법",
    type: "policy",
    status: "open",
    description: "저출산 위기 해결을 위한 시민 아이디어를 받습니다. 채택된 아이디어는 전문가 검수를 거쳐 공식 정책 제안서에 반영됩니다.",
    guidelines: ["500자 이상 구체적인 제안 내용", "현행 정책의 문제점 분석 포함", "실현 가능한 대안 제시", "참고 자료(선택)"],
    deadline: "2026-06-15",
    submissions: 8,
    reward: "Authority +25 · 정책 제안서 공동 저자 · SSoT 마켓 등록",
    authorityPoints: 25,
  },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  photo: Image,
  article: FileText,
  policy: Lightbulb,
  fieldwork: MapPin,
};

export default function ChallengeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const challenge = MOCK_CHALLENGES[params.slug] || MOCK_CHALLENGES["policy-photo-2026"];
  const TypeIcon = TYPE_ICONS[challenge.type] || Trophy;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isReady = name.trim() && email.trim() && title.trim() && body.trim().length >= 50;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReady) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API call
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">참여 완료!</h2>
          <p className="text-slate-500 leading-relaxed mb-2">
            제출해주셔서 감사합니다.<br />
            검토 후 <strong className="text-amber-600">Authority +{challenge.authorityPoints}점</strong>이 반영됩니다.
          </p>
          <p className="text-sm text-slate-400 mb-8">
            채택된 콘텐츠는 정답카드(SSoT)로 승격되어 공개됩니다.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/challenges" className="flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold transition-all">
              <Trophy className="w-4 h-4" /> 다른 챌린지 참여하기
            </Link>
            <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">홈으로 돌아가기</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Breadcrumb */}
      <div className="pt-24 pb-4 px-4 max-w-4xl mx-auto">
        <Link href="/challenges" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          챌린지 목록
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Challenge Info */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-amber-100 rounded-xl">
                  <TypeIcon className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">모집 중</span>
              </div>
              <h1 className="text-lg font-black text-slate-900 leading-snug mb-3">{challenge.title}</h1>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">{challenge.description}</p>

              <div className="space-y-2 text-sm text-slate-500 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>마감: <strong className="text-slate-700">{challenge.deadline}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>현재 {challenge.submissions}명 참여</span>
                </div>
              </div>
            </div>

            {/* Reward */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">참여 보상</span>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">{challenge.reward}</p>
            </div>

            {/* Guidelines */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-3">참여 안내</h3>
              <ul className="space-y-2">
                {challenge.guidelines.map((g: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right: Submission Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                챌린지 참여 제출
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">이름 *</label>
                    <input value={name} onChange={e => setName(e.target.value)} required type="text" placeholder="홍길동" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">이메일 *</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="email@example.com" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">제목 *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} required type="text" placeholder="제출 작품/글의 제목을 입력하세요" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    내용 * <span className="text-slate-400 font-normal">(최소 50자)</span>
                  </label>
                  <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    required
                    rows={8}
                    placeholder={challenge.type === "photo"
                      ? "사진에 대한 설명을 작성하세요. 어디서 찍은 사진인지, 어떤 정책 현장인지 설명해 주세요..."
                      : "아이디어나 의견을 구체적으로 작성해 주세요..."
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                  />
                  <p className={`text-xs mt-1 text-right ${body.length < 50 ? "text-rose-400" : "text-emerald-500"}`}>
                    {body.length < 50 ? `${50 - body.length}자 더 필요` : `${body.length}자 ✓`}
                  </p>
                </div>

                {challenge.type === "photo" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">사진 첨부 (선택)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-amber-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">클릭하거나 파일을 드래그하세요</p>
                      <p className="text-xs text-slate-300 mt-1">JPG, PNG, WEBP · 최대 10MB</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isReady || submitting}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all ${
                    isReady
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> 제출 중...</>
                  ) : (
                    <><Send className="w-5 h-5" /> 챌린지 제출하기</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
