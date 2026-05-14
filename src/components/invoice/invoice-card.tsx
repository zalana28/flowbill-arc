"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Invoice } from "@/types/invoice";
import { StatusBadge } from "@/components/invoice/status-badge";
import { formatDate } from "@/lib/utils";

interface InvoiceCardProps {
  invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  return (
    <Link href={`/invoice/${invoice.id}`} className="block group">
      <motion.div
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.99 }}
        className="rounded-xl border border-border-default bg-bg-card/60 p-4 sm:p-5 transition-all duration-200 hover:border-border-accent hover:bg-bg-card hover:shadow-elevated group-focus-visible:ring-2 group-focus-visible:ring-accent-cyan/50"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 mb-1">
              <h3 className="truncate text-sm font-semibold text-text-primary">
                {invoice.clientName}
              </h3>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="truncate text-xs text-text-muted">
              {invoice.description}
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
            <span className="text-base font-bold tabular-nums text-text-primary">
              {parseFloat(invoice.amount).toFixed(2)} <span className="text-xs font-medium text-text-secondary">USDC</span>
            </span>
            <span className="text-[11px] text-text-muted">
              Due {formatDate(invoice.dueDate)}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
