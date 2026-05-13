import { parseUnits } from "viem";
import { USDC_DECIMALS } from "./constants";

// ─── Amount Conversion ──────────────────────────────────────────────────────

/**
 * Convert a human-readable USDC amount to the uint256 value for ERC-20 transfer.
 * Uses 6 decimals (ERC-20 USDC precision).
 *
 * IMPORTANT: This is for ERC-20 transfers only.
 * Native gas USDC uses 18 decimals — never use this function for gas calculations.
 *
 * @example toUsdcUnits("100.50") → 100500000n
 */
export function toUsdcUnits(humanAmount: string): bigint {
  return parseUnits(humanAmount, USDC_DECIMALS);
}

// ─── Error Mapping ──────────────────────────────────────────────────────────

/**
 * Map blockchain/wallet errors to user-friendly messages.
 */
export function mapTransactionError(error: unknown): string {
  if (!error) return "An unknown error occurred.";

  const message = error instanceof Error ? error.message : String(error);

  // User rejected the transaction in their wallet
  if (
    message.includes("User rejected") ||
    message.includes("user rejected") ||
    message.includes("User denied")
  ) {
    return "Transaction was cancelled.";
  }

  // Insufficient funds / balance
  if (
    message.includes("insufficient funds") ||
    message.includes("exceeds balance") ||
    message.includes("transfer amount exceeds balance")
  ) {
    return "Insufficient USDC balance to complete this payment.";
  }

  // Gas estimation failed (often means the call will revert)
  if (
    message.includes("gas") &&
    message.includes("estimation")
  ) {
    return "Transaction would fail. Please check your USDC balance.";
  }

  // Network / connection errors
  if (
    message.includes("network") ||
    message.includes("disconnected") ||
    message.includes("timeout")
  ) {
    return "Network error. Please check your connection and try again.";
  }

  // Contract execution reverted
  if (message.includes("reverted") || message.includes("revert")) {
    return "Transaction failed on-chain. The transfer may have been rejected.";
  }

  // Fallback
  return "Transaction failed. Please try again.";
}
