"use client";

import { useState, useCallback } from "react";
import { truncateAddress } from "@/lib/utils";

interface AddressDisplayProps { address: string; chars?: number; copyable?: boolean; className?: string; }

export function AddressDisplay({ address, chars = 4, copyable = true, className = "" }: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* noop */ }
  }, [address]);

  return (
    <span className={["inline-flex items-center gap-1.5 font-mono text-xs", className].join(" ")}>
      <span className="text-text-secondary" title={address}>{truncateAddress(address, chars)}</span>
      {copyable && (
        <button type="button" onClick={handleCopy} className="text-text-muted hover:text-accent-cyan transition-colors" title={copied ? "Copied!" : "Copy address"} aria-label={copied ? "Address copied" : "Copy address"}>
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 text-accent-green"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3"><path d="M5.5 3.5A1.5 1.5 0 017 2h5.5a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 0112.5 12H7a1.5 1.5 0 01-1.5-1.5v-7z" /><path d="M3 5.5A1.5 1.5 0 014.5 4H5v7.5A2.5 2.5 0 007.5 14H11v.5a1.5 1.5 0 01-1.5 1.5h-6A1.5 1.5 0 012 14.5v-7.5A1.5 1.5 0 013 5.5z" /></svg>
          )}
        </button>
      )}
    </span>
  );
}
