import { getTenantConfig } from "@/lib/tenant-config";
import { TrendingUp, Users, Share2, MousePointerClick, Activity } from "lucide-react";

export default async function CMSAnalyticsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const p = await params;
  const tenantId = p.tenant || "phalanx";
  const tc = getTenantConfig(tenantId);

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8 shrink-0">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-indigo-600" /> 콘텐츠 성과 분석
        </h1>
        <p className="text-slate-500 mt-1">
          트래픽, 앰배서더 공유 전환율, 캐논 콘텐츠의 AEO 도달률을 모니터링합니다.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "총 누적 조회수", value: "24,592", change: "+12%", icon: MousePointerClick, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "소셜 공유 (앰배서더)", value: "1,204", change: "+8%", icon: Share2, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
          { label: "리드 전환 건수", value: "312", change: "+24%", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "AEO 검색 노출", value: "85%", change: "+5%", icon: Activity, color: "text-fuchsia-600", bg: "bg-fuchsia-50", border: "border-fuchsia-100" },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`rounded-2xl p-5 border ${kpi.bg} ${kpi.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${kpi.color}`} />
                <span className={`text-sm font-bold ${kpi.color}`}>{kpi.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-slate-800">{kpi.value}</span>
                <span className="text-sm font-bold text-emerald-600 bg-white/50 px-2 py-0.5 rounded-lg">{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Content Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            🏆 조회수 TOP 5 콘텐츠
          </h3>
          <div className="space-y-4">
            {[
              { title: "2026 S/S 웨딩드레스 트렌드 리포트", views: "5,230", shares: 420 },
              { title: "자연광 스튜디오 촬영 꿀팁", views: "3,110", shares: 215 },
              { title: "본식스냅 계약 전 필수 체크리스트", views: "2,840", shares: 198 },
              { title: "헤메 샵 고르는 기준과 팁", views: "1,950", shares: 140 },
              { title: "비수기 웨딩 할인 정보 총정리", views: "1,520", shares: 85 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                  <div className="text-sm font-bold text-slate-700">{item.title}</div>
                </div>
                <div className="text-right flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <span>조회 {item.views}</span>
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">공유 {item.shares}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Ambassadors */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            🌟 콘텐츠 기여도 TOP 5 (앰배서더)
          </h3>
          <div className="space-y-4">
            {[
              { name: "김*진", role: "플래너 (EXPERT)", score: 98, leads: 12 },
              { name: "이*연", role: "앰배서더", score: 85, leads: 8 },
              { name: "박*희", role: "앰배서더", score: 72, leads: 5 },
              { name: "정*수", role: "본식스냅 대표", score: 65, leads: 15 },
              { name: "최*영", role: "앰배서더", score: 54, leads: 2 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">{item.name[0]}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-700">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-800 flex items-center gap-1 justify-end">
                    Auth Score: <span className="text-fuchsia-600">{item.score}</span>
                  </div>
                  <div className="text-xs text-slate-500">생성 리드 {item.leads}건</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
