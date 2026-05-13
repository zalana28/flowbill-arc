# FlowBill Arc — Project Steering

## Overview

FlowBill Arc is a gasless-ready USDC invoice app for freelancers and global builders on Arc Testnet. Users create invoices, generate payment links, let clients pay with USDC, and track paid invoices.

## Repository

- Repo: `flowbill-arc`
- Target Network: **Arc Testnet only** — never target mainnet.

## Tech Stack

- **Framework:** Next.js App Router (TypeScript)
- **Styling:** Tailwind CSS
- **Wallet:** wagmi + viem
- **Storage:** localStorage (MVP phase)
- **Deployment:** Static export or Vercel-compatible

## Arc Testnet Network Details

| Property | Value |
|----------|-------|
| Chain ID | 5042002 |
| RPC URL | https://rpc.testnet.arc.network |
| Explorer | https://testnet.arcscan.app |
| Native Gas Token | USDC (18 decimals) |

## Critical Arc Rules

1. Arc uses USDC as the native gas token.
2. **Native gas USDC uses 18 decimals.**
3. **ERC-20 USDC interface uses 6 decimals.**
4. Invoice payments using ERC-20 transfer MUST use 6 decimals.
5. **Never mix native gas decimals (18) with ERC-20 transfer decimals (6).**
6. Never target mainnet — this project is Arc Testnet only.
7. Always verify the connected wallet is on Arc Testnet (chain ID 5042002) before submitting transactions.
8. Prompt user to add/switch to Arc Testnet when on wrong network.

## Phase 1 Scope Boundaries

### In Scope
- Wallet connection (wagmi)
- Network verification and auto-switch
- Invoice CRUD via localStorage
- Public payment links
- USDC ERC-20 transfer (6 decimals)
- Transaction confirmation
- Receipt display with explorer link

### Explicitly Out of Scope (Phase 1)
- No Circle API key required
- No backend required
- No mainnet payments
- No Circle Wallets
- No Gas Station / Paymaster
- No CCTP
- No Webhooks
- These are documented as future integration notes only.

## Security Rules

- Never put private API keys in frontend code.
- Do not hardcode secrets.
- Do not make fake security claims.
- Do not use custodial language unless Circle Wallets are actually implemented.

## Code Quality Standards

- Modular components (single responsibility)
- Typed invoice model (TypeScript interfaces)
- Separate custom hooks for localStorage operations
- Separate blockchain utility modules
- Separate constants file for network and token config
- Clear README with setup instructions
- No unrelated features

## UI/UX Guidelines

- Premium fintech aesthetic
- Dark modern interface preferred
- Clean dashboard layout
- Responsive (mobile-first)
- Clear empty states (no invoices yet)
- Clear loading states (transaction pending)
- Clear error states (wrong network, tx failed)
- Trustworthy, professional product copy
