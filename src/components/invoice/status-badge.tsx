import { Badge } from "@/components/ui/badge";
import type { InvoiceStatus } from "@/types/invoice";

// ─── Props ──────────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

// ─── Variant Mapping ────────────────────────────────────────────────────────

const statusVariant: Record<InvoiceStatus, "pending" | "paid" | "overdue"> = {
  pending: "pending",
  paid: "paid",
  overdue: "overdue",
};

const statusLabel: Record<InvoiceStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  overdue: "Overdue",
};

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Color-coded badge that displays an invoice's current status.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariant[status]} className={className}>
      {statusLabel[status]}
    </Badge>
  );
}
