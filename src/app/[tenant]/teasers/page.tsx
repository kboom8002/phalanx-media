import React from 'react';
import { Building, MapPin, TrendingUp, Info } from 'lucide-react';

export default function PublicTeaserGallery() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">JS-Oracle 프리미엄 티저 갤러리</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            엄격한 검증을 통과한 상위 1% 우량 매물만 선별하여 제공합니다.<br/>
            모든 매물의 상세 주소 및 등기 정보는 철저히 보호되며, 맞춤형 의뢰 시 VIP 전담 브로커가 안내해 드립니다.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { tag: "안정성", title: "강남대로 이면 꼬마빌딩", budget: "50억대", yield: "4.8%", desc: "명도 완료, 즉시 리모델링 가능. 대기업 프랜차이즈 임대 협의 중." },
            { tag: "수익형", title: "성수동 메인 상권 메디컬 빌딩", budget: "120억대", yield: "5.5%", desc: "전 층 메디컬 임대 완료. 5년 단위 장기 계약으로 안정적 현금흐름 창출." },
            { tag: "사옥용", title: "판교 테크노밸리 인근 신축", budget: "80억대", yield: "4.2%", desc: "IT 기업 사옥 추천. 자주식 주차 15대, 최상층 루프탑 가든 보유." }
          ].map((teaser, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col group">
              <div className="h-48 bg-slate-800 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-slate-900 transition-opacity group-hover:opacity-0"></div>
                <div className="text-center z-10">
                  <Building className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
                  <span className="bg-amber-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
                    보안 티저 (Vault Locked)
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">{teaser.tag}</span>
                  <div className="flex items-center text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    수익률 {teaser.yield}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{teaser.title}</h3>
                <div className="flex items-center text-slate-600 mb-4 font-medium bg-slate-50 px-3 py-2 rounded-lg">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                  예산 규모: {teaser.budget}
                </div>
                <p className="text-slate-600 text-sm flex-1 leading-relaxed">
                  {teaser.desc}
                </p>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <a href="../bespoke" className="block w-full py-3 text-center bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors">
                    상세 정보 및 매수 의뢰
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between border border-blue-100">
          <div className="flex items-start mb-6 md:mb-0">
            <Info className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">원하는 조건의 매물이 없으신가요?</h4>
              <p className="text-slate-600">JS-Oracle의 300인 파트너 네트워크에 등록된 <strong className="text-slate-900">비공개 매물(Pocket Listing)</strong>이 대기 중입니다.</p>
            </div>
          </div>
          <a href="../bespoke" className="whitespace-nowrap px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg">
            VIP 맞춤형 의뢰하기
          </a>
        </div>
      </div>
    </div>
  );
}
