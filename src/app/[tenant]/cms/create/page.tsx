"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTenantConfig } from "@/lib/tenant-config";
import { getContentFormats } from "@/lib/content-formats";
import { ContentFormat } from "@/lib/content-types";
import { FileText, Image, BarChart3, TrendingUp, BookOpen, Newspaper, ArrowRight, ArrowLeft, Check } from "lucide-react";

export default function CMSCreatePage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = (params.tenant as string) || "phalanx";
  const tc = getTenantConfig(tenantId);
  const formats = getContentFormats(tc.vertical);

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat | null>(null);

  // Icons mapping for client component
  const formatIcons: Record<string, React.ElementType> = {
    Newspaper, BookOpen, BarChart3, Image, TrendingUp, 'Film': Image
  };

  const handleNext = () => {
    if (selectedFormat) setStep(2);
  };

  const handleCreate = () => {
    // Mock create and redirect
    router.push(`/${tenantId}/cms/ca-mock/edit`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button onClick={() => router.push(`/${tenantId}/cms`)} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-bold mb-4">
          <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
        </button>
        <h1 className="text-3xl font-black text-slate-900">새 콘텐츠 작성</h1>
        <p className="text-slate-500 mt-1">포맷을 선택하고 초기 메타데이터를 설정하세요.</p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-800">1. 콘텐츠 포맷 선택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(formats).map(f => {
              const Icon = formatIcons[f.icon] || FileText;
              const isSelected = selectedFormat === f.id;
              
              return (
                <button
                  key={f.id}
                  disabled={!f.enabled}
                  onClick={() => setSelectedFormat(f.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${
                    !f.enabled ? 'opacity-40 bg-slate-50 border-slate-100 cursor-not-allowed' :
                    isSelected ? 'border-indigo-600 bg-indigo-50 shadow-md' :
                    'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-indigo-600" />}
                  </div>
                  <h3 className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {f.label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{f.description}</p>
                </button>
              );
            })}
          </div>
          
          <div className="flex justify-end pt-6">
            <button
              onClick={handleNext}
              disabled={!selectedFormat}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors ${
                selectedFormat ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              다음 단계 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">2. 기본 정보 입력</h2>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg">
              선택된 포맷: {selectedFormat ? formats[selectedFormat].label : ''}
            </span>
            <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:underline">
              포맷 변경
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">제목</label>
              <input type="text" placeholder="콘텐츠 제목을 입력하세요" className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">카테고리</label>
              <select className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white">
                <option value="">카테고리 선택</option>
                <option value="스튜디오">스튜디오</option>
                <option value="드레스">드레스</option>
                <option value="일반">일반</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-slate-100 mt-8">
            <button
              onClick={() => setStep(1)}
              className="text-slate-500 hover:text-slate-900 font-bold px-4 py-2"
            >
              이전
            </button>
            <button
              onClick={handleCreate}
              className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold transition-colors"
            >
              에디터 열기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
