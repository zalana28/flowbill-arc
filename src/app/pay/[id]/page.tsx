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
import { AmountDisplay } from "@/components/invoice/amount-display";
import { AddressDisplay } from "@/components/invoice/address-display";
import { StatusBadge } from "@/components/invoice/status-badge";
import { ReceiptSection } from "@/components/invoice/receipt-section";
import { formatDate } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

// ─── Page Props ─────────────────────────────────────────────────────────────

interface PaymentPageProps {
  params: Promise<{ id: string }>;
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function PaymentPage({ params }: PaymentPageProps) {
  const { id } = use(params);
  const { getById, markPaid, isLoading: isLoadingInvoices } = useInvoices();
  const [invoice, setInvoice] = useState<Invoice | undefined>(undefined);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load invoice on mount
  useEffect(() => {
    if (!isLoadingInvoices) {
      setInvoice(getById(id));
      setIsHydrated(true);
    }
  }, [id, getById, isLoadingInvoices]);

  // Hydration loading
  if (!isHydrated) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size={32} />
        </div>
      </PageContainer>
    );
  }

  // Invoice not found
  if (!invoice) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 rounded-full bg-bg-elevated p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-text-secondary"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary">
            Invoice not found
          </h2>
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            This invoice could not be found. The link may be invalid or the
            invoice may have been removed.
          </p>
        </div>
      </PageContainer>
    );
  }

  // Already paid
  if (invoice.status === "paid") {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <div className="text-center py-4">
              <div className="mb-3 inline-flex rounded-full bg-accent-green/15 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 text-accent-green"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-text-primary">
                Invoice Already Paid
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                This invoice has already been paid. See the receipt below.
              </p>
            </div>
          </Card>
          <ReceiptSection invoice={invoice} />
        </div>
      </PageContainer>
    );
  }

  // Active invoice — show payment flow
  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Invoice summary */}
        <Card>
          <div className="text-center mb-6">
            <p className="text-sm text-text-secondary mb-1">Payment Request</p>
            <AmountDisplay amount={invoice.amount} size="lg" />
          </div>

          <dl className="space-y-3 text-sm border-t border-border-default pt-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-secondary">Description</dt>
              <dd className="text-text-primary text-right max-w-[60%] truncate">
                {invoice.description}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-secondary">From</dt>
              <dd className="text-text-primary">{invoice.clientName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-secondary">To</dt>
              <dd>
                <AddressDisplay address={invoice.recipientAddress} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-secondary">Due</dt>
              <dd className="text-text-primary">
                {formatDate(invoice.dueDate)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-secondary">Status</dt>
              <dd>
                <StatusBadge status={invoice.status} />
              </dd>
            </div>
          </dl>
        </Card>

        {/* Payment action */}
        <PaymentAction
          invoice={invoice}
          onPaymentSuccess={(updatedInvoice) => setInvoice(updatedInvoice)}
          markPaid={markPaid}
        />
      </div>
    </PageContainer>
  );
}

// ─── Payment Action Component ───────────────────────────────────────────────

interface PaymentActionProps {
  invoice: Invoice;
  onPaymentSuccess: (invoice: Invoice) => void;
  markPaid: (
    id: string,
    payment: {
      txHash: string;
      payerAddress: string;
      paidAt: string;
      blockNumber: number;
    }
  ) => Invoice | undefined;
}

