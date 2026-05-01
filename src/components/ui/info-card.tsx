/**
 * DS-6: InfoCard — Primary card primitive for Media.
 * Replaces 6+ files of inline `bg-white border border-slate-200 rounded-2xl p-6`.
 */
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-2xl transition-all duration-[var(--duration-normal)]",
  {
    variants: {
      variant: {
        default:  "bg-[var(--surface-primary)] border border-[var(--border-default)]",
        elevated: "bg-[var(--surface-primary)] border border-[var(--border-default)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        outlined: "bg-transparent border-2 border-[var(--border-default)]",
        ghost:    "bg-[var(--surface-secondary)]",
      },
      size: {
        sm: "p-4",
        md: "p-5",
        lg: "p-6",
        xl: "p-8",
      },
      interactive: {
        true:  "cursor-pointer hover:shadow-[var(--shadow-md)] hover:border-[var(--accent-primary)] active:scale-[0.99]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
    },
  }
);

export interface InfoCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function InfoCard({
  className,
  variant,
  size,
  interactive,
  children,
  ...props
}: InfoCardProps) {
  return (
    <div className={cn(cardVariants({ variant, size, interactive }), className)} {...props}>
      {children}
    </div>
  );
}
