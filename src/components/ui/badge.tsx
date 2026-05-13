import type { HTMLAttributes } from "react";

// ─── Variants ───────────────────────────────────────────────────────────────

type BadgeVariant = "pending" | "paid" | "overdue" | "default";

const variantStyles: Record<BadgeVariant, string> = {
  pending: "bg-accent-yellow/15 text-accent-yellow border-accent-yellow/30",
  paid: "bg-accent-green/15 text-accent-green border-accent-green/30",
  overdue: "bg-accent-red/15 text-accent-red border-accent-red/30",
  default: "bg-bg-elevated text-text-secondary border-border-default",
};

// ─── Props ──────────────────────────────────────────────────────────────────

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        variantStyles[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