function PaymentAction({
  invoice,
  onPaymentSuccess,
  markPaid,
}: PaymentActionProps) {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { isCorrectNetwork, switchToArcTestnet, isSwitching, switchError } =
    useNetworkCheck();
  const { pay, isPaying, isConfirming, isSuccess, isError, error, txHash, reset } =
    usePayInvoice(invoice);

  // Handle successful payment — store receipt
  useEffect(() => {
    if (isSuccess && txHash && address) {
      const updatedInvoice = markPaid(invoice.id, {
        txHash,
        payerAddress: address,
        paidAt: new Date().toISOString(),
        blockNumber: 0, // Block number not easily accessible from receipt hook; stored as 0 for MVP
      });
      if (updatedInvoice) {
        onPaymentSuccess(updatedInvoice);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  // ── Not connected ──
  if (!isConnected) {
    return (
      <Card>
        <div className="text-center py-2">
          <h3 className="text-sm font-medium text-text-primary mb-2">
            Connect Wallet to Pay
          </h3>
          <p className="text-xs text-text-secondary mb-4">
            Connect your wallet to pay this invoice with USDC on Arc Testnet.
          </p>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isConnecting}
            onClick={() => {
              const injected = connectors.find((c) => c.id === "injected");
              if (injected) {
                connect({ connector: injected });
              }
            }}
          >
            Connect Wallet & Pay
          </Button>
        </div>
      </Card>
    );
  }

  // ── Wrong network ──
  if (!isCorrectNetwork) {
    return (
      <Card className="border-accent-yellow/30">
        <div className="text-center py-4">
          <div className="mb-3 inline-flex rounded-full bg-accent-yellow/15 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-accent-yellow"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.499-2.599 4.499H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-accent-yellow mb-2">
            Please switch to Arc Testnet before paying
          </h3>
          <p className="text-sm text-text-secondary mb-5 max-w-xs mx-auto">
            {switchError ||
              "Your wallet is connected to the wrong network. Switch to Arc Testnet (Chain ID 5042002) to complete this payment."}
          </p>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSwitching}
            onClick={switchToArcTestnet}
          >
            Switch to Arc Testnet
          </Button>
          <p className="text-xs text-text-secondary mt-3">
            This will prompt your wallet to switch or add the Arc Testnet
            network.
          </p>
        </div>
      </Card>
    );
  }

  // ── Error state ──
  if (isError && !isSuccess) {
    return (
      <Card className="border-accent-red/30">
        <div className="text-center py-2">
          <div className="mb-3 inline-flex rounded-full bg-accent-red/15 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-accent-red"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-accent-red mb-1">
            Payment Failed
          </h3>
          <p className="text-xs text-text-secondary mb-4">
            {error || "An error occurred. Please try again."}
          </p>
          <Button variant="primary" size="lg" fullWidth onClick={reset}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  // ── Confirming state ──
  if (isConfirming) {
    return (
      <Card>
        <div className="text-center py-4">
          <LoadingSpinner size={32} className="mx-auto mb-3" />
          <h3 className="text-sm font-medium text-text-primary mb-1">
            Confirming Transaction
          </h3>
          <p className="text-xs text-text-secondary mb-3">
            Waiting for block confirmation on Arc Testnet...
          </p>
          {txHash && (
            <p className="font-mono text-xs text-text-secondary break-all">
              Tx: {txHash}
            </p>
          )}
        </div>
      </Card>
    );
  }

  // ── Pending / sending state ──
  if (isPaying) {
    return (
      <Card>
        <div className="text-center py-4">
          <LoadingSpinner size={32} className="mx-auto mb-3" />
          <h3 className="text-sm font-medium text-text-primary mb-1">
            Awaiting Approval
          </h3>
          <p className="text-xs text-text-secondary">
            Please confirm the transaction in your wallet...
          </p>
        </div>
      </Card>
    );
  }

  // ── Ready to pay ──
  return (
    <Card>
      <div className="text-center py-2">
        <p className="text-xs text-text-secondary mb-4">
          Connected as{" "}
          <span className="font-mono text-text-primary">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </p>
        <Button variant="primary" size="lg" fullWidth onClick={pay}>
          Pay {invoice.amount} USDC
        </Button>
        <p className="text-xs text-text-secondary mt-3">
          Payment will be sent via USDC ERC-20 transfer on Arc Testnet.
        </p>
      </div>
    </Card>
  );
}
