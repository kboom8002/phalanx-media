import Link from "next/link";
import { getTenantConfig } from "@/lib/tenant-config";
import { FileText, LayoutDashboard, Calendar, PenLine, Settings, CheckSquare, TrendingUp } from "lucide-react";

export default async function CMSLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const p = await params;
  const tenantId = p.tenant || "phalanx";
  const tc = getTenantConfig(tenantId);

  const NAV_ITEMS = [
    { href: `/${tenantId}/cms`, label: '대시보드', icon: LayoutDashboard },
    { href: `/${tenantId}/cms?status=draft`, label: '내 초안', icon: PenLine },
    { href: `/${tenantId}/cms/desk`, label: '데스크 (검수 큐)', icon: CheckSquare },
    { href: `/${tenantId}/cms?status=published`, label: '발행됨', icon: FileText },
    { href: `/${tenantId}/cms/calendar`, label: '캘린더', icon: Calendar },
    { href: `/${tenantId}/cms/analytics`, label: '성과 분석', icon: TrendingUp },
    { href: `/${tenantId}/cms/settings`, label: '설정', icon: Settings },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Content CMS</h2>
          <p className="text-xs text-slate-500 mt-1">{tc.displayName}</p>
        </div>
        <nav className="px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-8">
          <Link
            href={`/${tenantId}/cms/create`}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-sm font-bold shadow-sm transition-colors"
          >
            <PenLine className="w-4 h-4" />
            새 콘텐츠 작성
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
