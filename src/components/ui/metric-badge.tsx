/**
 * DS-6: MetricBadge — Numeric metric display with label.
 * Used in dashboards, expert cards, challenge stats.
 */
import { cn } from "@/lib/utils";

interface MetricBadgeProps {
  value: string | number;
  label: string;
  color?: "indigo" | "emerald" | "amber" | "rose" | "slate";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const COLOR_MAP = {
  indigo:  "text-indigo-700 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950",
  emerald: "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
  amber:   "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
  rose:    "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950",
  slate:   "text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-800",
};

export function MetricBadge({
  value,
  label,
  color = "indigo",
  size = "md",
  className,
}: MetricBadgeProps) {
  const sizes = {
    sm: "px-2.5 py-1.5",
    md: "px-3 py-2",
    lg: "px-4 py-3",
  };
  const valueSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div
      className={cn(
        "rounded-xl text-center",
        sizes[size],
        COLOR_MAP[color],
        className
      )}
    >
      <div className={cn("font-black tracking-tight", valueSizes[size])}>
        {value}
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-widest opacity-70 mt-0.5">
        {label}
      </div>
    </div>
  );
}
