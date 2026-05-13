"use client";

import Link from "next/link";
import { WalletButton } from "@/components/wallet-button";

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Application header with logo, navigation, and wallet button.
 */
export function Header() {
  return (
    <header className="border-b border-border-default bg-bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-text-primary hover:opacity-90 transition-opacity"
        >
          <span className="text-lg font-bold tracking-tight">FlowBill</span>
          <span className="rounded-md bg-accent-blue/15 px-1.5 py-0.5 text-xs font-medium text-accent-blue">
            Arc
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/create"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Create Invoice
          </Link>
        </nav>

        {/* Wallet */}
        <WalletButton />
      </div>
    </header>
  );
}
