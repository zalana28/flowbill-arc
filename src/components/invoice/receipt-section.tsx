import { Card } from "@/components/ui/card";
import { AddressDisplay } from "@/components/invoice/address-display";
import type { Invoice } from "@/types/invoice";
import { formatDateTime, getExplorerTxUrl } from "@/lib/utils";

interface ReceiptSectionProps { invoice: Invoice; }

export function ReceiptSection({ invoice }: ReceiptSectionProps) {
  const { payment } = invoice;
  if (!payment) return null;
  const explorerUrl = getExplorerTxUrl(payment.txHash);

  return (
    <Card className="border-accent-green/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-lg bg-accent-green/15 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-accent-green"><path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.844-8.791a.75.75 0 00-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 10-1.114 1.004l2.25 2.5a.75.75 0 001.15-.043l4.25-5.5z" clipRule="evenodd" /></svg>
          </div>
          <h3 className="text-sm font-semibold text-accent-green">Payment Receipt</h3>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4"><dt className="text-text-muted">Invoice ID</dt><dd className="font-mono text-xs text-text-secondary truncate max-w-[180px]">{invoice.id}</dd></div>
          <div className="flex items-center justify-between gap-4"><dt className="text-text-muted">Payer</dt><dd><AddressDisplay address={payment.payerAddress} /></dd></div>
          <div className="flex items-center justify-between gap-4"><dt className="text-text-muted">Recipient</dt><dd><AddressDisplay address={invoice.recipientAddress} /></dd></div>
          <div className="flex items-center justify-between gap-4"><dt className="text-text-muted">Amount</dt><dd className="font-semibold tabular-nums text-text-primary">{parseFloat(invoice.amount).toFixed(2)} USDC</dd></div>
          <div className="flex items-start justify-between gap-4"><dt className="text-text-muted">Transaction</dt><dd><a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-accent-cyan hover:underline truncate max-w-[180px] inline-block" title={payment.txHash}>{payment.txHash.slice(0, 10)}...{payment.txHash.slice(-8)}</a></dd></div>
          <div className="flex items-center justify-between gap-4"><dt className="text-text-muted">Paid</dt><dd className="text-text-secondary">{formatDateTime(payment.paidAt)}</dd></div>
        </dl>
        <div className="mt-5 pt-4 border-t border-border-default">
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-cyan hover:underline">
            View on ArcScan
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3"><path d="M6.22 8.72a.75.75 0 001.06 1.06l5.22-5.22v1.69a.75.75 0 001.5 0v-3.5a.75.75 0 00-.75-.75h-3.5a.75.75 0 000 1.5h1.69L6.22 8.72z" /><path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 007 4H4.75A2.75 2.75 0 002 6.75v4.5A2.75 2.75 0 004.75 14h4.5A2.75 2.75 0 0012 11.25V9a.75.75 0 00-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5z" /></svg>
          </a>
        </div>
      </div>
    </Card>
  );
}
