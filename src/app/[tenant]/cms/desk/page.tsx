import { getTenantConfig } from "@/lib/tenant-config";
import Link from "next/link";
import { CheckSquare, AlertCircle, Clock, Shield, ShieldAlert } from "lucide-react";
import { scanBoundaries } from "@/lib/dro-boundaries";

// Demo content with injected boundary violations for DR.O
const MOCK_REVIEW_QUEUE = [
  {
    id: "ca-dro-1",
    format: "answer_card",
    title: "토닝 후 집에서 매일 바르는 마스크",
    author: "김인터벌 (Interval Expert)",
    submitted_at: new Date().toISOString(),
    status: "review",
    body_preview: "토닝 후에는 매일 마스크를 바르면 좋습니다. 이 마스크팩은 일반 마스크팩과 다르게…",
    tenant_id: "dro",
  },
  {
    id: "ca-dro-2",
    format: "answer_card",
    title: "시술 후 집에서 뭘 써야 하나요 — Clinic-Care Answer",
    author: "DR.O Brand PM",
    submitted_at: new Date(Date.now() - 3600_000).toISOString(),
    status: "review",
    body_preview: "시술과 시술 사이의 공백에서 피부가 흔들릴 때, 메디텐션은 정확한 타이밍에 리프팅 라인을 지원하도록 설계되었습니다.",
    tenant_id: "dro",
  },
  {
    id: "ca-2",
    format: "answer_card",
    title: "자연광 스튜디오 촬영 꿀팁",
    author: "박웨딩 (앰배서더)",
    submitted_at: new Date().toISOString(),
    status: "review",
    body_preview: "자연광 스튜디오에서 가장 예쁜 사진을 위한 팁을 알려드릴게요.",
    tenant_id: "kwedding",
  },
];

export default async function CMSDeskPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const p = await params;
  const tenantId = p.tenant || "phalanx";
  const tc = getTenantConfig(tenantId);
  const isDerma = tc.vertical === 'clinic_derma';

  // Run boundary scan for clinic_derma tenant items
  const queueWithBoundary = MOCK_REVIEW_QUEUE
    .filter(item => item.tenant_id === tenantId || tenantId === 'phalanx')
    .map(item => {
      if (isDerma) {
        const scan = scanBoundaries(item.body_preview || '');
        return { ...item, boundaryResult: scan };
      }
      return { ...item, boundaryResult: null };
    });

  const pendingCount = queueWithBoundary.length;
  const blockedCount = queueWithBoundary.filter(i => i.boundaryResult?.has_blocks).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <CheckSquare className="w-8 h-8 text-indigo-600" />
          {isDerma ? 'Boundary Guard Desk' : '데스크 검수 큐'}
        </h1>
        <p className="text-slate-500 mt-1">
          {isDerma
            ? 'DR.O 브랜드 시맨틱 경계(Boundary)를 검수하고 Clinic Logic 콘텐츠를 승인합니다.'
            : '작성된 콘텐츠를 검수하고 승인/반려 및 발행 등급(Tier)을 결정합니다.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="text-amber-800 text-sm font-bold flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4" /> 검수 대기
          </div>
          <div className="text-3xl font-black text-amber-600">{pendingCount}건</div>
        </div>
        {isDerma && (
          <div className={`border rounded-2xl p-5 ${blockedCount > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className={`text-sm font-bold flex items-center gap-2 mb-1 ${blockedCount > 0 ? 'text-red-800' : 'text-green-800'}`}>
              {blockedCount > 0 ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
              Boundary 위반
            </div>
            <div className={`text-3xl font-black ${blockedCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{blockedCount}건</div>
          </div>
        )}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <div className="text-blue-800 text-sm font-bold flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4" /> 내 할당량
          </div>
          <div className="text-3xl font-black text-blue-600">{pendingCount}건</div>
        </div>
      </div>

      {/* Boundary Rules Reference (clinic_derma only) */}
      {isDerma && (
        <div className="mb-6 rounded-2xl p-5 border border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-amber-700" />
            <span className="text-sm font-bold text-amber-800">DR.O Boundary Guard Rules</span>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              { no: '매일 바르세요', yes: '주 1~2회 집중 트리트먼트로 표현' },
              { no: '데일리 기초/루틴', yes: '시술 연계형 스페셜 트리트먼트' },
              { no: '시술을 대체', yes: '시술과 시술 사이의 홈케어' },
              { no: '의료적 치료 효능 주장', yes: '"helps support" 등 안전 표현 사용' },
              { no: '일반 마스크팩으로 묘사', yes: '클리닉 로직 기반 홈 트리트먼트' },
              { no: '메디텐션/메디글로우 우열 비교', yes: '상황 적합도 분기로 표현' },
            ].map((rule) => (
              <div key={rule.no} className="rounded-lg p-2.5 bg-white border border-amber-100 text-xs">
                <span className="text-red-500">🚫 {rule.no}</span>
                <span className="text-slate-400 mx-1">→</span>
                <span className="text-green-700 font-semibold">✓ {rule.yes}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">콘텐츠 정보</th>
              <th className="px-6 py-3">포맷</th>
              <th className="px-6 py-3">작성자</th>
              {isDerma && <th className="px-6 py-3">Boundary</th>}
              <th className="px-6 py-3">제출일</th>
              <th className="px-6 py-3 text-right">검수</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {queueWithBoundary.map(item => {
              const hasBlock = item.boundaryResult?.has_blocks;
              const hasWarn = item.boundaryResult?.has_warnings && !hasBlock;
              return (
                <tr key={item.id} className={`hover:bg-slate-50 ${hasBlock ? 'bg-red-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-base">{item.title}</div>
                    <div className="text-xs text-slate-400 mt-1 max-w-xs truncate">{item.body_preview}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">
                      {item.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{item.author}</td>
                  {isDerma && (
                    <td className="px-6 py-4">
                      {hasBlock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          <ShieldAlert className="w-3 h-3" /> 차단 위반
                        </span>
                      ) : hasWarn ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          ⚠️ 경고
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          <Shield className="w-3 h-3" /> 통과
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 text-slate-500">{new Date(item.submitted_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/${tenantId}/cms/${item.id}/review`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-500 transition-colors"
                    >
                      검수하기
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
