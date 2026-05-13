"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/utils";

export function WalletButton() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <AnimatePresence mode="wait">
      {isConnected && address ? (
        <motion.button
          key="connected"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={() => disconnect()}
          title={address}
          aria-label={`Disconnect wallet ${address}`}
          className="flex items-center gap-2 h-9 px-3 rounded-xl border border-border-default bg-bg-surface text-sm font-medium text-text-primary hover:border-border-accent hover:bg-bg-hover transition-all duration-200"
        >
          <motion.span
            className="h-2 w-2 rounded-full bg-accent-green"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="font-mono text-xs">{truncateAddress(address)}</span>
        </motion.button>
      ) : (
        <motion.div
          key="disconnected"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
