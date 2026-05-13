"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/utils";

export function WalletButton() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        title={address}
        aria-label={`Disconnect wallet ${address}`}
        className="flex items-center gap-2 h-9 px-3 rounded-xl border border-border-default bg-bg-surface text-sm font-medium text-text-primary hover:border-border-accent hover:bg-bg-hover transition-all duration-200"
      >
        <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
        <span className="font-mono text-xs">{truncateAddress(address)}</span>
      </button>
    );
  }

  return (
    <Button
      variant="primary"
      size="sm"
      isLoading={isConnecting}
      onClick={() => {
        const injected = connectors.find((c) => c.id === "injected");
        if (injected) {
          connect({ connector: injected });
        }
      }}
    >
      Connect Wallet
    </Button>
  );
}
