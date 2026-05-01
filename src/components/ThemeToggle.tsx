/**
 * DS-10: ThemeToggle — Dark/light mode toggle button.
 */
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // prevent hydration mismatch
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-500" />
      )}
    </button>
  );
}
