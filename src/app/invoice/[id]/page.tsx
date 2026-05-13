"use client";

import { use } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useInvoices } from "@/hooks/use-invoices";
import { PageContainer } from "@/components/page-container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/invoice/status-badge";
import { AddressDisplay } from "@/components/invoice/address-display";
import { PaymentLinkSection } from "@/components/invoice/payment-link-section";
import { ReceiptSection } from "@/components/invoice/receipt-section";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = use(params);
  const { isConnected } = useAccount();
  const { getById, isLoading } = useInvoices();

  if (!isConnected) {
    return (
      <PageContainer glow>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-xl font-bold text-text-primary">Connect your wallet</h2>
          <p className="mt-2 text-sm text-text-secondary">Please connect your wallet to view invoice details.</p>
        </div>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (<PageContainer><div className="flex items-center justify-center py-24"><LoadingSpinner size={36} /></div></PageContainer>);
  }

  const invoice = getById(id);

  if (!invoice) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-surface border border-border-default">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-text-muted"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary">Invoice not found</h2>
          <p className="mt-2 text-sm text-text-secondary">This invoice may have been deleted.</p>
          <Link href="/" className="mt-5"><Button variant="secondary" size="md">Back to Dashboard</Button></Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M14 8a.75.75 0 01-.75.75H4.56l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.5a.75.75 0 010-1.06l4.5-4.5a.75.75 0 011.06 1.06L4.56 7.25h8.69A.75.75 0 0114 8z" clipRule="evenodd" /></svg>
          Back to Invoices
        </Link>

        {/* Hero */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 via-transparent to-accent-blue/5 pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-text-primary">{invoice.clientName}</h1>
                <StatusBadge status={invoice.status} />
              </div>
              <p className="text-sm text-text-secondary">{invoice.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold tabular-nums text-gradient">{parseFloat(invoice.amount).toFixed(2)}</p>
              <p className="text-xs font-medium text-text-muted">USDC</p>
            </div>
          </div>
        </Card>

        {/* Details */}
        <Card>
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">Invoice Details</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><dt className="text-text-muted text-xs mb-0.5">Client</dt><dd className="text-text-primary font-medium">{invoice.clientName}</dd></div>
            {invoice.clientEmail && <div><dt className="text-text-muted text-xs mb-0.5">Email</dt><dd className="text-text-primary">{invoice.clientEmail}</dd></div>}
            <div><dt className="text-text-muted text-xs mb-0.5">Recipient</dt><dd><AddressDisplay address={invoice.recipientAddress} /></dd></div>
            <div><dt className="text-text-muted text-xs mb-0.5">Due Date</dt><dd className="text-text-primary">{formatDate(invoice.dueDate)}</dd></div>
            <div><dt className="text-text-muted text-xs mb-0.5">Created</dt><dd className="text-text-secondary">{formatDate(invoice.createdAt)}</dd></div>
          </dl>
        </Card>

        {/* Payment link or Receipt */}
        {invoice.status !== "paid" && <PaymentLinkSection invoiceId={invoice.id} />}
        {invoice.status === "paid" && <ReceiptSection invoice={invoice} />}
      </div>
    </PageContainer>
  );
}
