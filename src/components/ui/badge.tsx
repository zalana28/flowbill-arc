import type { HTMLAttributes } from "react";

type BadgeVariant = "pending" | "paid" | "overdue" | "default";

const variantStyles: Record<BadgeVariant, string> = {
  pending: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20",
  paid: "bg-accent-green/10 text-accent-green border-accent-green/20",
  overdue: "bg-accent-red/10 text-accent-red border-accent-red/20",
  default: "bg-bg-surface text-text-secondary border-border-default",
};

const dotColors: Record<BadgeVariant, string> = {
  pending: "bg-accent-yellow",
  paid: "bg-accent-green",
  overdue: "bg-accent-red",
  default: "bg-text-muted",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        variantStyles[variant],
        className,
      ].join(" ")}
      {...props}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      {children}
    </span>
  );
}
