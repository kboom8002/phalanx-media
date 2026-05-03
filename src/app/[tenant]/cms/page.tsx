import { getTenantConfig } from "@/lib/tenant-config";
import { getContentFormats } from "@/lib/content-formats";
import Link from "next/link";
import { FileText, Image, BarChart3, TrendingUp, BookOpen, Newspaper, Plus } from "lucide-react";
import { ContentAsset } from "@/lib/content-types";

// Mock data for CMS dashboard
const MOCK_ASSETS: ContentAsset[] = [
  {
    id: "ca-1",
    tenant_id: "kwedding",
    format: "article",
    tier: "official",
    status: "published",
    title: "2026 S/S 웨딩드레스 트렌드 리포트",
    slug: "2026-ss-dress-trend",
    body: {},
    category: "드레스",
    tags: ["트렌드", "봄웨딩"],
    author_id: "u-1",
    author_role: "PRINCIPAL",
    version: 1,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    published_at: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "ca-2",
    tenant_id: "kwedding",
    format: "answer_card",
    tier: "expert_verified",
    status: "review",
    title: "자연광 스튜디오 촬영 꿀팁",
    slug: "natural-light-studio-tips",
    body: {},
    category: "스튜디오",
    tags: ["자연광", "팁"],
    author_id: "u-2",
    author_role: "ACTIVIST",
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export default async function CMSDashboardPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ status?: string }>;
  params: Promise<{ tenant: string }>;
}) {
  const sp = await searchParams;
  const p = await params;
  const tenantId = p.tenant || "phalanx";
  const tc = getTenantConfig(tenantId);
  const formats = getContentFormats(tc.vertical);
  
  const statusFilter = sp.status;
  const filteredAssets = statusFilter 
    ? MOCK_ASSETS.filter(a => a.status === statusFilter)
    : MOCK_ASSETS;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">CMS 대시보드</h1>
          <p className="text-slate-500 mt-1">모든 콘텐츠 포맷을 통합 관리합니다.</p>
        </div>
        <Link
          href={`/${tenantId}/cms/create`}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          작성하기
        </Link>
      </div>

      {/* Format Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.values(formats).filter(f => f.enabled).map((f) => {
          const Icon = {
            Newspaper, BookOpen, BarChart3, Image, TrendingUp, 'Film': Image // Mocking Film for now
          }[f.icon as string] || FileText;
          
          return (
            <div key={f.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <Icon className="w-6 h-6 text-indigo-500 mb-2" />
              <div className="text-2xl font-black text-slate-800">
                {MOCK_ASSETS.filter(a => a.format === f.id).length}
              </div>
              <div className="text-xs text-slate-500 font-semibold">{f.label}</div>
            </div>
          );
        })}
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">최근 콘텐츠</h2>
          {/* Filters could go here */}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">제목</th>
                <th className="px-6 py-3">포맷</th>
                <th className="px-6 py-3">상태</th>
                <th className="px-6 py-3">위계 (Tier)</th>
                <th className="px-6 py-3">날짜</th>
                <th className="px-6 py-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    표시할 콘텐츠가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{asset.title}</div>
                      <div className="text-xs text-slate-400">{asset.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-600">
                        {formats[asset.format]?.label || asset.format}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                        asset.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                        asset.status === 'review' ? 'bg-amber-100 text-amber-700' :
                        asset.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {asset.status === 'published' ? '발행됨' :
                         asset.status === 'review' ? '검수 대기' :
                         asset.status === 'draft' ? '초안' :
                         asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600">
                        {asset.tier === 'official' ? '🔵 공식' :
                         asset.tier === 'expert_verified' ? '🟢 전문가 검증' :
                         '⚪ 커뮤니티'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(asset.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/${tenantId}/cms/${asset.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        편집
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
