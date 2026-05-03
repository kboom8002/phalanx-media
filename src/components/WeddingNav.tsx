import Link from "next/link";
import { Camera, Shirt, Sparkles, Film, Package, HelpCircle, MessageCircle, Search } from "lucide-react";

const WEDDING_CATEGORIES = [
  { href: '/category/studio', label: '웨딩스튜디오', icon: Camera },
  { href: '/category/dress', label: '드레스샵', icon: Shirt },
  { href: '/category/makeup', label: '메이크업', icon: Sparkles },
  { href: '/category/snap', label: '스냅 · 본식', icon: Film },
  { href: '/category/package', label: '패키지', icon: Package },
];

export function WeddingNav({ osUrl }: { osUrl: string }) {
  return (
    <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-700 h-full flex-1 justify-center">
      {/* 탐색하기 드롭다운 */}
      <div className="relative group h-full flex items-center">
        <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Camera className="w-4 h-4" /> 탐색하기
          <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2">
          {WEDDING_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Link key={cat.href} href={cat.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors text-slate-600">
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Q&A 가이드 */}
      <Link href="/canon" className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
        <HelpCircle className="w-4 h-4" /> Q&A 가이드
      </Link>

      {/* 웨딩 매거진 */}
      <Link href="/webzine" className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
        📖 매거진
      </Link>

      {/* 예비부부 Q&A */}
      <Link href="/agora" className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
        <MessageCircle className="w-4 h-4" /> 커뮤니티
      </Link>

      {/* CMS */}
      <Link href="/cms" className="flex items-center gap-1 px-3 py-2 rounded-lg text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
        콘텐츠 데스크
      </Link>

      <div className="w-px h-5 bg-slate-200 mx-1" />

      {/* 검색 */}
      <Link href="/search" className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
        <Search className="w-4 h-4" />
      </Link>
    </nav>
  );
}
