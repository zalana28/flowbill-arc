// ─── Invoice Status ─────────────────────────────────────────────────────────

export type InvoiceStatus = "pending" | "paid" | "overdue";

// ─── Payment Record ─────────────────────────────────────────────────────────

/**
 * Attached to an Invoice after a successful on-chain payment.
 */
export interface PaymentRecord {
  /** Transaction hash on Arc Testnet */
  txHash: string;
  /** Wallet address that submitted the payment */
  payerAddress: string;
  /** ISO 8601 timestamp when payment was confirmed */
  paidAt: string;
  /** Block number where the transaction was confirmed */
  blockNumber: number;
}

// ─── Invoice ────────────────────────────────────────────────────────────────

export interface Invoice {
  /** Unique identifier (UUID v4) */
  id: string;
  /** Current invoice status */
  status: InvoiceStatus;
  /** ISO 8601 timestamp of creation */
  createdAt: string;
  /** ISO 8601 timestamp of last update */
  updatedAt: string;

  // ── Invoice Details ──

  /** Client's display name */
  clientName: string;
  /** Client's email address (optional) */
  clientEmail?: string;
  /** Description of work or services */
  description: string;
  /**
   * Invoice amount in USDC as a string to preserve decimal precision.
   * Example: "150.50"
   * Maximum 6 decimal places (ERC-20 USDC precision).
   */
  amount: string;
  /** Recipient wallet address (0x... Ethereum address) */
  recipientAddress: string;
  /** Due date in ISO 8601 date format (YYYY-MM-DD) */
  dueDate: string;

  // ── Payment Details (populated after payment) ──

  /** Payment record, present only when status is "paid" */
  payment?: PaymentRecord;
}

// ─── Storage Schema ─────────────────────────────────────────────────────────

/**
 * Top-level shape of the localStorage data.
 * Versioned for future migration support.
 */
export interface StorageSchema {
  /** Array of all invoices */
  invoices: Invoice[];
  /** Schema version number for future migrations */
  version: number;
}
