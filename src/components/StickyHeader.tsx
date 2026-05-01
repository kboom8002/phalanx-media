/**
 * DS-8: StickyHeader — Scroll-aware header with shrink transition.
 * Extracted from layout.tsx as client component to detect scroll state.
 */
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function StickyHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler(); // check on mount
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-[var(--shadow-md)] border-[var(--border-default)]"
          : "h-16 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-[var(--shadow-xs)] border-[var(--border-subtle)]"
      )}
    >
      <div className={cn(
        "container mx-auto px-4 flex items-center justify-between max-w-7xl gap-4 h-full transition-all",
      )}>
        {children}
      </div>
    </header>
  );
}
