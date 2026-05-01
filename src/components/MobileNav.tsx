"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Newspaper, BookOpen, Landmark, Trophy, MessageSquare, ExternalLink } from "lucide-react";

interface MobileNavProps {
  osUrl: string;
  terminology: {
    signal: string;
    canon: string;
    agora: string;
  };
}

const NAV_GROUPS = [
  {
    title: "콘텐츠",
    items: [
      { href: "/webzine",    label: "웹진",       icon: Newspaper  },
      { href: "/canon",      label: "정답카드",   icon: BookOpen   },
    ],
  },
  {
    title: "커뮤니티",
    items: [
      { href: "/experts",    label: "전문가 네트워크", icon: Landmark   },
      { href: "/challenges", label: "챌린지",         icon: Trophy     },
      { href: "/agora",      label: "공론장",          icon: MessageSquare },
    ],
  },
];

export function MobileNav({ osUrl, terminology }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <span className="font-black text-lg text-slate-900">메뉴</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="메뉴 닫기"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Nav Groups */}
        <nav className="p-4 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-sm font-semibold">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-slate-100 bg-white">
          <a
            href={`${osUrl}/v-dash`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors"
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="w-4 h-4" />
            참여 공간 가기 →
          </a>
        </div>
      </div>
    </>
  );
}
