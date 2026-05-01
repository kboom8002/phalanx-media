"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Search, BookOpen, Landmark, Trophy, Loader2, X, ArrowRight, FileText } from "lucide-react";
import { getTenantConfig } from "@/lib/tenant-config";

const TYPE_ICONS: Record<string, React.ElementType> = {
  factcard: BookOpen,
  expert: Landmark,
  challenge: Trophy,
  webzine: FileText,
};

const TYPE_COLORS: Record<string, string> = {
  factcard: "text-indigo-600 bg-indigo-50",
  expert: "text-emerald-600 bg-emerald-50",
  challenge: "text-amber-600 bg-amber-50",
  webzine: "text-blue-600 bg-blue-50",
};

export default function SearchPage() {
  const tc = getTenantConfig();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(v), 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Search Header */}
      <header className="pt-28 pb-12 px-4 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Search className="w-4 h-4" /> 통합 검색
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={tc.media.searchPlaceholder}
                className="w-full pl-12 pr-12 py-4 text-lg border border-slate-300 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setResults([]); setSearched(false); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          </form>

          {/* Quick links */}
          {!searched && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-slate-400">빠른 탐색:</span>
              {[
                { href: "/webzine", label: "최신 웹진" },
                { href: "/canon", label: "정답카드" },
                { href: "/experts", label: "전문가" },
                { href: "/challenges", label: "챌린지" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Results */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        {loading && (
          <div className="flex items-center gap-3 py-12 justify-center text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            검색 중...
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-600 mb-2">검색 결과가 없습니다</h2>
            <p className="text-sm text-slate-400">다른 키워드로 다시 검색해 보세요.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <p className="text-sm text-slate-400 mb-5">
              <strong className="text-slate-700">"{query}"</strong> 에 대한 검색 결과 {results.length}건
            </p>
            <div className="space-y-3">
              {results.map((result, i) => {
                const Icon = TYPE_ICONS[result.type] || FileText;
                const colorClass = TYPE_COLORS[result.type] || "text-slate-600 bg-slate-50";
                return (
                  <Link
                    key={i}
                    href={result.href}
                    className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:shadow-md hover:border-slate-300 transition-all group"
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colorClass}`}>
                          {result.badge}
                        </span>
                        {result.category && (
                          <span className="text-xs text-slate-400">{result.category}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors leading-snug">
                        {result.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{result.excerpt}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 shrink-0 mt-1 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
