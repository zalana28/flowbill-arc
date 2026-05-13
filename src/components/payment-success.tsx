"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddressDisplay } from "@/components/invoice/address-display";
import { getExplorerTxUrl, formatDateTime } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

interface PaymentSuccessProps {
  invoice: Invoice;
}

/**
 * Animated payment success state with receipt summary and ArcScan CTA.
 * Shows a checkmark animation on mount, then reveals receipt details.
 */
export function PaymentSuccess({ invoice }: PaymentSuccessProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowDetails(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const { payment } = invoice;
  if (!payment) return null;

  const explorerUrl = getExplorerTxUrl(payment.txHash);

  return (
    <div className="space-y-5">
      {/* Success hero */}
      <Card className="border-accent-green/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-green/8 via-transparent to-transparent pointer-events-none" />
        <div className="relative text-center py-6">
          {/* Animated checkmark */}
          <div className="mb-4 inline-flex items-center justify-center">
            <div className="relative h-16 w-16">
              {/* Ring */}
              <svg className="absolute inset-0 h-16 w-16 animate-draw-ring" viewBox="0 0 64 64" fill="none">
                <circle
                  cx="32" cy="32" r="28"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-accent-green"
                  strokeLinecap="round"
                  strokeDasharray="176"
                  strokeDashoffset="0"
                />
              </svg>
              {/* Checkmark */}
              <svg className="absolute inset-0 h-16 w-16 animate-draw-check" viewBox="0 0 64 64" fill="none">
                <path
                  d="M20 34 L28 42 L44 24"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-accent-green"
                  strokeDasharray="40"
                  strokeDashoffset="0"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-text-primary mb-1">Payment Successful</h2>
          <p className="text-sm text-text-secondary">
            {parseFloat(invoice.amount).toFixed(2)} USDC sent on Arc Testnet
          </p>
        </div>
      </Card>

      {/* Receipt details — fade in */}
      <div
        className={[
          "transition-all duration-500 ease-out",
          showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        <Card>
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">
            Transaction Receipt
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-muted">Amount</dt>
              <dd className="font-semibold tabular-nums text-gradient">
                {parseFloat(invoice.amount).toFixed(2)} USDC
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-muted">Payer</dt>
              <dd><AddressDisplay address={payment.payerAddress} /></dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-muted">Recipient</dt>
              <dd><AddressDisplay address={invoice.recipientAddress} /></dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-text-muted">Transaction</dt>
              <dd>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-accent-cyan hover:underline inline-block truncate max-w-[180px]"
                  title={payment.txHash}
                >
                  {payment.txHash.slice(0, 10)}...{payment.txHash.slice(-8)}
                </a>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-muted">Confirmed</dt>
              <dd className="text-text-secondary text-xs">{formatDateTime(payment.paidAt)}</dd>
            </div>
          </dl>

          <div className="mt-5 pt-4 border-t border-border-default">
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="secondary" size="md" fullWidth>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                  <path d="M6.22 8.72a.75.75 0 001.06 1.06l5.22-5.22v1.69a.75.75 0 001.5 0v-3.5a.75.75 0 00-.75-.75h-3.5a.75.75 0 000 1.5h1.69L6.22 8.72z" />
                  <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 007 4H4.75A2.75 2.75 0 002 6.75v4.5A2.75 2.75 0 004.75 14h4.5A2.75 2.75 0 0012 11.25V9a.75.75 0 00-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5z" />
                </svg>
                View on ArcScan
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
