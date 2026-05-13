import Link from "next/link";
import type { Invoice } from "@/types/invoice";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/invoice/status-badge";
import { AmountDisplay } from "@/components/invoice/amount-display";
import { formatDate } from "@/lib/utils";

// ─── Props ──────────────────────────────────────────────────────────────────

interface InvoiceCardProps {
  invoice: Invoice;
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Card component for displaying an invoice summary in the dashboard list.
 * Clickable — navigates to the invoice detail page.
 */
export function InvoiceCard({ invoice }: InvoiceCardProps) {
  return (
    <Link href={`/invoice/${invoice.id}`} className="block group">
      <Card className="transition-colors duration-150 group-hover:border-accent-blue/40 group-hover:bg-bg-card/80">
        <div className="flex items-start justify-between gap-4">
          {/* Left: client + description */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-medium text-text-primary">
                {invoice.clientName}
              </h3>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="mt-1 truncate text-sm text-text-secondary">
              {invoice.description}
            </p>
          </div>

          {/* Right: amount + due date */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <AmountDisplay amount={invoice.amount} size="sm" />
            <span className="text-xs text-text-secondary">
              Due {formatDate(invoice.dueDate)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
