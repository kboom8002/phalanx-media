import Link from "next/link";
import { Search, Camera, Shirt, Sparkles, Film, Package, ArrowRight, Star, MapPin, Heart, Users } from "lucide-react";
import type { TenantConfig } from "@/lib/tenant-config";

const CATEGORIES = [
  { slug: 'studio', label: '웨딩스튜디오', emoji: '📷', icon: Camera, color: 'from-rose-500 to-pink-600', count: 6 },
  { slug: 'dress', label: '드레스샵', emoji: '👗', icon: Shirt, color: 'from-violet-500 to-purple-600', count: 3 },
  { slug: 'makeup', label: '메이크업', emoji: '💄', icon: Sparkles, color: 'from-amber-500 to-orange-600', count: 1 },
  { slug: 'snap', label: '스냅 · 본식', emoji: '🎞️', icon: Film, color: 'from-teal-500 to-emerald-600', count: 2 },
];

const FEATURED_VENDORS = [
  { slug: 'lumiere', name: '루미에 스튜디오', category: '스튜디오', location: '청담', style: '자연광 · 클래식', score: 92 },
  { slug: 'sai-studio', name: '사이 스튜디오', category: '스튜디오', location: '강남', style: '하이엔드 · 영화적', score: 88 },
  { slug: 'bride-may', name: '브라이드메이', category: '드레스', location: '청담', style: '수입 드레스 전문', score: 85 },
  { slug: 'genius-makeup', name: '지니어스 뷰티', category: '메이크업', location: '강남', style: '원장 직접 · 글램', score: 82 },
];

const POPULAR_QA = [
  { q: '한국 웨딩촬영 패키지에는 보통 무엇이 포함되나요?', slug: 'wedding-package-guide' },
  { q: '자연광 웨딩스튜디오는 어떤 커플에게 적합한가요?', slug: 'natural-light-studio' },
  { q: '본식스냅 계약 전 꼭 확인할 항목은?', slug: 'snap-contract-checklist' },
  { q: '외국인도 한국 웨딩촬영을 예약할 수 있나요?', slug: 'foreigner-booking-guide' },
];

export default function WeddingHome({ tc, osUrl }: { tc: TenantConfig, osUrl: string }) {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative pt-24 pb-28 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0a14 0%, #2d0a1e 40%, #1a0a2e 100%)' }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-600/15 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/2 pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-semibold text-sm">
            <Heart className="w-4 h-4" /> K-Wedding 공식 포털
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6 text-white">
            {tc.media.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl font-light">
            {tc.media.heroSubtitle}
          </p>

          <form action="/search" method="GET" className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <input type="text" name="q"
              className="w-full bg-white/10 border border-rose-900/40 text-white rounded-2xl py-5 pl-14 pr-32 text-lg placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white/15 transition-all shadow-2xl backdrop-blur-sm"
              placeholder={tc.media.searchPlaceholder} />
            <button type="submit" className="absolute inset-y-2 right-2 bg-rose-600 hover:bg-rose-500 text-white px-6 rounded-xl font-bold transition-colors">
              검색
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-slate-500 font-medium whitespace-nowrap">인기 검색:</span>
            {['청담 스튜디오', '자연광 촬영', '실크 드레스', '본식스냅'].map(k => (
              <Link key={k} href={`/search?q=${encodeURIComponent(k)}`}
                className="bg-white/5 text-slate-300 px-3 py-1 rounded-full border border-rose-900/30 hover:border-rose-500 hover:text-rose-300 cursor-pointer transition-colors">
                {k}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="container mx-auto px-4 max-w-6xl -mt-14 relative z-20 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Link key={cat.slug} href={`/category/${cat.slug}`}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group text-center">
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{cat.label}</h3>
                <p className="text-sm text-slate-500">{cat.count}개 업체</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="container mx-auto px-4 max-w-6xl mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">검증된 업체</h2>
            <p className="text-sm text-slate-500 mt-1">Trust Score로 검증된 K-Wedding 파트너</p>
          </div>
          <Link href="/experts" className="text-sm font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1">
            전체 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_VENDORS.map(v => (
            <Link key={v.slug} href={`/vendors/${v.slug}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Camera className="w-12 h-12 text-slate-300" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{v.category}</span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500" /> {v.score}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-rose-700 transition-colors">{v.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3" /> {v.location}
                </p>
                <p className="text-xs text-slate-400">{v.style}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Q&A (Answer Cards Preview) */}
      <section className="container mx-auto px-4 max-w-6xl mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{tc.media.canonTitle}</h2>
            <p className="text-sm text-slate-500 mt-1">{tc.media.canonSubtitle}</p>
          </div>
          <Link href="/canon" className="text-sm font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1">
            전체 가이드 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {POPULAR_QA.map((qa, i) => (
            <Link key={i} href={`/canon/${qa.slug}`}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-md hover:border-rose-200 transition-all group">
              <span className="text-rose-600 font-black text-sm">Q.</span>
              <h3 className="text-base font-bold text-slate-800 mt-1 group-hover:text-rose-700 transition-colors leading-snug">
                {qa.q}
              </h3>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                전문가 검증 답변 보기 <ArrowRight className="w-3 h-3" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Ambassador CTA */}
      <section className="container mx-auto px-4 max-w-4xl mb-20">
        <div className="bg-gradient-to-br from-rose-900 to-rose-800 rounded-3xl p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 blur-3xl rounded-full" />
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-rose-200 text-sm font-bold mb-6">
              <Users className="w-4 h-4" /> K-Wedding Ambassador
            </div>
            <h2 className="text-3xl font-black mb-3">웨딩 앰배서더로 활동하세요</h2>
            <p className="text-rose-200 max-w-lg mx-auto mb-8 leading-relaxed">
              좋은 업체를 추천하고 포인트를 적립하세요. SNS 공유 미션, 후기 작성, Q&A 답변으로 실질적인 혜택을 받을 수 있습니다.
            </p>
            <a href={`${osUrl}/${tc.id}/home`}
              className="inline-flex items-center gap-2 bg-white text-rose-900 font-black px-8 py-4 rounded-2xl hover:bg-rose-50 transition shadow-lg text-lg">
              앰배서더 시작하기 <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
