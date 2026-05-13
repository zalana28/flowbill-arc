"use client";

import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPaymentLinkUrl } from "@/lib/utils";

// ─── Props ──────────────────────────────────────────────────────────────────

interface PaymentLinkSectionProps {
  invoiceId: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Displays the shareable payment link with a copy button.
 */
export function PaymentLinkSection({ invoiceId }: PaymentLinkSectionProps) {
  const [copied, setCopied] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPaymentUrl(getPaymentLinkUrl(invoiceId, window.location.origin));
    }
  }, [invoiceId]);

  const handleCopy = useCallback(async () => {
    if (!paymentUrl) return;
    try {
      await navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API not available
    }
  }, [paymentUrl]);

  return (
    <Card>
      <h3 className="text-sm font-medium text-text-primary mb-3">
        Payment Link
      </h3>
      <p className="text-xs text-text-secondary mb-3">
        Share this link with your client to receive payment.
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 overflow-hidden rounded-lg border border-border-default bg-bg-elevated px-3 py-2">
          <p className="truncate font-mono text-xs text-text-secondary">
            {paymentUrl || "Generating..."}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          disabled={!paymentUrl}
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </Card>
  );
}
