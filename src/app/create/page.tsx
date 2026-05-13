"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useInvoices } from "@/hooks/use-invoices";
import { useNetworkCheck } from "@/hooks/use-network-check";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isValidAddress, isValidAmount, formatDate } from "@/lib/utils";

interface FormErrors {
  clientName?: string;
  description?: string;
  amount?: string;
  recipientAddress?: string;
  dueDate?: string;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { isCorrectNetwork, switchToArcTestnet, isSwitching } = useNetworkCheck();
  const { create } = useInvoices();

  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    description: "",
    amount: "",
    recipientAddress: address ?? "",
    dueDate: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Not connected
  if (!isConnected) {
    return (
      <PageContainer glow>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-xl font-bold text-text-primary">Connect your wallet</h2>
          <p className="mt-2 text-sm text-text-secondary">Please connect your wallet to create an invoice.</p>
        </div>
      </PageContainer>
    );
  }

  // Wrong network
  if (!isCorrectNetwork) {
    return (
      <PageContainer glow>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-xl font-bold text-text-primary">Wrong network</h2>
          <p className="mt-2 text-sm text-text-secondary mb-4">Switch to Arc Testnet to create invoices.</p>
          <Button variant="primary" size="md" isLoading={isSwitching} onClick={switchToArcTestnet}>Switch to Arc Testnet</Button>
        </div>
      </PageContainer>
    );
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.clientName.trim()) errs.clientName = "Client name is required.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (!form.amount.trim()) errs.amount = "Amount is required.";
    else if (!isValidAmount(form.amount)) errs.amount = "Enter a valid amount (positive, max 6 decimals).";
    if (!form.recipientAddress.trim()) errs.recipientAddress = "Recipient address is required.";
    else if (!isValidAddress(form.recipientAddress)) errs.recipientAddress = "Enter a valid Ethereum address.";
    if (!form.dueDate) errs.dueDate = "Due date is required.";
    else {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const due = new Date(form.dueDate); due.setHours(0, 0, 0, 0);
      if (due <= today) errs.dueDate = "Due date must be in the future.";
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    const invoiceId = create({
      clientName: form.clientName.trim(),
      clientEmail: form.clientEmail.trim() || undefined,
      description: form.description.trim(),
      amount: form.amount.trim(),
      recipientAddress: form.recipientAddress.trim(),
      dueDate: form.dueDate,
    });
    router.push(`/invoice/${invoiceId}`);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Create Invoice</h1>
        <p className="mt-1 text-sm text-text-secondary">Generate a USDC payment link on Arc Testnet.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Client Name" placeholder="Acme Corp" value={form.clientName} onChange={handleChange("clientName")} error={errors.clientName} required />
                <Input label="Client Email" type="email" placeholder="client@example.com" value={form.clientEmail} onChange={handleChange("clientEmail")} helperText="Optional" />
              </div>
              <Input label="Description" placeholder="Website redesign — Phase 1" value={form.description} onChange={handleChange("description")} error={errors.description} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Amount (USDC)" type="number" placeholder="0.00" step="0.000001" min="0.000001" value={form.amount} onChange={handleChange("amount")} error={errors.amount} helperText="ERC-20 USDC — max 6 decimals" required />
                <Input label="Due Date" type="date" min={minDate} value={form.dueDate} onChange={handleChange("dueDate")} error={errors.dueDate} required />
              </div>
              <Input label="Recipient Wallet" placeholder="0x..." value={form.recipientAddress} onChange={handleChange("recipientAddress")} error={errors.recipientAddress} helperText="The wallet that will receive payment" className="font-mono" required />
              <div className="pt-2">
                <Button type="submit" variant="primary" size="lg" fullWidth>Create Invoice</Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <Card className="border-border-accent/30">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">Live Preview</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted">Client</p>
                  <p className="text-sm font-medium text-text-primary">{form.clientName || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Description</p>
                  <p className="text-sm text-text-secondary">{form.description || "—"}</p>
                </div>
                <div className="pt-2 border-t border-border-default">
                  <p className="text-xs text-text-muted">Amount</p>
                  <p className="text-2xl font-bold text-gradient tabular-nums">
                    {form.amount ? `${parseFloat(form.amount).toFixed(2)}` : "0.00"} <span className="text-sm font-medium text-text-secondary">USDC</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Recipient</p>
                  <p className="text-xs font-mono text-text-secondary truncate">{form.recipientAddress || "—"}</p>
                </div>
                {form.dueDate && (
                  <div>
                    <p className="text-xs text-text-muted">Due Date</p>
                    <p className="text-sm text-text-secondary">{formatDate(form.dueDate)}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
