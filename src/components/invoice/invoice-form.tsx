"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useAccount } from "wagmi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { isValidAddress, isValidAmount } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface InvoiceFormData {
  clientName: string;
  clientEmail: string;
  description: string;
  amount: string;
  recipientAddress: string;
  dueDate: string;
}

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => void;
  isSubmitting?: boolean;
}

interface FormErrors {
  clientName?: string;
  description?: string;
  amount?: string;
  recipientAddress?: string;
  dueDate?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function InvoiceForm({ onSubmit, isSubmitting = false }: InvoiceFormProps) {
  const { address } = useAccount();

  const [formData, setFormData] = useState<InvoiceFormData>({
    clientName: "",
    clientEmail: "",
    description: "",
    amount: "",
    recipientAddress: address ?? "",
    dueDate: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // ── Validation ──

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};

    if (!formData.clientName.trim()) {
      errs.clientName = "Client name is required.";
    }

    if (!formData.description.trim()) {
      errs.description = "Description is required.";
    }

    if (!formData.amount.trim()) {
      errs.amount = "Amount is required.";
    } else if (!isValidAmount(formData.amount)) {
      errs.amount = "Enter a valid amount (positive, max 6 decimals).";
    }

    if (!formData.recipientAddress.trim()) {
      errs.recipientAddress = "Recipient address is required.";
    } else if (!isValidAddress(formData.recipientAddress)) {
      errs.recipientAddress = "Enter a valid Ethereum address (0x...).";
    }

    if (!formData.dueDate) {
      errs.dueDate = "Due date is required.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(formData.dueDate);
      due.setHours(0, 0, 0, 0);
      if (due <= today) {
        errs.dueDate = "Due date must be in the future.";
      }
    }

    return errs;
  }, [formData]);

  // ── Handlers ──

  const handleChange = useCallback(
    (field: keyof InvoiceFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear error for this field on change
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      },
    []
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      onSubmit(formData);
    },
    [formData, validate, onSubmit]
  );

  // ── Computed ──

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Client Name */}
        <Input
          label="Client Name"
          placeholder="Acme Corp"
          value={formData.clientName}
          onChange={handleChange("clientName")}
          error={errors.clientName}
          required
        />

        {/* Client Email (optional) */}
        <Input
          label="Client Email"
          type="email"
          placeholder="client@example.com (optional)"
          value={formData.clientEmail}
          onChange={handleChange("clientEmail")}
          helperText="Optional — for your reference only."
        />

        {/* Description */}
        <Input
          label="Description"
          placeholder="Website redesign — Phase 1"
          value={formData.description}
          onChange={handleChange("description")}
          error={errors.description}
          required
        />

        {/* Amount */}
        <Input
          label="Amount (USDC)"
          type="number"
          placeholder="0.00"
          step="0.000001"
          min="0.000001"
          value={formData.amount}
          onChange={handleChange("amount")}
          error={errors.amount}
          helperText="ERC-20 USDC — max 6 decimal places."
          required
        />

        {/* Recipient Address */}
        <Input
          label="Recipient Wallet Address"
          placeholder="0x..."
          value={formData.recipientAddress}
          onChange={handleChange("recipientAddress")}
          error={errors.recipientAddress}
          helperText="The wallet that will receive the USDC payment."
          className="font-mono"
          required
        />

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          min={minDate}
          value={formData.dueDate}
          onChange={handleChange("dueDate")}
          error={errors.dueDate}
          required
        />

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
          >
            Create Invoice
          </Button>
        </div>
      </form>
    </Card>
  );
}
