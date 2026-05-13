import { formatUsdcAmount } from "@/lib/utils";

interface AmountDisplayProps { amount: string; size?: "sm" | "md" | "lg"; className?: string; }

const sizeStyles: Record<string, string> = {
  sm: "text-sm", md: "text-lg font-semibold", lg: "text-2xl font-bold",
};

export function AmountDisplay({ amount, size = "md", className = "" }: AmountDisplayProps) {
  return (
    <span className={["text-text-primary tabular-nums", sizeStyles[size], className].join(" ")}>
      {formatUsdcAmount(amount)}
    </span>
  );
}
