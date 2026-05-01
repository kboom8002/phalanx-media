/**
 * DS-6: ArticleCard — Reusable card for webzine/canon articles.
 */
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Clock, ArrowRight, Flame } from "lucide-react";
import { StatusPill } from "./status-pill";

interface ArticleData {
  id: string;
  title: string;
  excerpt?: string;
  author?: string;
  date?: string;
  readTime?: string;
  category?: string;
  isHot?: boolean;
  href: string;
}

interface ArticleCardProps {
  article: ArticleData;
  variant?: "featured" | "compact" | "list";
  className?: string;
}

export function ArticleCard({ article, variant = "list", className }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <Link
        href={article.href}
        className={cn(
          "block bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-2xl p-8",
          "hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--duration-normal)] group",
          className
        )}
      >
        <div className="flex items-center gap-2 mb-4">
          {article.isHot && <StatusPill status="hot" />}
          {article.category && (
            <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">{article.category}</span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3 leading-snug group-hover:text-[var(--accent-primary)] transition-colors">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-sm text-[var(--text-tertiary)]">
          <span>{article.author} · {article.date}</span>
          <span className="flex items-center gap-1 text-[var(--accent-primary)] font-bold group-hover:gap-2 transition-all">
            읽기 <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={article.href}
        className={cn(
          "block bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-xl p-5",
          "hover:shadow-[var(--shadow-md)] transition-all group flex flex-col gap-2",
          className
        )}
      >
        {article.category && (
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">{article.category}</span>
        )}
        <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mt-auto">
          <Clock className="w-3 h-3" />
          {article.readTime} · {article.date}
        </div>
      </Link>
    );
  }

  // Default: list variant
  return (
    <Link
      href={article.href}
      className={cn(
        "flex items-center gap-5 p-5 bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-xl",
        "hover:shadow-[var(--shadow-md)] hover:border-[var(--accent-primary)]/30 transition-all group",
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {article.category && (
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">{article.category}</span>
          )}
          {article.isHot && <StatusPill status="hot" size="xs" />}
        </div>
        <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
          {article.title}
        </h3>
        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
          {article.author} · {article.date} · {article.readTime}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] shrink-0 transition-colors" />
    </Link>
  );
}
