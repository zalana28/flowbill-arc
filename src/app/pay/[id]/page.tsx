"use client";

import { use, useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { useInvoices } from "@/hooks/use-invoices";
import { useNetworkCheck } from "@/hooks/use-network-check";
import { usePayInvoice } from "@/hooks/use-pay-invoice";
import { PageContainer } from "@/components/page-container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AddressDisplay } from "@/components/invoice/address-display";
import { StatusBadge } from "@/components/invoice/status-badge";
import { ReceiptSection } from "@/components/invoice/receipt-section";
import { formatDate } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

interface PaymentPageProps { params: Promise<{ id: string }>; }

export default function PaymentPage({ params }: PaymentPageProps) {
  const { id } = use(params);
  const { getById, markPaid, isLoading: isLoadingInvoices } = useInvoices();
  const [invoice, setInvoice] = useState<Invoice | undefined>(undefined);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => { if (!isLoadingInvoices) { setInvoice(getById(id)); setIsHydrated(true); } }, [id, getById, isLoadingInvoices]);

  if (!isHydrated) return (<PageContainer><div className="flex items-center justify-center py-24"><LoadingSpinner size={36} /></div></PageContainer>);

  if (!invoice) {
    return (
      <PageContainer glow>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-surface border border-border-default">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-text-muted"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary">Invoice not found</h2>
          <p className="mt-2 text-sm text-text-secondary max-w-sm">This link may be invalid or the invoice has been removed.</p>
        </div>
      </PageContainer>
    );
  }

  if (invoice.status === "paid") {
    return (
      <PageContainer glow>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="text-center border-accent-green/20">
            <div className="py-4">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/15"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-accent-green"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg></div>
              <h2 className="text-xl font-bold text-text-primary">Invoice Paid</h2>
              <p className="mt-1 text-sm text-text-secondary">This invoice has been paid successfully.</p>
            </div>
          </Card>
          <ReceiptSection invoice={invoice} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer glow grid>
      <div className="max-w-lg mx-auto space-y-6 py-4">
        {/* Payment card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-green/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative text-center mb-6">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Payment Request</p>
            <p className="text-4xl font-bold tabular-nums text-gradient">{parseFloat(invoice.amount).toFixed(2)}</p>
            <p className="text-sm font-medium text-text-secondary mt-1">USDC on Arc Testnet</p>
          </div>
          <dl className="space-y-3 text-sm border-t border-border-default pt-4">
            <Row label="Description" value={invoice.description} />
            <Row label="From" value={invoice.clientName} />
            <Row label="To"><AddressDisplay address={invoice.recipientAddress} /></Row>
            <Row label="Due" value={formatDate(invoice.dueDate)} />
            <Row label="Status"><StatusBadge status={invoice.status} /></Row>
          </dl>
        </Card>

        {/* Action */}
        <PaymentAction invoice={invoice} onSuccess={(inv) => setInvoice(inv)} markPaid={markPaid} />
      </div>
    </PageContainer>
  );
}

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>
      <dd className="text-text-primary text-right truncate max-w-[60%]">{children || value}</dd>
    </div>
  );
}

// ─── Payment Action ─────────────────────────────────────────────────────────

function PaymentAction({ invoice, onSuccess, markPaid }: { invoice: Invoice; onSuccess: (inv: Invoice) => void; markPaid: (id: string, payment: { txHash: string; payerAddress: string; paidAt: string; blockNumber: number }) => Invoice | undefined }) {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { isCorrectNetwork, switchToArcTestnet, isSwitching, switchError } = useNetworkCheck();
  const { pay, isPaying, isConfirming, isSuccess, isError, error, txHash, reset } = usePayInvoice(invoice);

  useEffect(() => {
    if (isSuccess && txHash && address) {
      const updated = markPaid(invoice.id, { txHash, payerAddress: address, paidAt: new Date().toISOString(), blockNumber: 0 });
      if (updated) onSuccess(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  if (!isConnected) {
    return (
      <Card>
        <div className="text-center py-3">
          <p className="text-sm text-text-secondary mb-4">Connect your wallet to pay with USDC on Arc Testnet.</p>
          <Button variant="primary" size="lg" fullWidth isLoading={isConnecting} onClick={() => { const inj = connectors.find((c) => c.id === "injected"); if (inj) connect({ connector: inj }); }}>
            Connect Wallet & Pay
          </Button>
        </div>
      </Card>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <Card className="border-accent-yellow/30">
        <div className="text-center py-4">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-yellow/15">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-accent-yellow"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
          </div>
          <h3 className="font-semibold text-accent-yellow mb-1">Please switch to Arc Testnet before paying</h3>
          <p className="text-xs text-text-secondary mb-4 max-w-xs mx-auto">{switchError || "Your wallet is on the wrong network (Chain ID 5042002 required)."}</p>
          <Button variant="primary" size="lg" fullWidth isLoading={isSwitching} onClick={switchToArcTestnet}>Switch to Arc Testnet</Button>
        </div>
      </Card>
    );
  }

  if (isError && !isSuccess) {
    return (
      <Card className="border-accent-red/30">
        <div className="text-center py-4">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-red/15"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-accent-red"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg></div>
          <h3 className="font-semibold text-accent-red mb-1">Payment Failed</h3>
          <p className="text-xs text-text-secondary mb-4">{error || "An error occurred."}</p>
          <Button variant="secondary" size="md" fullWidth onClick={reset}>Try Again</Button>
        </div>
      </Card>
    );
  }

  if (isConfirming) {
    return (
      <Card glow>
        <div className="text-center py-6">
          <LoadingSpinner size={36} className="mx-auto mb-4" />
          <h3 className="font-semibold text-text-primary mb-1">Confirming Transaction</h3>
          <p className="text-xs text-text-secondary mb-3">Waiting for block confirmation on Arc Testnet...</p>
          {txHash && <p className="font-mono text-xs text-text-muted break-all">{txHash}</p>}
        </div>
      </Card>
    );
  }

  if (isPaying) {
    return (
      <Card>
        <div className="text-center py-6">
          <LoadingSpinner size={36} className="mx-auto mb-4" />
          <h3 className="font-semibold text-text-primary mb-1">Awaiting Approval</h3>
          <p className="text-xs text-text-secondary">Confirm the transaction in your wallet...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="text-center py-2">
        <p className="text-xs text-text-muted mb-4">Connected as <span className="font-mono text-text-secondary">{address?.slice(0, 6)}...{address?.slice(-4)}</span></p>
        <Button variant="primary" size="lg" fullWidth onClick={pay}>Pay {invoice.amount} USDC</Button>
        <p className="text-xs text-text-muted mt-3">ERC-20 USDC transfer on Arc Testnet</p>
      </div>
    </Card>
  );
}
