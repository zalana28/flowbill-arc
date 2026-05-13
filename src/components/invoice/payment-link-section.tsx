"use client";

import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPaymentLinkUrl } from "@/lib/utils";

interface PaymentLinkSectionProps { invoiceId: string; }

export function PaymentLinkSection({ invoiceId }: PaymentLinkSectionProps) {
  const [copied, setCopied] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  useEffect(() => { if (typeof window !== "undefined") setPaymentUrl(getPaymentLinkUrl(invoiceId, window.location.origin)); }, [invoiceId]);

  const handleCopy = useCallback(async () => {
    if (!paymentUrl) return;
    try { await navigator.clipboard.writeText(paymentUrl); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* noop */ }
  }, [paymentUrl]);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-lg bg-accent-blue/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-accent-blue"><path d="M8.914 6.025a.75.75 0 01.06 1.06l-1.327 1.414h5.603a.75.75 0 010 1.5H7.647l1.327 1.414a.75.75 0 01-1.094 1.026l-2.68-2.857a.75.75 0 010-1.026l2.68-2.857a.75.75 0 011.06-.06z" /></svg>
        </div>
        <h3 className="text-sm font-semibold text-text-primary">Payment Link</h3>
      </div>
      <p className="text-xs text-text-muted mb-3">Share this link with your client to receive payment.</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 overflow-hidden rounded-xl border border-border-default bg-bg-surface px-3.5 py-2.5">
          <p className="truncate font-mono text-xs text-text-secondary">{paymentUrl || "Generating..."}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!paymentUrl}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </Card>
  );
}
