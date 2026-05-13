# FlowBill Arc

Gasless-ready USDC invoice app for freelancers and global builders on Arc Testnet.

Create invoices, share payment links, receive USDC payments on-chain, and track paid invoices — all without a backend.

---

## Features

- **Wallet Connection** — Connect via MetaMask or any injected wallet
- **Network Verification** — Automatic Arc Testnet detection with one-click switch
- **Invoice Creation** — Client name, description, USDC amount, recipient address, due date
- **Payment Links** — Shareable public URLs for clients to pay
- **USDC Payments** — ERC-20 transfer on Arc Testnet with 1-block confirmation
- **Receipt Display** — Payer address, tx hash, timestamp, and ArcScan explorer link
- **Status Tracking** — Pending, paid, and overdue invoice states
- **Dark Fintech UI** — Premium responsive interface optimized for mobile and desktop

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Wallet | wagmi + viem |
| Storage | localStorage (MVP) |
| Network | Arc Testnet only |

---

## Arc Testnet Details

| Property | Value |
|----------|-------|
| Chain ID | `5042002` |
| RPC URL | `https://rpc.testnet.arc.network` |
| Explorer | `https://testnet.arcscan.app` |
| Native Gas Token | USDC (18 decimals) |
| USDC ERC-20 Interface | `0x3600000000000000000000000000000000000000` |

### Decimal Rules

| Context | Decimals | Usage |
|---------|----------|-------|
| Native gas (USDC) | 18 | Gas fees, native balance display |
| ERC-20 USDC transfer | **6** | Invoice payments, `transfer(to, amount)` |

> **Critical:** Never mix native gas decimals (18) with ERC-20 transfer decimals (6). Invoice payments always use `parseUnits(amount, 6)`.

Source: [Arc Docs — Contract Addresses](https://docs.arc.network/arc/references/contract-addresses)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A browser wallet (MetaMask recommended)
- Arc Testnet USDC (get from [Console Faucet](https://console.circle.com/faucet))

### Installation

```bash
git clone https://github.com/zalana28/flowbill-arc.git
cd flowbill-arc
git checkout feat/task-group-1-scaffolding
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## Demo Flow

1. **Connect wallet** — Click "Connect Wallet" in the header
2. **Switch network** — If prompted, switch to Arc Testnet
3. **Create invoice** — Fill in client details, USDC amount, and due date
4. **Copy payment link** — Share `/pay/[id]` with your client
5. **Client pays** — Client opens link, connects wallet, clicks "Pay"
6. **Confirmation** — Transaction confirms on Arc Testnet in ~1 second
7. **Receipt** — Both parties see tx hash, payer address, and ArcScan link

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Dashboard
│   ├── create/page.tsx     # Create invoice
│   ├── invoice/[id]/       # Invoice detail + receipt
│   ├── pay/[id]/           # Public payment page
│   └── not-found.tsx       # 404 page
├── components/             # Reusable UI components
│   ├── ui/                 # Primitives (Button, Card, Badge, Input)
│   └── invoice/            # Invoice-specific components
├── hooks/                  # Custom React hooks
│   ├── use-invoices.ts     # Invoice CRUD + localStorage
│   ├── use-network-check.ts # Arc Testnet verification
│   └── use-pay-invoice.ts  # USDC ERC-20 transfer
├── lib/                    # Utility modules
│   ├── constants.ts        # Network, token, app constants
│   ├── blockchain.ts       # Amount conversion + error mapping
│   ├── storage.ts          # localStorage helpers
│   ├── utils.ts            # Formatting, validation, URLs
│   └── wagmi-config.ts     # wagmi + viem config
├── providers/              # Context providers
│   └── web3-provider.tsx   # WagmiProvider + QueryClient
└── types/                  # TypeScript interfaces
    └── invoice.ts          # Invoice, PaymentRecord, StorageSchema
```

---

## Security

- **No API keys are committed** — This Phase 1 MVP runs entirely client-side
- **No private keys in code** — Wallet interactions use wagmi hooks only
- **No custodial claims** — The app does not custody funds or manage wallets
- **No mainnet support** — Hardcoded to Arc Testnet (chain ID 5042002) only
- **Network gating** — Transactions are blocked unless wallet is on Arc Testnet

---

## Phase 1 Scope (Current)

- Client-side only (no backend, no database)
- localStorage for invoice persistence
- USDC ERC-20 transfer on Arc Testnet
- Public payment links (no authentication)
- No Circle API key required

---

## Phase 2: Circle Integration Prep (Current)

Phase 2 adds safe configuration scaffolding for Circle integration **without changing the working Phase 1 payment flow**.

### What's Included

- `.env.example` with all Circle and WalletConnect placeholder variables
- `src/lib/circle-config.ts` — server-only helper that reads `CIRCLE_API_KEY`
- `GET /api/circle/health` — server route reporting configuration status
- Dashboard "Circle Integration" section showing planned features
- `docs/CIRCLE_INTEGRATION.md` — full integration plan and security rules

### Circle Key Model

| Key | Scope | Purpose |
|-----|-------|---------|
| `CIRCLE_API_KEY` | **Server-side only** | Programmable Wallets, Gas Station, CCTP, Webhooks |
| `NEXT_PUBLIC_CIRCLE_CLIENT_KEY` | Client-safe | Modular Wallets SDK (browser embedded wallets) |
| `NEXT_PUBLIC_CIRCLE_CLIENT_URL` | Client-safe | Modular Wallets SDK endpoint |

> **Critical:** `CIRCLE_API_KEY` must NEVER appear in client/browser code. It is only read in Next.js API routes and server components via `src/lib/circle-config.ts`.

### No Real Keys Are Committed

- `.env*` is in `.gitignore` — no secrets reach the repository
- `.env.example` contains empty placeholders only
- The health route never leaks the key or any prefix

### How to Get Circle Keys Later

1. Go to [Circle Console](https://console.circle.com)
2. Create a project
3. Copy your **API Key** (for server-side) and **Client Key** (for Modular Wallets)
4. Add them to `.env.local` (never commit this file)

### FlowBill Works Without Circle Keys

Phase 1 is fully functional with wallet-native USDC payments on Arc Testnet. Circle keys are only needed when you're ready to enable embedded wallets, gasless transactions, or cross-chain payments.

---

## Phase 3+ Roadmap

| Phase | Feature | Description |
|-------|---------|-------------|
| 2A | **Modular Wallets** | Embedded wallets via Circle Client Key |
| 2B | **Server API routes** | Backend integrations via Circle API Key |
| 3 | **Gas Station** | Sponsored transactions for gasless UX |
| 3 | **Paymaster** | Pay gas fees with USDC |
| 4 | **CCTP** | Cross-chain USDC invoice payments |
| 5 | **Webhooks** | Real-time production payment notifications |

### Architecture Changes for Phase 3+

- Add Next.js API routes or separate backend service
- Replace localStorage with PostgreSQL/Supabase
- Add Circle Web3 SDK for embedded wallets
- Add authentication (email OTP or OAuth)
- Add email notifications (Resend/SendGrid)
- Add Paymaster contract interactions
- Add CCTP burn/mint/attest flow

---

## Environment Variables

No environment variables are required for Phase 1. The app works out of the box.

See `.env.example` for all available variables:

```env
# Server-side only — never expose to browser
CIRCLE_API_KEY=

# Client-safe — for Circle Modular Wallets SDK
NEXT_PUBLIC_CIRCLE_CLIENT_KEY=
NEXT_PUBLIC_CIRCLE_CLIENT_URL=

# Optional — for WalletConnect v2 connector
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# App URL for payment link generation
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## License

MIT
