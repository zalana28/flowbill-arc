"use client";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useInvoices } from "@/hooks/use-invoices";
import { useNetworkCheck } from "@/hooks/use-network-check";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import {
  InvoiceForm,
  type InvoiceFormData,
} from "@/components/invoice/invoice-form";

export default function CreateInvoicePage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { isCorrectNetwork, switchToArcTestnet, isSwitching } =
    useNetworkCheck();
  const { create } = useInvoices();

  // Not connected
  if (!isConnected) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-xl font-semibold text-text-primary">
            Connect your wallet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            Please connect your wallet to create an invoice.
          </p>
        </div>
      </PageContainer>
    );
  }

  // Wrong network
  if (!isCorrectNetwork) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-xl font-semibold text-text-primary">
            Wrong network
          </h2>
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            Switch to Arc Testnet to create invoices.
          </p>
          <div className="mt-4">
            <Button
              variant="primary"
              size="md"
              isLoading={isSwitching}
              onClick={switchToArcTestnet}
            >
              Switch to Arc Testnet
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const handleSubmit = (data: InvoiceFormData) => {
    const invoiceId = create({
      clientName: data.clientName.trim(),
      clientEmail: data.clientEmail.trim() || undefined,
      description: data.description.trim(),
      amount: data.amount.trim(),
      recipientAddress: data.recipientAddress.trim(),
      dueDate: data.dueDate,
    });
    router.push(`/invoice/${invoiceId}`);
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">
            Create Invoice
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Fill in the details below to generate a USDC payment link on Arc
            Testnet.
          </p>
        </div>

        {/* Form */}
        <InvoiceForm onSubmit={handleSubmit} />
      </div>
    </PageContainer>
  );
}
