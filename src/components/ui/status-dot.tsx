interface StatusDotProps {
  status: "active" | "pending" | "error" | "inactive";
  pulse?: boolean;
  className?: string;
}

const statusColors: Record<StatusDotProps["status"], string> = {
  active: "bg-accent-green",
  pending: "bg-accent-yellow",
  error: "bg-accent-red",
  inactive: "bg-text-muted",
};

/**
 * Small colored dot indicator for status representation.
 * Optionally pulses for active/live states.
 */
export function StatusDot({ status, pulse = false, className = "" }: StatusDotProps) {
  return (
    <span
      className={[
        "inline-block h-2 w-2 rounded-full",
        statusColors[status],
        pulse ? "animate-pulse" : "",
        className,
      ].join(" ")}
      aria-hidden="true"
    />
  );
}
