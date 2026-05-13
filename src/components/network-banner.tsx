"use client";

import { useAccount } from "wagmi";
import { useNetworkCheck } from "@/hooks/use-network-check";
import { Button } from "@/components/ui/button";

export function NetworkBanner() {
  const { isConnected } = useAccount();
  const { isCorrectNetwork, switchToArcTestnet, isSwitching, switchError } =
    useNetworkCheck();

  if (!isConnected || isCorrectNetwork) return null;

  return (
    <div
      className="border-b border-accent-yellow/20 bg-accent-yellow/5 px-4 py-3"
      role="alert"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-sm">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-yellow/15">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-accent-yellow">
              <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 01-1.299 2.25H2.804a1.5 1.5 0 01-1.3-2.25l5.197-9zM8 4a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-accent-yellow font-medium">
            {switchError || "Wrong network — switch to Arc Testnet to continue"}
          </span>
        </div>
        <Button variant="secondary" size="sm" isLoading={isSwitching} onClick={switchToArcTestnet}>
          Switch Network
        </Button>
      </div>
    </div>
  );
}
