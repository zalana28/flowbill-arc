import { EXPLORER_BASE_URL } from "./constants";

// ─── UUID Generation ────────────────────────────────────────────────────────

/**
 * Generate a UUID v4 string.
 * Uses crypto.randomUUID where available, falls back to manual generation.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Address Formatting ─────────────────────────────────────────────────────

/**
 * Truncate an Ethereum address for display.
 * Example: "0x1234...abcd"
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Validate that a string is a valid Ethereum address (0x + 40 hex chars).
 */
export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

// ─── Amount Formatting ──────────────────────────────────────────────────────

/**
 * Format an amount string with USDC symbol.
 * Example: "150.50" → "150.50 USDC"
 */
export function formatUsdcAmount(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return "0.00 USDC";

  // Display up to 6 decimals, trim trailing zeros
  const formatted = num.toFixed(6).replace(/\.?0+$/, "");
  return `${formatted || "0"} USDC`;
}

/**
 * Validate that an amount string is a valid USDC value.
 * Must be a positive number with at most 6 decimal places.
 */
export function isValidAmount(amount: string): boolean {
  if (!amount || amount.trim() === "") return false;
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return false;
  // Check max 6 decimal places
  const parts = amount.split(".");
  if (parts.length > 2) return false;
  if (parts[1] && parts[1].length > 6) return false;
  return true;
}

// ─── Explorer URL Builders ──────────────────────────────────────────────────

/**
 * Build an explorer URL for a transaction hash.
 */
export function getExplorerTxUrl(txHash: string): string {
  return `${EXPLORER_BASE_URL}/tx/${txHash}`;
}

/**
 * Build an explorer URL for an address.
 */
export function getExplorerAddressUrl(address: string): string {
  return `${EXPLORER_BASE_URL}/address/${address}`;
}

// ─── Date Formatting ────────────────────────────────────────────────────────

/**
 * Format an ISO date string to a human-readable local date.
 * Example: "2025-03-15" → "Mar 15, 2025"
 */
export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

/**
 * Format an ISO timestamp to a human-readable local date and time.
 * Example: "2025-03-15T10:30:00Z" → "Mar 15, 2025, 10:30 AM"
 */
export function formatDateTime(isoTimestamp: string): string {
  try {
    const date = new Date(isoTimestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return isoTimestamp;
  }
}

/**
 * Check if a date string is in the past (compared to today, date-only).
 */
export function isDatePast(dateStr: string): boolean {
  const now = new Date();
  const target = new Date(dateStr);
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return target < now;
}

/**
 * Check if a date string is in the future (compared to today, date-only).
 */
export function isDateFuture(dateStr: string): boolean {
  const now = new Date();
  const target = new Date(dateStr);
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return target > now;
}

// ─── Payment Link ───────────────────────────────────────────────────────────

/**
 * Generate the payment link path for an invoice.
 * Returns a relative URL path.
 */
export function getPaymentLinkPath(invoiceId: string): string {
  return `/pay/${invoiceId}`;
}

/**
 * Generate the full payment link URL for an invoice.
 * Requires the current origin (window.location.origin).
 */
export function getPaymentLinkUrl(invoiceId: string, origin: string): string {
  return `${origin}/pay/${invoiceId}`;
}
