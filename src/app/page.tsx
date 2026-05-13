"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useInvoices } from "@/hooks/use-invoices";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { InvoiceCard } from "@/components/invoice/invoice-card";
import { EmptyState } from "@/components/invoice/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const { invoices, isLoading } = useInvoices();

  // Not connected — show connect prompt
  if (!isConnected) {
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
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary">
            Connect your wallet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            Connect your wallet to create invoices, share payment links, and
            track payments on Arc Testnet.
          </p>
        </div>
      </PageContainer>
    );
  }

  // Loading state (SSR hydration guard)
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size={32} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Invoices</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {invoices.length === 0
              ? "Create your first invoice to get started."
              : `${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/create">
          <Button variant="primary" size="md">
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Invoice list or empty state */}
      {invoices.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}

      {/* Circle Integration Status */}
      <section className="mt-12 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Circle Integration
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          Phase 1 uses wallet-native Arc Testnet payments. No Circle API key is
          required.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <IntegrationItem
            label="Modular Wallets"
            description="Embedded wallets for non-crypto-native clients"
            status="planned"
          />
          <IntegrationItem
            label="Gas Station"
            description="Sponsored transactions for gasless payments"
            status="planned"
          />
          <IntegrationItem
            label="Paymaster"
            description="Pay gas fees with USDC"
            status="planned"
          />
          <IntegrationItem
            label="CCTP"
            description="Cross-chain USDC invoice payments"
            status="planned"
          />
          <IntegrationItem
            label="Webhooks"
            description="Real-time payment status notifications"
            status="planned"
          />
        </div>
      </section>
    </PageContainer>
  );
}

// ─── Integration Item ───────────────────────────────────────────────────────

function IntegrationItem({
  label,
  description,
  status,
}: {
  label: string;
  description: string;
  status: "active" | "planned";
}) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-card p-4">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        <span
          className={[
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            status === "active"
              ? "bg-accent-green/15 text-accent-green"
              : "bg-bg-elevated text-text-secondary",
          ].join(" ")}
        >
          {status === "active" ? "Active" : "Planned"}
        </span>
      </div>
      <p className="text-xs text-text-secondary">{description}</p>
    </div>
  );
}
