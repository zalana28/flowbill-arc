"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useInvoices } from "@/hooks/use-invoices";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InvoiceCard } from "@/components/invoice/invoice-card";
import { EmptyState } from "@/components/invoice/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const { invoices, isLoading } = useInvoices();

  // Not connected
  if (!isConnected) {
    return (
      <PageContainer glow grid>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-green/20 to-accent-cyan/20 border border-accent-green/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-accent-cyan">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-3">FlowBill Arc</h1>
          <p className="text-text-secondary max-w-md text-base leading-relaxed">
            Create invoices, share payment links, and receive USDC payments on Arc Testnet. Connect your wallet to get started.
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
          <LoadingSpinner size={36} />
        </div>
      </PageContainer>
    );
  }

  // Computed stats
  const totalInvoiced = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0);
  const paidInvoices = invoices.filter((inv) => inv.status === "paid");
  const pendingInvoices = invoices.filter((inv) => inv.status !== "paid");
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0);

  return (
    <PageContainer glow>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {invoices.length === 0
              ? "Create your first invoice to start receiving USDC."
              : `Manage your ${invoices.length} invoice${invoices.length !== 1 ? "s" : ""} on Arc Testnet.`}
          </p>
        </div>
        <Link href="/create">
          <Button variant="primary" size="md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4"><path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z" /></svg>
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {invoices.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total Invoiced" value={`$${totalInvoiced.toFixed(2)}`} />
          <StatCard label="Total Paid" value={`$${totalPaid.toFixed(2)}`} accent />
          <StatCard label="Pending" value={String(pendingInvoices.length)} />
          <StatCard label="Paid" value={String(paidInvoices.length)} accent />
        </div>
      )}

      {/* Invoice list */}
      {invoices.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">Recent Invoices</h2>
          {invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}

      {/* Circle Integration */}
      <section className="mt-12 pt-8 border-t border-border-default">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 rounded-full bg-accent-blue/15 flex items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-accent-blue" />
          </div>
          <h2 className="text-sm font-semibold text-text-primary">Circle Integration</h2>
          <span className="text-xs text-text-muted ml-auto">Phase 1 — Wallet-native payments</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Modular Wallets", desc: "Embedded wallets for clients" },
            { label: "Gas Station", desc: "Sponsored gasless transactions" },
            { label: "Paymaster", desc: "Pay gas with USDC" },
            { label: "CCTP", desc: "Cross-chain payments" },
            { label: "Webhooks", desc: "Real-time status updates" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border-default bg-bg-card/50 p-3.5 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-bg-surface flex items-center justify-center flex-shrink-0">
                <span className="h-2 w-2 rounded-full bg-text-muted" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">{item.label}</p>
                <p className="text-[11px] text-text-muted truncate">{item.desc}</p>
              </div>
              <span className="ml-auto text-[10px] font-medium text-text-muted bg-bg-surface rounded-md px-1.5 py-0.5 flex-shrink-0">Soon</span>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card padding="p-4">
      <p className="text-xs font-medium text-text-muted mb-1">{label}</p>
      <p className={["text-xl font-bold tabular-nums", accent ? "text-gradient" : "text-text-primary"].join(" ")}>
        {value}
      </p>
    </Card>
  );
}
