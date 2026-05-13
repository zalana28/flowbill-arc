"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "@/components/wallet-button";

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/create", label: "Create Invoice" },
    { href: "/history", label: "History" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border-default glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-green to-accent-cyan">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="h-4 w-4">
              <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-lg font-bold text-text-primary group-hover:text-gradient transition-all duration-300">
            FlowBill
          </span>
          <span className="rounded-md bg-accent-cyan/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-cyan border border-accent-cyan/20">
            Arc
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-bg-surface text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-surface/50",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Wallet */}
        <WalletButton />
      </div>
    </header>
  );
}
