"use client";

import { use } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useInvoices } from "@/hooks/use-invoices";
import { PageContainer } from "@/components/page-container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/invoice/status-badge";
import { AmountDisplay } from "@/components/invoice/amount-display";
import { AddressDisplay } from "@/components/invoice/address-display";
import { PaymentLinkSection } from "@/components/invoice/payment-link-section";
import { ReceiptSection } from "@/components/invoice/receipt-section";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils";

// ─── Page Props ─────────────────────────────────────────────────────────────

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = use(params);
  const { isConnected } = useAccount();
  const { getById, isLoading } = useInvoices();

  // Not connected
  if (!isConnected) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-xl font-semibold text-text-primary">
            Connect your wallet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            Please connect your wallet to view invoice details.
          </p>
        </div>
      </PageContainer>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size={32} />
        </div>
      </PageContainer>
    );
  }

  const invoice = getById(id);

  // Not found
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
            This invoice could not be found. It may have been deleted.
          </p>
          <Link href="/" className="mt-6">
            <Button variant="secondary" size="md">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Back to Invoices
        </Link>

        {/* Invoice header */}
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-text-primary">
                  {invoice.clientName}
                </h1>
                <StatusBadge status={invoice.status} />
              </div>
              <p className="mt-1 text-sm text-text-secondary">
                {invoice.description}
              </p>
            </div>
            <AmountDisplay amount={invoice.amount} size="lg" />
          </div>
        </Card>

        {/* Invoice details */}
        <Card>
          <h3 className="text-sm font-medium text-text-primary mb-4">
            Details
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-secondary">Client</dt>
              <dd className="text-text-primary">{invoice.clientName}</dd>
            </div>
            {invoice.clientEmail && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-text-secondary">Email</dt>
                <dd className="text-text-primary">{invoice.clientEmail}</dd>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-secondary">Recipient</dt>
              <dd>
                <AddressDisplay address={invoice.recipientAddress} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-secondary">Due Date</dt>
              <dd className="text-text-primary">
                {formatDate(invoice.dueDate)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-secondary">Created</dt>
              <dd className="text-text-primary">
                {formatDate(invoice.createdAt)}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Payment link (only for unpaid invoices) */}
        {invoice.status !== "paid" && (
          <PaymentLinkSection invoiceId={invoice.id} />
        )}

        {/* Receipt (only for paid invoices) */}
        {invoice.status === "paid" && <ReceiptSection invoice={invoice} />}
      </div>
    </PageContainer>
  );
}
