"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useInvoices } from "@/hooks/use-invoices";
import { getEventCounts } from "@/lib/analytics";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InvoiceCard } from "@/components/invoice/invoice-card";
import { EmptyState } from "@/components/invoice/empty-state";
import { StatsRowSkeleton, InvoiceListSkeleton } from "@/components/ui/skeleton";
import { PageTransition, StaggerList, StaggerItem } from "@/components/ui/motion";

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const { invoices, isLoading } = useInvoices();

  // Not connected — premium hero
  if (!isConnected) {
    return (
      <PageContainer glow grid>
        <div className="flex flex-col items-center justify-center py-20 sm:py-28 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-accent-green/20 to-accent-cyan/10 border border-accent-green/20 shadow-lg shadow-accent-green/5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-9 w-9 text-accent-cyan">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-3">FlowBill Arc</h1>
          <p className="text-text-secondary max-w-lg text-base sm:text-lg leading-relaxed mb-2">
            Wallet-native USDC invoicing for freelancers and global builders.
          </p>
          <p className="text-text-muted text-sm max-w-md">
            Create invoices, share checkout links, and receive instant payments on Arc Testnet.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {["USDC Payments", "Arc Testnet", "Instant Settlement", "No Backend", "Open Source"].map((f) => (
              <span key={f} className="rounded-full border border-border-default bg-bg-card/60 px-3 py-1 text-xs font-medium text-text-secondary">
                {f}
              </span>
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  // Loading — skeleton
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="h-8 w-40 rounded-lg bg-bg-surface animate-shimmer" />
            <div className="h-4 w-56 mt-2 rounded-lg bg-bg-surface animate-shimmer" />
          </div>
          <div className="h-10 w-36 rounded-xl bg-bg-surface animate-shimmer" />
        </div>
        <StatsRowSkeleton />
        <div className="mt-8">
          <InvoiceListSkeleton count={3} />
        </div>
      </PageContainer>
    );
  }

  // Computed stats
  const totalInvoiced = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0);
  const paidInvoices = invoices.filter((inv) => inv.status === "paid");
  const pendingInvoices = invoices.filter((inv) => inv.status !== "paid");
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0);
  const analytics = getEventCounts();

  return (
    <PageContainer glow>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {invoices.length === 0
              ? "Create your first invoice to start receiving USDC."
              : `Manage ${invoices.length} invoice${invoices.length !== 1 ? "s" : ""} on Arc Testnet.`}
          </p>
        </div>
        <Link href="/create">
          <Button variant="primary" size="md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4"><path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z" /></svg>
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Merchant Branding */}
      <Card padding="p-5" className="mb-6 border-border-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-green/5 via-transparent to-accent-cyan/5 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-green to-accent-cyan shadow-lg shadow-accent-green/20 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="h-5 w-5">
              <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">Your Merchant Checkout</p>
            <p className="text-xs text-text-secondary mt-0.5">Share payment links with clients for instant USDC settlement on Arc Testnet. No sign-up required for payers.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/10 border border-accent-green/20 px-2.5 py-1 text-[11px] font-medium text-accent-green">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
              Live on Arc Testnet
            </span>
          </div>
        </div>
      </Card>

      {/* Stats */}
      {invoices.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total Invoiced" value={`${totalInvoiced.toFixed(2)}`} unit="USDC" />
          <StatCard label="Total Received" value={`${totalPaid.toFixed(2)}`} unit="USDC" accent />
          <StatCard label="Pending" value={String(pendingInvoices.length)} unit="invoices" />
          <StatCard label="Completed" value={String(paidInvoices.length)} unit="payments" accent />
        </div>
      )}

      {/* Invoice list */}
      {invoices.length === 0 ? (
        <EmptyState />
      ) : (
        <StaggerList className="space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Recent Invoices</h2>
            {invoices.length > 3 && (
              <Link href="/history" className="text-xs font-medium text-accent-cyan hover:underline">View All</Link>
            )}
          </div>
          {invoices.slice(0, 5).map((invoice) => (
            <StaggerItem key={invoice.id}>
              <InvoiceCard invoice={invoice} />
            </StaggerItem>
          ))}
        </StaggerList>
      )}

      {/* Analytics + Checkout Cards */}
      {invoices.length > 0 && (
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Analytics snapshot */}
          <Card>
            <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">Activity</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold tabular-nums text-text-primary">{analytics.invoice_created || 0}</p>
                <p className="text-[11px] text-text-muted mt-0.5">Invoices Created</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold tabular-nums text-accent-cyan">{analytics.payment_link_opened || 0}</p>
                <p className="text-[11px] text-text-muted mt-0.5">Links Opened</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold tabular-nums text-accent-green">{analytics.payment_success || 0}</p>
                <p className="text-[11px] text-text-muted mt-0.5">Payments</p>
              </div>
            </div>
          </Card>

          {/* Checkout product card */}
          <Card className="border-border-accent/20">
            <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Quick Checkout</h3>
            <p className="text-sm text-text-secondary mb-4">Generate payment links instantly. Clients pay with one click — no wallet setup needed for viewing.</p>
            <Link href="/create">
              <Button variant="primary" size="sm" fullWidth>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z" /></svg>
                New Payment Link
              </Button>
            </Link>
          </Card>
        </section>
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
            { label: "Modular Wallets", desc: "Embedded wallets for clients", icon: "wallet" },
            { label: "Gas Station", desc: "Sponsored gasless transactions", icon: "gas" },
            { label: "Paymaster", desc: "Pay gas with USDC", icon: "dollar" },
            { label: "CCTP", desc: "Cross-chain payments", icon: "globe" },
            { label: "Webhooks", desc: "Real-time status updates", icon: "bell" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border-default bg-bg-card/50 p-3.5 flex items-center gap-3 hover:border-border-accent/30 transition-colors">
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

function StatCard({ label, value, unit, accent }: { label: string; value: string; unit: string; accent?: boolean }) {
  return (
    <Card padding="p-4">
      <p className="text-xs font-medium text-text-muted mb-1">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <p className={["text-xl font-bold tabular-nums", accent ? "text-gradient" : "text-text-primary"].join(" ")}>
          {value}
        </p>
        <span className="text-[11px] text-text-muted">{unit}</span>
      </div>
    </Card>
  );
}
