import React from 'react';
import { Search, MapPin, DollarSign, Building, ArrowRight, ShieldCheck, Compass, Home, Coffee, Waves } from 'lucide-react';
import { getTenantConfig } from "@/lib/tenant-config";

export default async function BespokeLeadWizard({ params }: { params: Promise<{ tenant: string }> }) {
  const p = await params;
  const tenantId = p.tenant || "phalanx";
  const tc = getTenantConfig(tenantId);

  // JS-Oracle (Sales Vertical) UI
  if (tc.vertical === "sales") {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">VIP 맞춤형 매물 의뢰 (Bespoke)</h1>
            <p className="text-lg text-slate-600">
              고객님의 투자 요건을 남겨주시면, JS-Oracle의 Master 브로커가<br/>
              300명 파트너망을 스캔하여 최적의 비공개 매물을 제안해 드립니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-100 flex-col md:flex-row">
              <div className="flex-1 py-4 text-center font-bold text-amber-700 border-b-2 border-amber-600 bg-amber-50/50">
                Step 1. 기본 요건
              </div>
              <div className="flex-1 py-4 text-center font-medium text-slate-400 bg-slate-50 border-b border-slate-100 md:border-b-0">
                Step 2. 세부 조건
              </div>
              <div className="flex-1 py-4 text-center font-medium text-slate-400 bg-slate-50">
                Step 3. 정보 접수
              </div>
            </div>

            <div className="p-6 md:p-12">
              <div className="space-y-10">
                {/* 예산 */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    총 투자 예산 (대출 포함)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-11">
                    {['30억 미만', '30억 - 50억', '50억 - 100억', '100억 이상'].map(budget => (
                      <button key={budget} className="py-3 border border-slate-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700 text-slate-600 font-medium transition-all">
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 지역 */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      <MapPin className="w-4 h-4" />
                    </div>
                    선호 지역 (다중 선택 가능)
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 pl-11">
                    {['강남구', '서초구', '송파구', '마포구', '용산구', '성동구'].map(region => (
                      <button key={region} className="py-2.5 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-medium text-sm transition-all">
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 용도 */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3">
                      <Building className="w-4 h-4" />
                    </div>
                    매입 목적
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-11">
                    <div className="border border-slate-200 rounded-xl p-5 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                      <div className="font-bold text-slate-900 mb-2">수익형 (임대 수익)</div>
                      <div className="text-sm text-slate-500 leading-relaxed">안정적인 월세 수익 창출 목적 (수익률 중시)</div>
                    </div>
                    <div className="border-2 border-amber-500 rounded-xl p-5 cursor-pointer bg-amber-50/50 transition-all shadow-sm relative">
                      <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                        선택됨
                      </div>
                      <div className="font-bold text-slate-900 mb-2">사옥용 (실사용)</div>
                      <div className="text-sm text-slate-600 leading-relaxed">기업 사옥 및 병원 등 직접 운영 목적 (입지 중시)</div>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-5 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                      <div className="font-bold text-slate-900 mb-2">투자형 (가치 상승)</div>
                      <div className="text-sm text-slate-500 leading-relaxed">리모델링/신축을 통한 밸류애드 (미래 가치 중시)</div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center text-sm text-slate-500 font-medium bg-slate-50 px-4 py-2 rounded-lg w-full md:w-auto">
                    <ShieldCheck className="w-5 h-5 mr-2 text-emerald-600" />
                    접수된 정보는 Master 브로커에게만 암호화되어 전달됩니다.
                  </div>
                  <button className="w-full md:w-auto flex items-center justify-center px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg">
                    다음 단계로 <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // travel_global (Jejuto) UI
  if (tc.vertical === "travel_global") {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Plan Your Island Stay</h1>
            <p className="text-lg text-slate-600">
              Tell us your perfect Jeju experience. Our local concierge will<br/>
              curate a personalized itinerary and stay options just for you.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-100 flex-col md:flex-row">
              <div className="flex-1 py-4 text-center font-bold text-orange-600 border-b-2 border-orange-500 bg-orange-50/50 text-sm">
                Step 1. Purpose
              </div>
              <div className="flex-1 py-4 text-center font-medium text-slate-400 bg-slate-50 border-b border-slate-100 md:border-b-0 text-sm">
                Step 2. Vibe
              </div>
              <div className="flex-1 py-4 text-center font-medium text-slate-400 bg-slate-50 border-b border-slate-100 md:border-b-0 text-sm">
                Step 3. Budget
              </div>
              <div className="flex-1 py-4 text-center font-medium text-slate-400 bg-slate-50 text-sm">
                Step 4. Details
              </div>
            </div>

            <div className="p-6 md:p-12">
              <div className="space-y-10">
                {/* Purpose */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                      <Compass className="w-4 h-4" />
                    </div>
                    What brings you to Jeju?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-11">
                    {['Tourism', 'Workation', 'Long-stay (1mo+)', 'Business'].map(purpose => (
                      <button key={purpose} className="py-3 border border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 hover:text-orange-700 text-slate-600 font-medium transition-all shadow-sm">
                        {purpose}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vibe */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      <Waves className="w-4 h-4" />
                    </div>
                    Your ideal setting?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-11">
                    {['Ocean-view', 'Forest & Mountain', 'City-center', 'Rural Village'].map(vibe => (
                      <button key={vibe} className="py-3 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-medium transition-all shadow-sm">
                        {vibe}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3">
                      <Coffee className="w-4 h-4" />
                    </div>
                    Must-have amenities? (Select all)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pl-11">
                    {['Co-working Space', 'Surf School Nearby', 'Vegan/Halal Dining', 'Pet-friendly', 'Car rental included', 'Fast Wi-Fi (>100Mbps)'].map(amenity => (
                      <button key={amenity} className="py-3 px-4 text-left border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-medium transition-all shadow-sm flex items-center justify-between">
                        {amenity}
                        <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center text-sm text-slate-500 font-medium bg-slate-50 px-4 py-3 rounded-xl w-full md:w-auto">
                    <ShieldCheck className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />
                    Your data is encrypted and shared only with verified local hosts.
                  </div>
                  <button className="w-full md:w-auto flex items-center justify-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/20 text-lg">
                    Next Step <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-slate-50 py-12 text-center">
      <h1 className="text-2xl font-bold">Bespoke Lead Wizard</h1>
      <p>This vertical does not support the Bespoke feature.</p>
    </div>
  );
}
