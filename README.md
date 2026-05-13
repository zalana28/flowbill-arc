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

## Phase 2 Roadmap

The following integrations are planned for future phases:

| Phase | Feature | Description |
|-------|---------|-------------|
| 2 | **Circle Client Key for Modular Wallets** | Embedded wallets for non-crypto-native clients |
| 2 | **Circle API Key for backend integrations** | Server-side invoice storage and user auth |
| 3 | **Gas Station for sponsored transactions** | Gasless payments — clients don't need gas tokens |
| 3 | **Paymaster for paying gas with USDC** | Meta-transactions with USDC as gas |
| 4 | **CCTP for cross-chain invoice payments** | Accept USDC from Ethereum, Polygon, and other chains |
| 5 | **Webhooks for production payment status** | Real-time server-side payment notifications |

### Architecture Changes for Phase 2+

- Add Next.js API routes or separate backend service
- Replace localStorage with PostgreSQL/Supabase
- Add Circle Web3 SDK for embedded wallets
- Add authentication (email OTP or OAuth)
- Add email notifications (Resend/SendGrid)
- Add Paymaster contract interactions
- Add CCTP burn/mint/attest flow

---

## Environment Variables

No environment variables are required for Phase 1.

Future phases may require:

```env
# Phase 2+ (not needed now)
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
# CIRCLE_API_KEY=your_circle_api_key (server-side only, never in frontend)
```

---

## License

MIT
