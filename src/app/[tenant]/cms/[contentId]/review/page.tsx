"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, MessageSquare } from "lucide-react";

export default function CMSReviewPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = (params.tenant as string) || "phalanx";
  const contentId = params.contentId as string;

  return (
    <div className="max-w-6xl mx-auto h-full flex gap-6">
      {/* Main Content View */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6 shrink-0">
          <button onClick={() => router.push(`/${tenantId}/cms/desk`)} className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">콘텐츠 검수</h1>
            <p className="text-sm text-slate-500">ID: {contentId} · 작성자: 박웨딩 (앰배서더)</p>
          </div>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black mb-6">자연광 스튜디오 촬영 꿀팁</h2>
            <div className="prose prose-slate max-w-none">
              <p>자연광 스튜디오는 오전에 촬영하는 것이 가장 예쁩니다. 빛이 부드럽게 들어오거든요.</p>
              <p>특히 흐린 날에도 특유의 분위기가 있어서 생각보다 사진이 잘 나옵니다. 조명을 적절히 섞어 쓰는 스튜디오를 고르는 게 중요해요.</p>
              {/* Dummy highlight */}
              <p className="bg-amber-100 px-1 border-b-2 border-amber-300">
                오후 3시 이후에는 해가 빨리 져서 비추천합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Panel */}
      <div className="w-80 shrink-0 flex flex-col gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> 판정 및 티어 설정
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">퍼블리싱 위계 (Tier)</label>
              <select className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white">
                <option value="official">🔵 Official (공식 캐논)</option>
                <option value="expert_verified" selected>🟢 Expert Verified (전문가 검증)</option>
                <option value="community">⚪ Community (커뮤니티)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">상태 변경</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                  <CheckCircle2 className="w-6 h-6 mb-1" />
                  <span className="text-sm font-bold">승인 (발행)</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors">
                  <XCircle className="w-6 h-6 mb-1" />
                  <span className="text-sm font-bold">수정 반려</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> 인라인 코멘트
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm">
              <div className="font-bold text-amber-800 mb-1">오후 3시 이후 비추천 (전문가)</div>
              <div className="text-slate-700">여름/겨울에 따라 일몰 시간이 다릅니다. "동절기의 경우"라는 단서를 달아주면 더 정확할 것 같습니다.</div>
            </div>
          </div>

          <div className="shrink-0 relative">
            <textarea 
              placeholder="피드백 추가..." 
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-24 resize-none"
            ></textarea>
            <button className="absolute bottom-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
              코멘트 남기기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
