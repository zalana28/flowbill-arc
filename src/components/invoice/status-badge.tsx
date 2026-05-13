import { Badge } from "@/components/ui/badge";
import type { InvoiceStatus } from "@/types/invoice";

interface StatusBadgeProps { status: InvoiceStatus; className?: string; }

const statusVariant: Record<InvoiceStatus, "pending" | "paid" | "overdue"> = {
  pending: "pending", paid: "paid", overdue: "overdue",
};
const statusLabel: Record<InvoiceStatus, string> = {
  pending: "Pending", paid: "Paid", overdue: "Overdue",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <Badge variant={statusVariant[status]} className={className}>{statusLabel[status]}</Badge>;
}
