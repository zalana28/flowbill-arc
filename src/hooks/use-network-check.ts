"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useCallback, useMemo } from "react";
import { ARC_TESTNET_CHAIN_ID, arcTestnet } from "@/lib/constants";

// ─── Hook Return Type ───────────────────────────────────────────────────────

interface UseNetworkCheckReturn {
  /** Whether the connected wallet is on Arc Testnet */
  isCorrectNetwork: boolean;
  /** Whether the wallet is currently connected */
  isConnected: boolean;
  /** Trigger a chain switch to Arc Testnet */
  switchToArcTestnet: () => void;
  /** Whether a network switch is in progress */
  isSwitching: boolean;
  /** Error message if the switch failed */
  switchError: string | null;
}

// ─── Hook Implementation ────────────────────────────────────────────────────

/**
 * Custom hook to verify the connected wallet is on Arc Testnet (chain ID 5042002).
 * Provides a function to switch/add Arc Testnet to the wallet.
 */
export function useNetworkCheck(): UseNetworkCheckReturn {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();

  const isCorrectNetwork = useMemo(() => {
    if (!isConnected) return false;
    return chainId === ARC_TESTNET_CHAIN_ID;
  }, [chainId, isConnected]);

  const switchToArcTestnet = useCallback(() => {
    switchChain({
      chainId: arcTestnet.id,
    });
  }, [switchChain]);

  const switchError = useMemo((): string | null => {
    if (!error) return null;
    // Map common errors to user-friendly messages
    if (error.message?.includes("User rejected")) {
      return "Network switch was cancelled.";
    }
    return "Failed to switch to Arc Testnet. Please add it manually.";
  }, [error]);

  return {
    isCorrectNetwork,
    isConnected,
    switchToArcTestnet,
    isSwitching: isPending,
    switchError,
  };
}
