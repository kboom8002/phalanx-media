/**
 * DS-7: Skeleton Loading System.
 * Provides a base Skeleton primitive and page-specific skeleton compositions.
 */
import { cn } from "@/lib/utils";

/* ── Base Primitive ── */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200/60 dark:bg-slate-700/40",
        className
      )}
    />
  );
}

/* ── Article Card Skeleton ── */
export function ArticleCardSkeleton() {
  return (
    <div className="bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-2xl p-6 space-y-3">
      <Skeleton className="h-3 w-20 rounded-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

/* ── Expert Card Skeleton ── */
export function ExpertCardSkeleton() {
  return (
    <div className="bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-2xl p-6 text-center space-y-3">
      <Skeleton className="w-20 h-20 rounded-full mx-auto" />
      <Skeleton className="h-5 w-32 mx-auto" />
      <Skeleton className="h-3 w-24 mx-auto" />
      <div className="flex gap-2 justify-center pt-2">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

/* ── Challenge Card Skeleton ── */
export function ChallengeCardSkeleton() {
  return (
    <div className="bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-2xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-4 pt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

/* ── Search Result Skeleton ── */
export function SearchResultSkeleton() {
  return (
    <div className="flex items-start gap-4 p-5 bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-2xl">
      <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

/* ── Metric Skeleton ── */
export function MetricSkeleton() {
  return (
    <div className="rounded-xl p-3 bg-[var(--surface-secondary)] text-center space-y-1">
      <Skeleton className="h-7 w-12 mx-auto" />
      <Skeleton className="h-2 w-10 mx-auto" />
    </div>
  );
}
