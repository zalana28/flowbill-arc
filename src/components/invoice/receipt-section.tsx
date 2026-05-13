import { Card } from "@/components/ui/card";
import { AddressDisplay } from "@/components/invoice/address-display";
import { AmountDisplay } from "@/components/invoice/amount-display";
import type { Invoice } from "@/types/invoice";
import { formatDateTime, getExplorerTxUrl } from "@/lib/utils";

// ─── Props ──────────────────────────────────────────────────────────────────

interface ReceiptSectionProps {
  invoice: Invoice;
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Payment receipt displayed after an invoice has been paid.
 * Shows payer, recipient, amount, tx hash, timestamp, and explorer link.
 */
export function ReceiptSection({ invoice }: ReceiptSectionProps) {
  const { payment } = invoice;
  if (!payment) return null;

  const explorerUrl = getExplorerTxUrl(payment.txHash);

  return (
    <Card className="border-accent-green/30 bg-accent-green/5">
      <h3 className="text-sm font-medium text-accent-green mb-4">
        Payment Receipt
      </h3>

      <dl className="space-y-3 text-sm">
        {/* Invoice ID */}
        <div className="flex items-start justify-between gap-4">
          <dt className="text-text-secondary">Invoice ID</dt>
          <dd className="font-mono text-xs text-text-primary truncate max-w-[200px]">
            {invoice.id}
          </dd>
        </div>

        {/* Payer */}
        <div className="flex items-center justify-between gap-4">
          <dt className="text-text-secondary">Payer</dt>
          <dd>
            <AddressDisplay address={payment.payerAddress} />
          </dd>
        </div>

        {/* Recipient */}
        <div className="flex items-center justify-between gap-4">
          <dt className="text-text-secondary">Recipient</dt>
          <dd>
            <AddressDisplay address={invoice.recipientAddress} />
          </dd>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between gap-4">
          <dt className="text-text-secondary">Amount</dt>
          <dd>
            <AmountDisplay amount={invoice.amount} size="sm" />
          </dd>
        </div>

        {/* Transaction Hash */}
        <div className="flex items-start justify-between gap-4">
          <dt className="text-text-secondary">Transaction</dt>
          <dd>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-accent-blue hover:underline truncate max-w-[200px] inline-block"
              title={payment.txHash}
            >
              {payment.txHash.slice(0, 10)}...{payment.txHash.slice(-8)}
            </a>
          </dd>
        </div>

        {/* Paid At */}
        <div className="flex items-center justify-between gap-4">
          <dt className="text-text-secondary">Paid</dt>
          <dd className="text-text-primary">
            {formatDateTime(payment.paidAt)}
          </dd>
        </div>
      </dl>

      {/* Explorer link */}
      <div className="mt-4 pt-4 border-t border-border-default">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-accent-blue hover:underline"
        >
          View on ArcScan
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </Card>
  );
}
