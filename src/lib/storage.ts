import { STORAGE_KEY, STORAGE_VERSION } from "./constants";
import type { Invoice, StorageSchema } from "@/types/invoice";

// ─── Storage Helpers ────────────────────────────────────────────────────────

/**
 * Check whether localStorage is available in the current environment.
 */
function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const testKey = "__flowbill_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read the full storage schema from localStorage.
 * Returns a default empty schema if missing or corrupted.
 */
function readSchema(): StorageSchema {
  if (!isStorageAvailable()) {
    return { invoices: [], version: STORAGE_VERSION };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { invoices: [], version: STORAGE_VERSION };
    }
    const parsed: unknown = JSON.parse(raw);

    // Basic shape validation
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "invoices" in parsed &&
      Array.isArray((parsed as StorageSchema).invoices)
    ) {
      return parsed as StorageSchema;
    }

    // Corrupted shape — reset
    return { invoices: [], version: STORAGE_VERSION };
  } catch {
    // JSON parse error — reset
    return { invoices: [], version: STORAGE_VERSION };
  }
}

/**
 * Write the full storage schema to localStorage.
 */
function writeSchema(schema: StorageSchema): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
  } catch {
    // Storage full or write error — silently fail for MVP
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Get all invoices from storage.
 */
export function getAllInvoices(): Invoice[] {
  return readSchema().invoices;
}

/**
 * Get a single invoice by ID.
 * Returns undefined if not found.
 */
export function getInvoiceById(id: string): Invoice | undefined {
  const schema = readSchema();
  return schema.invoices.find((inv) => inv.id === id);
}

/**
 * Save a new invoice to storage.
 */
export function saveInvoice(invoice: Invoice): void {
  const schema = readSchema();
  schema.invoices.push(invoice);
  writeSchema(schema);
}

/**
 * Update an existing invoice by ID.
 * Merges the partial fields and updates the `updatedAt` timestamp.
 */
export function updateInvoice(
  id: string,
  updates: Partial<Invoice>
): Invoice | undefined {
  const schema = readSchema();
  const index = schema.invoices.findIndex((inv) => inv.id === id);
  if (index === -1) return undefined;

  schema.invoices[index] = {
    ...schema.invoices[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeSchema(schema);
  return schema.invoices[index];
}

/**
 * Delete an invoice by ID.
 * Returns true if the invoice was found and removed.
 */
export function deleteInvoice(id: string): boolean {
  const schema = readSchema();
  const initialLength = schema.invoices.length;
  schema.invoices = schema.invoices.filter((inv) => inv.id !== id);
  if (schema.invoices.length === initialLength) return false;
  writeSchema(schema);
  return true;
}

/**
 * Check if localStorage is available for use.
 */
export function checkStorageAvailable(): boolean {
  return isStorageAvailable();
}
