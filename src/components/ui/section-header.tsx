/**
 * DS-6: SectionHeader — Consistent section label pattern.
 * Replaces 4+ files of inline uppercase tracking-wider text.
 */
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon?: LucideIcon;
  label: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SectionHeader({ icon: Icon, label, className, size = "md" }: SectionHeaderProps) {
  const sizes = {
    sm: "text-[10px] gap-1",
    md: "text-xs gap-1.5",
    lg: "text-sm gap-2",
  };

  return (
    <div
      className={cn(
        "flex items-center font-bold uppercase tracking-widest text-[var(--text-tertiary)]",
        sizes[size],
        className
      )}
    >
      {Icon && <Icon className={cn(size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4")} />}
      <span>{label}</span>
    </div>
  );
}
