import { formatUsdcAmount } from "@/lib/utils";

// ─── Props ──────────────────────────────────────────────────────────────────

interface AmountDisplayProps {
  /** Amount as a string (e.g. "150.50") */
  amount: string;
  /** Optional size variant */
  size?: "sm" | "md" | "lg";
  className?: string;
}

// ─── Size Styles ────────────────────────────────────────────────────────────

const sizeStyles: Record<string, string> = {
  sm: "text-sm",
  md: "text-lg font-semibold",
  lg: "text-2xl font-bold",
};

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Displays a formatted USDC amount with consistent styling.
 */
export function AmountDisplay({
  amount,
  size = "md",
  className = "",
}: AmountDisplayProps) {
  return (
    <span
      className={["text-text-primary tabular-nums", sizeStyles[size], className].join(
        " "
      )}
    >
      {formatUsdcAmount(amount)}
    </span>
  );
}
