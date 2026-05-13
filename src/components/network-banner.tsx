"use client";

import { useAccount } from "wagmi";
import { useNetworkCheck } from "@/hooks/use-network-check";
import { Button } from "@/components/ui/button";

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Warning banner displayed when the connected wallet is on the wrong network.
 * Offers a one-click switch to Arc Testnet.
 */
export function NetworkBanner() {
  const { isConnected } = useAccount();
  const { isCorrectNetwork, switchToArcTestnet, isSwitching, switchError } =
    useNetworkCheck();

  // Don't show banner if not connected or already on correct network
  if (!isConnected || isCorrectNetwork) return null;

  return (
    <div
      className="border-b border-accent-yellow/30 bg-accent-yellow/10 px-4 py-3"
      role="alert"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-accent-yellow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 flex-shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {switchError || "Please switch to Arc Testnet to continue."}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          isLoading={isSwitching}
          onClick={switchToArcTestnet}
        >
          Switch Network
        </Button>
      </div>
    </div>
  );
}
