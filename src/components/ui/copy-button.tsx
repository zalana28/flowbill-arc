"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Reusable copy-to-clipboard button with success feedback.
 */
export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  size = "sm",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard unavailable
    }
  }, [text]);

  return (
    <Button
      variant="secondary"
      size={size}
      onClick={handleCopy}
      className={className}
      aria-label={copied ? copiedLabel : `${label} to clipboard`}
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-accent-green">
            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
          </svg>
          {copiedLabel}
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M5.5 3.5A1.5 1.5 0 017 2h5.5a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 0112.5 12H7a1.5 1.5 0 01-1.5-1.5v-7z" />
            <path d="M3 5.5A1.5 1.5 0 014.5 4H5v7.5A2.5 2.5 0 007.5 14H11v.5a1.5 1.5 0 01-1.5 1.5h-6A1.5 1.5 0 012 14.5v-7.5A1.5 1.5 0 013 5.5z" />
          </svg>
          {label}
        </>
      )}
    </Button>
  );
}
