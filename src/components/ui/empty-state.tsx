/**
 * DS-6: EmptyState — Consistent empty/no-results pattern.
 */
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateAction {
  label: string;
  href: string;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("text-center py-20", className)}>
      <div className="w-16 h-16 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-5">
        <Icon className="w-8 h-8 text-[var(--text-tertiary)]" />
      </div>
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6">{description}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
