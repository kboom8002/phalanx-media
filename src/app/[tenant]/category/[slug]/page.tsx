import Link from "next/link";
import { Camera, Shirt, Sparkles, Film, MapPin, Star, ArrowRight, Filter } from "lucide-react";
import { getTenantConfig } from "@/lib/tenant-config";
import type { Metadata } from "next";

const CATEGORY_META: Record<string, { label: string; emoji: string; icon: any; description: string; filters: string[] }> = {
  studio: { label: '웨딩스튜디오', emoji: '📷', icon: Camera, description: '클래식, 자연광, 하이엔드 웨딩스튜디오를 만나보세요.', filters: ['청담', '강남', '홍대', '자연광', '클래식', '영화적'] },
  dress:  { label: '드레스샵',     emoji: '👗', icon: Shirt,    description: '실크, 레이스, 볼륨 드레스 전문 샵을 찾아보세요.', filters: ['청담', '강남', '실크', '레이스', '볼륨', '수입'] },
  makeup: { label: '메이크업',     emoji: '💄', icon: Sparkles, description: '본식 · 촬영 메이크업 전문가를 비교해 보세요.', filters: ['강남', '청담', '본식', '촬영', '내추럴', '글램'] },
  snap:   { label: '스냅 · 본식',  emoji: '🎞️', icon: Film,     description: '야외 · 실내 스냅, 본식스냅 전문팀입니다.', filters: ['야외', '실내', '필름', '디지털', '제주', '서울'] },
};

const DEMO_VENDORS: Record<string, Array<{ slug: string; name: string; location: string; style: string; score: number }>> = {
  studio: [
    { slug: 'lumiere', name: '루미에 스튜디오', location: '청담', style: '자연광 · 클래식', score: 92 },
    { slug: 'sai-studio', name: '사이 스튜디오', location: '강남', style: '하이엔드 · 영화적', score: 88 },
    { slug: 'theface', name: '더페이스 스튜디오', location: '강남', style: '인물 중심', score: 84 },
    { slug: 'guho', name: '구호 스튜디오', location: '홍대', style: '아트적', score: 80 },
    { slug: 'photo-essay', name: '이포토에세이', location: '강남', style: '스토리텔링', score: 78 },
    { slug: 'bong-studio', name: '봉스튜디오', location: '성수', style: '빈티지', score: 75 },
  ],
  dress: [
    { slug: 'bride-may', name: '브라이드메이', location: '청담', style: '수입 드레스 전문', score: 85 },
    { slug: 'ino-dress', name: '이노드레스', location: '강남', style: '실크 전문', score: 82 },
    { slug: 'monica-blanche', name: '모니카 블랑쉬', location: '청담', style: '하이엔드', score: 90 },
  ],
  makeup: [
    { slug: 'genius-makeup', name: '지니어스 뷰티', location: '강남', style: '원장 직접 · 글램', score: 82 },
  ],
  snap: [
    { slug: 'camille-snap', name: '까미유스냅', location: '서울/제주', style: '야외 전문', score: 80 },
    { slug: 'four-seasons-snap', name: '사계절스냅', location: '서울', style: '필름 감성', score: 77 },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_META[slug];
  if (!cat) return { title: 'K-Wedding Hub' };
  return {
    title: `${cat.label} | K-Wedding Hub`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tc = getTenantConfig();
  const cat = CATEGORY_META[slug];
  const vendors = DEMO_VENDORS[slug] || [];

  if (!cat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">카테고리를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const Icon = cat.icon;

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Header */}
      <header className="pt-28 pb-14 px-4 border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{cat.label}</h1>
              <p className="text-sm text-slate-500">{cat.description}</p>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="flex items-center gap-1 text-xs text-slate-400 mr-2"><Filter className="w-3 h-3" /> 필터:</span>
            {cat.filters.map(f => (
              <button key={f} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors border border-transparent hover:border-rose-200">
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Vendor Grid */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-sm text-slate-500 mb-6">
          <strong className="text-slate-800">{vendors.length}개</strong> 업체
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendors.sort((a, b) => b.score - a.score).map(v => (
            <Link key={v.slug} href={`/vendors/${v.slug}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Icon className="w-12 h-12 text-slate-300" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{cat.label}</span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500" /> {v.score}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-rose-700 transition-colors">{v.name}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3" /> {v.location}
                </p>
                <p className="text-xs text-slate-400">{v.style}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
