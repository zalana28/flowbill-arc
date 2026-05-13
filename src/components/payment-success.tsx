"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddressDisplay } from "@/components/invoice/address-display";
import { AnimatedCheckmark } from "@/components/ui/motion";
import { getExplorerTxUrl, formatDateTime } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

interface PaymentSuccessProps {
  invoice: Invoice;
}

/**
 * Animated payment success state with checkmark, receipt reveal, and ArcScan CTA.
 */
export function PaymentSuccess({ invoice }: PaymentSuccessProps) {
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
            <AnimatedCheckmark size={64} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-1">Payment Successful</h2>
            <p className="text-sm text-text-secondary">
              {parseFloat(invoice.amount).toFixed(2)} USDC sent on Arc Testnet
            </p>
          </motion.div>

          {/* Confetti dots */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 40}%`,
                  backgroundColor: ["#10b981", "#22d3ee", "#3b82f6", "#34d399"][i % 4],
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, -20, -40] }}
                transition={{ delay: 0.5 + i * 0.08, duration: 1.2, ease: "easeOut" }}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Receipt — staggered reveal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
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
      </motion.div>
    </div>
  );
}
