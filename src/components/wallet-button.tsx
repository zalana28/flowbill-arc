"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/utils";

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Wallet connect/disconnect button.
 * Shows truncated address when connected, "Connect Wallet" otherwise.
 */
export function WalletButton() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => disconnect()}
        title={address}
        aria-label={`Disconnect wallet ${address}`}
      >
        <span className="font-mono text-xs">{truncateAddress(address)}</span>
      </Button>
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
