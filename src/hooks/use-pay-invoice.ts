"use client";

import { useState, useCallback } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import type { Address } from "viem";
import type { Invoice } from "@/types/invoice";
import { USDC_CONTRACT_ADDRESS, USDC_ABI } from "@/lib/constants";
import { toUsdcUnits, mapTransactionError } from "@/lib/blockchain";

// ─── Hook Return Type ───────────────────────────────────────────────────────

interface UsePayInvoiceReturn {
  /** Initiate the USDC payment */
  pay: () => void;
  /** Whether the transaction is being sent (awaiting wallet signature) */
  isPaying: boolean;
  /** Whether the transaction is awaiting block confirmation */
  isConfirming: boolean;
  /** Whether the payment completed successfully */
  isSuccess: boolean;
  /** Whether an error occurred */
  isError: boolean;
  /** User-friendly error message */
  error: string | null;
  /** Transaction hash (available after wallet submits tx) */
  txHash: string | null;
  /** Reset the hook state for retry */
  reset: () => void;
}

// ─── Hook Implementation ────────────────────────────────────────────────────

/**
 * Custom hook to execute a USDC ERC-20 transfer for an invoice payment.
 *
 * Uses 6 decimals for the transfer amount (ERC-20 USDC precision).
 * Waits for 1 block confirmation before reporting success.
 */
export function usePayInvoice(invoice: Invoice): UsePayInvoiceReturn {
  const [userError, setUserError] = useState<string | null>(null);

  const {
    writeContract,
    data: txHash,
    isPending: isPaying,
    isError: isWriteError,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });

  const pay = useCallback(() => {
    setUserError(null);

    try {
      // Convert human amount to 6-decimal ERC-20 units
      const amount = toUsdcUnits(invoice.amount);

      writeContract({
        address: USDC_CONTRACT_ADDRESS as Address,
        abi: USDC_ABI,
        functionName: "transfer",
        args: [invoice.recipientAddress as Address, amount],
      });
    } catch (err) {
      setUserError(mapTransactionError(err));
    }
  }, [invoice.amount, invoice.recipientAddress, writeContract]);

  const reset = useCallback(() => {
    setUserError(null);
    resetWrite();
  }, [resetWrite]);

  // Determine error state
  const isError = isWriteError || isReceiptError || userError !== null;
  const error = userError
    ?? (writeError ? mapTransactionError(writeError) : null)
    ?? (receiptError ? mapTransactionError(receiptError) : null);

  return {
    pay,
    isPaying,
    isConfirming,
    isSuccess,
    isError,
    error,
    txHash: txHash ?? null,
    reset,
  };
}
