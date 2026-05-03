"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Send } from "lucide-react";

export default function CMSEditPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = (params.tenant as string) || "phalanx";
  const contentId = params.contentId as string;

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push(`/${tenantId}/cms`)} className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900">콘텐츠 편집</h1>
            <p className="text-xs text-slate-500">ID: {contentId} · 포맷: 아티클</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50">
            <Save className="w-4 h-4" /> 저장
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-500 shadow-sm">
            <Send className="w-4 h-4" /> 검수 요청
          </button>
        </div>
      </div>

      {/* Editor Mock */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 shrink-0">
          <input 
            type="text" 
            defaultValue="2026 S/S 웨딩드레스 트렌드 리포트" 
            className="w-full text-3xl font-black text-slate-900 placeholder:text-slate-300 focus:outline-none"
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className="flex-1 p-6 bg-slate-50/50 relative">
          <div className="absolute inset-0 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto min-h-full bg-white border border-slate-100 rounded-xl shadow-sm p-8">
              <p className="text-slate-400 italic text-center py-20">
                [Tiptap 리치 에디터 또는 포맷별 폼이 마운트되는 영역입니다]<br/><br/>
                현재 Phase 1: 라우트 및 기초 레이아웃 구현 완료
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
