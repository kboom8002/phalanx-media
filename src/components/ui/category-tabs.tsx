/**
 * DS-6: CategoryTabs — Reusable horizontal pill-tabs for filtering.
 */
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Category {
  key: string;
  label: string;
  icon?: LucideIcon;
}

interface CategoryTabsProps {
  categories: Category[];
  activeKey: string;
  baseHref: string;
  paramName?: string;
  className?: string;
}

export function CategoryTabs({
  categories,
  activeKey,
  baseHref,
  paramName = "category",
  className,
}: CategoryTabsProps) {
  return (
    <div className={cn("flex gap-1.5 overflow-x-auto pb-px", className)}>
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeKey === cat.key;
        return (
          <Link
            key={cat.key}
            href={`${baseHref}?${paramName}=${cat.key}`}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border",
              "transition-all duration-[var(--duration-fast)]",
              isActive
                ? "bg-[var(--text-primary)] text-[var(--text-inverse)] border-[var(--text-primary)]"
                : "bg-[var(--surface-primary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
