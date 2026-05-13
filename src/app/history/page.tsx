"use client";

import { useAccount } from "wagmi";
import { useInvoices } from "@/hooks/use-invoices";
import { PageContainer } from "@/components/page-container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AddressDisplay } from "@/components/invoice/address-display";
import { formatDateTime, formatDate, getExplorerTxUrl } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

export default function HistoryPage() {
  const { isConnected } = useAccount();
  const { invoices, isLoading } = useInvoices();

  if (!isConnected) {
    return (
      <PageContainer glow>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-xl font-bold text-text-primary">Connect your wallet</h2>
          <p className="mt-2 text-sm text-text-secondary">Connect your wallet to view transaction history.</p>
        </div>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size={36} />
        </div>
      </PageContainer>
    );
  }

  const paidInvoices = invoices.filter((inv) => inv.status === "paid" && inv.payment);
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0);

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Transaction History</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {paidInvoices.length === 0
              ? "No completed transactions yet."
              : `${paidInvoices.length} transaction${paidInvoices.length !== 1 ? "s" : ""} — ${totalPaid.toFixed(2)} USDC total`}
          </p>
        </div>

        {/* Empty state */}
        {paidInvoices.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-surface border border-border-default">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-text-muted">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-text-primary">No transactions yet</h3>
              <p className="mt-1 text-sm text-text-secondary max-w-sm mx-auto">
                Completed USDC payments will appear here with full transaction details and explorer links.
              </p>
            </div>
          </Card>
        )}

        {/* Transaction list */}
        {paidInvoices.length > 0 && (
          <div className="space-y-3">
            {paidInvoices.map((invoice) => (
              <TransactionRow key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

// ─── Transaction Row ────────────────────────────────────────────────────────

function TransactionRow({ invoice }: { invoice: Invoice }) {
  const { payment } = invoice;
  if (!payment) return null;

  const explorerUrl = getExplorerTxUrl(payment.txHash);

  return (
    <Card padding="p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Left: icon + info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green/10 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-accent-green">
              <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.844-8.791a.75.75 0 00-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 10-1.114 1.004l2.25 2.5a.75.75 0 001.15-.043l4.25-5.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-semibold text-text-primary truncate">{invoice.clientName}</p>
              <Badge variant="paid">Paid</Badge>
            </div>
            <p className="text-xs text-text-muted truncate">{invoice.description}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-text-muted">
              <span>{formatDate(invoice.dueDate)}</span>
              <span className="text-border-default">·</span>
              <AddressDisplay address={payment.payerAddress} chars={3} copyable={false} />
            </div>
          </div>
        </div>

        {/* Right: amount + link */}
        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1 pl-13 sm:pl-0">
          <p className="text-base font-bold tabular-nums text-text-primary">
            +{parseFloat(invoice.amount).toFixed(2)} <span className="text-xs font-medium text-text-secondary">USDC</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-muted">{formatDateTime(payment.paidAt)}</span>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-cyan hover:text-accent-cyan/80 transition-colors"
              title="View on ArcScan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M6.22 8.72a.75.75 0 001.06 1.06l5.22-5.22v1.69a.75.75 0 001.5 0v-3.5a.75.75 0 00-.75-.75h-3.5a.75.75 0 000 1.5h1.69L6.22 8.72z" />
                <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 007 4H4.75A2.75 2.75 0 002 6.75v4.5A2.75 2.75 0 004.75 14h4.5A2.75 2.75 0 0012 11.25V9a.75.75 0 00-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
