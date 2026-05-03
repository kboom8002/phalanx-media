import Link from "next/link";
import { MapPin, Star, Globe, Phone, MessageCircle, ArrowRight, Camera, CheckCircle2, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

const VENDORS: Record<string, {
  name: string; nameEn?: string; category: string; location: string; address: string;
  summary: string; truth: string; bestFor: string[]; styleTags: string[];
  priceRange: string; languages: string[]; phone?: string; kakaoUrl?: string; whatsappUrl?: string; instagramUrl?: string;
  score: number; globalReady: boolean;
  faq: Array<{ q: string; a: string }>;
}> = {
  'lumiere': {
    name: '루미에 스튜디오', nameEn: 'Lumiere Studio', category: '스튜디오', location: '청담', address: '서울시 강남구 청담동 123-45',
    summary: '자연광을 활용한 클래식 웨딩 포토그래피 전문 스튜디오. 15년 경력의 원장이 직접 촬영하며, 따뜻하고 자연스러운 톤을 추구합니다.',
    truth: '루미에는 "꾸밈없는 아름다움"을 철학으로 합니다. 인위적인 보정보다 자연광이 만드는 그림자와 빛의 조화를 중시하며, 모든 촬영은 원장이 직접 진행합니다.',
    bestFor: ['자연광 선호 커플', '차분한 톤 선호', '원장 직접 촬영'],
    styleTags: ['자연광', '클래식', '따뜻한톤', '미니멀'],
    priceRange: '200~400만원', languages: ['한국어', 'English'],
    phone: '02-1234-5678', kakaoUrl: 'https://pf.kakao.com/lumiere', instagramUrl: 'https://instagram.com/lumiere_studio',
    score: 92, globalReady: true,
    faq: [
      { q: '촬영 소요 시간은 얼마인가요?', a: '기본 패키지 기준 약 3~4시간입니다. 의상 2벌 기준이며, 추가 의상은 벌당 30분이 추가됩니다.' },
      { q: '원본은 전부 받을 수 있나요?', a: '네, 모든 원본(RAW 파일 제외)을 USB로 전달해 드립니다. 보정본은 80장 기준이며 추가 보정도 가능합니다.' },
      { q: '외국인도 촬영 가능한가요?', a: 'Yes! We have an English-speaking coordinator. International couples are always welcome.' },
    ],
  },
  'sai-studio': {
    name: '사이 스튜디오', nameEn: 'SAI Studio', category: '스튜디오', location: '강남', address: '서울시 강남구 논현동 67-89',
    summary: '영화적 연출과 하이엔드 퀄리티로 유명한 웨딩 스튜디오. 시네마틱 색감과 드라마틱한 구도가 특징입니다.',
    truth: '사이 스튜디오는 "한 편의 영화"를 모토로 합니다. 모든 촬영에 영상 감독 출신의 디렉터가 참여하며, 조명과 구도에 영화적 문법을 적용합니다.',
    bestFor: ['영화적 분위기 선호', '드라마틱 연출', '시네마틱 색감'],
    styleTags: ['시네마틱', '하이엔드', '드라마틱', '무드'],
    priceRange: '350~600만원', languages: ['한국어', 'English', '中文'],
    score: 88, globalReady: true,
    faq: [
      { q: '다른 스튜디오와의 차별점은?', a: '영상 감독 출신 디렉터가 조명·구도를 직접 설계합니다. 영화적 색감의 보정이 사이만의 시그니처입니다.' },
    ],
  },
};

// Fallback for unknown slugs
const FALLBACK_VENDOR = {
  name: '업체 정보 준비 중', category: '준비 중', location: '-', address: '-',
  summary: '이 업체의 공식 프로필이 곧 등록될 예정입니다.', truth: '', bestFor: [], styleTags: [],
  priceRange: '-', languages: ['한국어'], score: 0, globalReady: false, faq: [],
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const v = VENDORS[slug] || FALLBACK_VENDOR;
  return {
    title: `${v.name} | K-Wedding Hub`,
    description: v.summary,
  };
}

export default async function VendorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = VENDORS[slug] || FALLBACK_VENDOR;

  const vendorSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": v.name,
    ...(v.nameEn ? { "alternateName": v.nameEn } : {}),
    "description": v.summary,
    "address": { "@type": "PostalAddress", "addressLocality": v.location, "addressCountry": "KR" },
    "url": `https://kweddinghub.com/vendors/${slug}`,
    "priceRange": v.priceRange,
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vendorSchema) }} />

      {/* Hero */}
      <header className="pt-28 pb-16 px-4 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">{v.category}</span>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-3">{v.name}</h1>
              {v.nameEn && <p className="text-sm text-slate-400 mt-1">{v.nameEn}</p>}
            </div>
            {v.score > 0 && (
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-xl font-black text-amber-700">{v.score}</span>
                <span className="text-xs text-amber-600 ml-1">Trust Score</span>
              </div>
            )}
          </div>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">{v.summary}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="flex items-center gap-1 text-sm text-slate-500"><MapPin className="w-4 h-4" /> {v.location} · {v.address}</span>
            {v.globalReady && <span className="flex items-center gap-1 text-sm text-emerald-600 font-bold"><Globe className="w-4 h-4" /> 외국인 촬영 가능</span>}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Brand Truth */}
        {v.truth && (
          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-rose-600" /> 브랜드 철학
            </h2>
            <p className="text-slate-700 leading-relaxed">{v.truth}</p>
          </section>
        )}

        {/* Best For */}
        {v.bestFor.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4">이런 커플에게 추천합니다</h2>
            <div className="flex flex-wrap gap-2">
              {v.bestFor.map(tag => (
                <span key={tag} className="px-4 py-2 rounded-full bg-rose-50 text-rose-700 font-semibold text-sm border border-rose-100">{tag}</span>
              ))}
            </div>
          </section>
        )}

        {/* Portfolio Placeholder */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4">포트폴리오</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-[4/5] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <Camera className="w-8 h-8 text-slate-300" />
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-2">가격 안내</h2>
          <p className="text-2xl font-black text-rose-700">{v.priceRange}</p>
          <p className="text-sm text-slate-500 mt-2">정확한 견적은 문의를 통해 안내받으세요.</p>
        </section>

        {/* FAQ */}
        {v.faq.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-slate-400" /> 자주 묻는 질문
            </h2>
            <div className="space-y-3">
              {v.faq.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-bold text-slate-800 mb-2"><span className="text-rose-600">Q.</span> {item.q}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact CTA */}
        <section className="bg-gradient-to-br from-rose-900 to-rose-800 rounded-3xl p-8 text-white">
          <h2 className="text-2xl font-black mb-2">상담 문의하기</h2>
          <p className="text-rose-200 mb-6">편하신 방법으로 상담을 시작하세요.</p>
          <div className="flex flex-wrap gap-3">
            {v.kakaoUrl && (
              <a href={v.kakaoUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#FEE500] text-[#191919] font-bold px-6 py-3 rounded-xl hover:brightness-95 transition">
                💬 카카오로 상담하기
              </a>
            )}
            {v.phone && (
              <a href={`tel:${v.phone}`}
                className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition">
                <Phone className="w-4 h-4" /> 전화 문의
              </a>
            )}
            {v.instagramUrl && (
              <a href={v.instagramUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition">
                📸 인스타그램
              </a>
            )}
          </div>
          <p className="text-xs text-rose-300 mt-4">지원 언어: {v.languages.join(' · ')}</p>
        </section>
      </main>
    </div>
  );
}
