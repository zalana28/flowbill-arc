import { defineChain } from "viem";

// ─── Arc Testnet Chain Definition ────────────────────────────────────────────

export const ARC_TESTNET_CHAIN_ID = 5042002;

export const arcTestnet = defineChain({
  id: ARC_TESTNET_CHAIN_ID,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18, // Native gas token uses 18 decimals
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
});

// ─── USDC ERC-20 Token Configuration ────────────────────────────────────────

/**
 * ERC-20 USDC contract address on Arc Testnet.
 * This is the token contract used for invoice payments.
 */
export const USDC_CONTRACT_ADDRESS =
  "0x2BF45ee00918D4d7C5ef4a11726F1895A0EDE76C" as const;

/**
 * ERC-20 USDC uses 6 decimals for transfer amounts.
 * IMPORTANT: Never confuse with native gas USDC which uses 18 decimals.
 */
export const USDC_DECIMALS = 6;

export const USDC_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

// ─── Explorer Utilities ─────────────────────────────────────────────────────

export const EXPLORER_BASE_URL = "https://testnet.arcscan.app";

// ─── App Constants ──────────────────────────────────────────────────────────

export const APP_NAME = "FlowBill Arc";
export const APP_DESCRIPTION =
  "Gasless-ready USDC invoice app for freelancers and global builders on Arc Testnet.";

// localStorage namespace
export const STORAGE_KEY = "flowbill_invoices";
export const STORAGE_VERSION = 1;
