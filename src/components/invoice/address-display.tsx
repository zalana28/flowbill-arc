"use client";

import { useState, useCallback } from "react";
import { truncateAddress } from "@/lib/utils";

// ─── Props ──────────────────────────────────────────────────────────────────

interface AddressDisplayProps {
  /** Full Ethereum address */
  address: string;
  /** Number of characters to show on each side */
  chars?: number;
  /** Whether to show copy button */
  copyable?: boolean;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Displays a truncated Ethereum address with an optional copy-to-clipboard button.
 */
export function AddressDisplay({
  address,
  chars = 4,
  copyable = true,
  className = "",
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — fail silently
    }
  }, [address]);

  return (
    <span
      className={["inline-flex items-center gap-1.5 font-mono text-sm", className].join(
        " "
      )}
    >
      <span className="text-text-secondary" title={address}>
        {truncateAddress(address, chars)}
      </span>

      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          className="text-text-secondary hover:text-text-primary transition-colors"
          title={copied ? "Copied!" : "Copy address"}
          aria-label={copied ? "Address copied" : "Copy address to clipboard"}
        >
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 text-accent-green"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
              <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
            </svg>
          )}
        </button>
      )}
    </span>
  );
}
