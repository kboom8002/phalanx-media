/**
 * DS-6: StatusPill — Semantic status indicators.
 * Replaces inline status badges across challenges, webzine, canon.
 */
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pillVariants = cva(
  "inline-flex items-center gap-1 font-bold rounded-full whitespace-nowrap",
  {
    variants: {
      status: {
        open:      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
        closed:    "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
        hot:       "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
        new:       "bg-rose-500 text-white",
        verified:  "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
        draft:     "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        judging:   "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
      },
      size: {
        xs: "text-[10px] px-1.5 py-0.5",
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
      },
    },
    defaultVariants: { status: "open", size: "sm" },
  }
);

const STATUS_LABELS: Record<string, string> = {
  open: "모집 중",
  closed: "마감",
  hot: "HOT",
  new: "New",
  verified: "검증 완료",
  draft: "초안",
  judging: "심사 중",
};

export interface StatusPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {
  label?: string;
}

export function StatusPill({ status, size, label, className, ...props }: StatusPillProps) {
  return (
    <span className={cn(pillVariants({ status, size }), className)} {...props}>
      {label || STATUS_LABELS[status || "open"]}
    </span>
  );
}
