"use client";

import { useState, useEffect, useCallback } from "react";
import type { Invoice, PaymentRecord } from "@/types/invoice";
import {
  getAllInvoices,
  getInvoiceById,
  saveInvoice,
  updateInvoice,
  deleteInvoice,
} from "@/lib/storage";
import { generateId } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

// ─── Overdue Detection ──────────────────────────────────────────────────────

/**
 * Compute the display status for an invoice.
 * Overdue is determined at render time — not stored.
 */
function getDisplayStatus(invoice: Invoice): Invoice {
  if (invoice.status === "paid") return invoice;
  const now = new Date();
  const due = new Date(invoice.dueDate);
  // Compare dates only (ignore time)
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  if (due < now) {
    return { ...invoice, status: "overdue" };
  }
  return invoice;
}

// ─── Hook Return Type ───────────────────────────────────────────────────────

interface UseInvoicesReturn {
  /** All invoices with computed overdue status */
  invoices: Invoice[];
  /** Whether invoices are still loading (SSR hydration guard) */
  isLoading: boolean;
  /** Get a single invoice by ID (with computed status) */
  getById: (id: string) => Invoice | undefined;
  /** Create a new invoice and return its ID */
  create: (
    data: Omit<Invoice, "id" | "status" | "createdAt" | "updatedAt" | "payment">
  ) => string;
  /** Update an existing invoice */
  update: (id: string, updates: Partial<Invoice>) => Invoice | undefined;
  /** Mark an invoice as paid with payment details */
  markPaid: (id: string, payment: PaymentRecord) => Invoice | undefined;
  /** Delete an invoice by ID */
  remove: (id: string) => boolean;
  /** Refresh invoices from storage */
  refresh: () => void;
}

// ─── Hook Implementation ────────────────────────────────────────────────────

/**
 * Custom hook for managing invoices via localStorage.
 * Guards against SSR hydration mismatch by loading on mount only.
 */
export function useInvoices(): UseInvoicesReturn {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load invoices on mount (client-side only)
  const refresh = useCallback(() => {
    const raw = getAllInvoices();
    const withStatus = raw.map(getDisplayStatus);
    setInvoices(withStatus);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getById = useCallback(
    (id: string): Invoice | undefined => {
      const invoice = getInvoiceById(id);
      if (!invoice) return undefined;
      return getDisplayStatus(invoice);
    },
    []
  );

  const create = useCallback(
    (
      data: Omit<Invoice, "id" | "status" | "createdAt" | "updatedAt" | "payment">
    ): string => {
      const now = new Date().toISOString();
      const invoice: Invoice = {
        ...data,
        id: generateId(),
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };
      saveInvoice(invoice);
      trackEvent("invoice_created", { amount: data.amount, clientName: data.clientName });
      refresh();
      return invoice.id;
    },
    [refresh]
  );

  const update = useCallback(
    (id: string, updates: Partial<Invoice>): Invoice | undefined => {
      const result = updateInvoice(id, updates);
      if (result) refresh();
      return result ? getDisplayStatus(result) : undefined;
    },
    [refresh]
  );

  const markPaid = useCallback(
    (id: string, payment: PaymentRecord): Invoice | undefined => {
      const result = updateInvoice(id, {
        status: "paid",
        payment,
      });
      if (result) refresh();
      return result;
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string): boolean => {
      const success = deleteInvoice(id);
      if (success) refresh();
      return success;
    },
    [refresh]
  );

  return {
    invoices,
    isLoading,
    getById,
    create,
    update,
    markPaid,
    remove,
    refresh,
  };
}
