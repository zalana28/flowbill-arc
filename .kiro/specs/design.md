# FlowBill Arc — Design Specification

## Architecture Overview

FlowBill Arc is a client-side Next.js application. All data persists in localStorage. Blockchain interactions use wagmi hooks and viem utilities to execute USDC ERC-20 transfers on Arc Testnet.

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                             │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Next.js    │  │  wagmi /     │  │  localStorage │  │
│  │  App Router │──│  viem        │  │  (invoices)   │  │
│  │  (UI)       │  │  (blockchain)│  │               │  │
│  └─────────────┘  └──────┬───────┘  └───────────────┘  │
│                           │                             │
└───────────────────────────┼─────────────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Arc Testnet       │
                 │   (Chain 5042002)   │
                 │   USDC ERC-20      │
                 └─────────────────────┘
```

---

## Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Dashboard — list all invoices | Wallet connected |
| `/create` | Create new invoice form | Wallet connected |
| `/invoice/[id]` | Invoice detail + receipt (creator view) | Wallet connected |
| `/pay/[id]` | Public payment page (client view) | No (view) / Wallet (pay) |

### Route Details

#### `/` — Dashboard
- Shows all invoices from localStorage
- Filter/sort by status (pending, paid, overdue)
- Empty state with CTA to create first invoice
- Requires wallet connection to access

#### `/create` — Create Invoice
- Multi-field form with validation
- Pre-fills recipient address from connected wallet
- Redirects to `/invoice/[id]` on success

#### `/invoice/[id]` — Invoice Detail
- Full invoice information
- Payment link with copy button
- Receipt section (visible when paid)
- Status badge

#### `/pay/[id]` — Payment Page
- Public-facing — invoice details visible without wallet
- "Connect Wallet & Pay" flow
- Network verification before payment
- Transaction status UI (idle → pending → confirmed / failed)

---

## Data Model

### Invoice

```typescript
interface Invoice {
  id: string;                    // UUID v4
  status: InvoiceStatus;
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp

  // Invoice details
  clientName: string;
  clientEmail?: string;          // Optional
  description: string;
  amount: string;                // String to preserve decimal precision (e.g., "150.50")
  recipientAddress: string;      // 0x... Ethereum address
  dueDate: string;               // ISO 8601 date (YYYY-MM-DD)

  // Payment details (populated after payment)
  payment?: PaymentRecord;
}

type InvoiceStatus = 'pending' | 'paid' | 'overdue';

interface PaymentRecord {
  txHash: string;                // Transaction hash
  payerAddress: string;          // Address that paid
  paidAt: string;                // ISO 8601 timestamp
  blockNumber: number;           // Block where tx was confirmed
}
```

### Storage Schema

```typescript
// localStorage key: "flowbill_invoices"
// Value: JSON stringified array of Invoice objects

interface StorageSchema {
  invoices: Invoice[];
  version: number;               // Schema version for future migrations
}
```

---

## Component Structure

### Layout Components

```
RootLayout
├── Providers (wagmi, QueryClient)
├── Header
│   ├── Logo
│   ├── Navigation
│   └── WalletButton (connect/disconnect/address)
├── NetworkBanner (wrong network warning)
└── Main Content (page children)
```

### Page Components

```
DashboardPage
├── InvoiceList
│   ├── InvoiceCard (× N)
│   │   ├── StatusBadge
│   │   ├── AmountDisplay
│   │   └── DueDate
│   └── EmptyState
└── CreateInvoiceButton

CreateInvoicePage
└── InvoiceForm
    ├── FormField (× N)
    ├── AddressInput (with validation)
    ├── AmountInput (with USDC formatting)
    └── SubmitButton

InvoiceDetailPage
├── InvoiceHeader (status, amount)
├── InvoiceDetails (client, description, dates)
├── PaymentLinkSection
│   ├── LinkDisplay
│   └── CopyButton
└── ReceiptSection (conditional: when paid)
    ├── PayerInfo
    ├── TransactionInfo
    └── ExplorerLink

PaymentPage
├── InvoiceSummary
├── NetworkCheck
├── PaymentButton
├── TransactionStatus
│   ├── PendingState (spinner + tx hash)
│   ├── SuccessState (confirmation + receipt)
│   └── ErrorState (message + retry)
└── NotFoundState (invalid invoice ID)
```

### Shared UI Components

| Component | Purpose |
|-----------|---------|
| `Button` | Primary, secondary, ghost variants |
| `Card` | Container with consistent padding/border |
| `Badge` | Status indicators (pending, paid, overdue) |
| `Input` | Text input with label, error state |
| `AddressDisplay` | Truncated address with copy |
| `AmountDisplay` | Formatted USDC amount |
| `LoadingSpinner` | Consistent loading indicator |
| `Toast` | Success/error notifications |
| `Modal` | Confirmation dialogs |

---

## Wallet & Network Plan

### Wallet Configuration

```typescript
// wagmi config
const config = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected(),          // MetaMask, Rabby, etc.
    walletConnect({ projectId }),  // WalletConnect v2
  ],
  transports: {
    [arcTestnet.id]: http('https://rpc.testnet.arc.network'),
  },
});
```

### Arc Testnet Chain Definition

```typescript
import { defineChain } from 'viem';

export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,     // Native gas token uses 18 decimals
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
});
```

### Network Verification Flow

```
User connects wallet
       │
       ▼
Check chainId === 5042002?
       │
    ┌──┴──┐
    │ Yes │ No
    │     │
    ▼     ▼
  Allow  Show NetworkBanner
  usage  "Switch to Arc Testnet"
              │
              ▼
         wallet_switchEthereumChain(5042002)
              │
           ┌──┴──┐
           │Fail │ Success
           │     │
           ▼     ▼
    wallet_addEthereumChain  → Allow usage
    (with full chain params)
```

### Custom Hook: `useNetworkCheck`

```typescript
function useNetworkCheck() {
  return {
    isCorrectNetwork: boolean;
    switchToArcTestnet: () => Promise<void>;
    isSwitching: boolean;
  };
}
```

---

## USDC Transfer Plan

### Key Principle

> Invoice payments use the ERC-20 USDC contract's `transfer` function with **6 decimals**.
> The native gas token USDC uses 18 decimals — these must NEVER be confused.

### USDC ERC-20 Contract

```typescript
// The deployed USDC ERC-20 contract address on Arc Testnet
// This will be set in constants.ts — must be verified on Arc Testnet
export const USDC_CONTRACT_ADDRESS = '0x...'; // To be confirmed

export const USDC_DECIMALS = 6; // ERC-20 transfer decimals

export const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;
```

### Amount Conversion

```typescript
import { parseUnits } from 'viem';

// CORRECT: Convert human-readable amount to 6-decimal uint256
function toUsdcAmount(humanAmount: string): bigint {
  return parseUnits(humanAmount, 6); // e.g., "100.50" → 100500000n
}

// WRONG (never do this):
// parseUnits(humanAmount, 18) — this is for native gas, not ERC-20 transfer
```

### Transfer Execution Flow

```
Client clicks "Pay Invoice"
         │
         ▼
Verify network (chain 5042002)
         │
         ▼
Read invoice amount & recipient
         │
         ▼
Convert amount: parseUnits(amount, 6)
         │
         ▼
Call USDC.transfer(recipientAddress, usdcAmount)
         │
         ▼
Wait for transaction receipt (1 block)
         │
    ┌────┴────┐
    │ Success │ Failure
    │         │
    ▼         ▼
Update       Show error
invoice      (revert reason
status       or user rejection)
to "paid"
```

### Custom Hook: `usePayInvoice`

```typescript
function usePayInvoice(invoice: Invoice) {
  return {
    pay: () => Promise<void>;
    isPaying: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    txHash: string | null;
  };
}
```

---

## Payment Status Plan

### Status State Machine

```
                  ┌─────────────────────┐
                  │                     │
    ┌─────────┐  │  ┌──────────────┐   │
    │ PENDING │──┼──│ check dueDate│───►│ OVERDUE │
    │         │  │  │ < today      │   │         │
    └────┬────┘  │  └──────────────┘   └─────────┘
         │       │
         │  payment received
         ▼
    ┌─────────┐
    │  PAID   │
    └─────────┘
```

### Status Transitions

| From | To | Trigger |
|------|----|---------|
| `pending` | `paid` | Transaction confirmed on-chain |
| `pending` | `overdue` | Current date > invoice dueDate (computed, not stored) |

### Overdue Detection

Overdue is **computed at render time**, not stored:

```typescript
function getDisplayStatus(invoice: Invoice): InvoiceStatus {
  if (invoice.status === 'paid') return 'paid';
  if (new Date(invoice.dueDate) < new Date()) return 'overdue';
  return 'pending';
}
```

### Status Update on Payment

```typescript
function markInvoicePaid(invoiceId: string, payment: PaymentRecord): void {
  // 1. Read invoices from localStorage
  // 2. Find invoice by ID
  // 3. Set status = 'paid'
  // 4. Attach PaymentRecord
  // 5. Set updatedAt = now
  // 6. Write back to localStorage
}
```

---

## Receipt Plan

### Receipt Data Structure

The receipt is the `PaymentRecord` attached to a paid invoice. It contains:

| Field | Source |
|-------|--------|
| Invoice ID | `invoice.id` |
| Payer Address | Transaction `from` field |
| Recipient Address | `invoice.recipientAddress` |
| Amount | `invoice.amount` + " USDC" |
| Transaction Hash | Transaction receipt `transactionHash` |
| Paid Timestamp | Block timestamp or client timestamp |
| Explorer Link | `https://testnet.arcscan.app/tx/{txHash}` |

### Receipt Display Rules

1. Receipt section only appears when `invoice.status === 'paid'`.
2. All addresses are displayed truncated with full address on hover/copy.
3. Transaction hash links directly to explorer.
4. Timestamp displayed in user's local timezone.
5. Receipt is read-only — no edit capability.

### Explorer Link Construction

```typescript
function getExplorerTxUrl(txHash: string): string {
  return `https://testnet.arcscan.app/tx/${txHash}`;
}

function getExplorerAddressUrl(address: string): string {
  return `https://testnet.arcscan.app/address/${address}`;
}
```

---

## Error Handling Plan

### Error Categories

| Category | Trigger | UI Response |
|----------|---------|-------------|
| Network Error | Wrong chain ID | Banner + switch button |
| Wallet Error | No wallet / disconnected | Connect prompt |
| Balance Error | Insufficient USDC | Inline error on pay button |
| Transaction Error | Tx reverted | Error toast with reason |
| User Rejection | User denied in wallet | Dismissible notification |
| Data Error | Invalid/missing invoice | 404-style not found page |
| Storage Error | localStorage unavailable | Warning banner |

### Error Message Standards

- **Tone:** Professional, calm, helpful
- **Action:** Every error includes a suggested next step
- **No jargon:** Avoid raw error codes; translate to human language
- **No blame:** Never say "you did something wrong"

### Error Handling by Layer

#### Blockchain Layer (`lib/blockchain.ts`)
```typescript
// Wraps all contract calls
// Catches viem errors and maps to user-friendly messages
// Returns { success, data?, error? } pattern
```

#### Hook Layer (`hooks/`)
```typescript
// Exposes isError + error message string
// Manages loading/error/success state transitions
// Resets error state on retry
```

#### UI Layer (`components/`)
```typescript
// Renders appropriate error component
// Provides action buttons (retry, switch network, connect)
// Animates state transitions
```

### Specific Error Mappings

```typescript
const ERROR_MESSAGES: Record<string, string> = {
  WRONG_NETWORK: 'Please switch to Arc Testnet to continue.',
  INSUFFICIENT_BALANCE: 'Insufficient USDC balance to complete this payment.',
  USER_REJECTED: 'Transaction was cancelled.',
  TX_FAILED: 'Transaction failed. Please try again.',
  INVOICE_NOT_FOUND: 'This invoice could not be found.',
  ALREADY_PAID: 'This invoice has already been paid.',
  WALLET_DISCONNECTED: 'Please connect your wallet to continue.',
  STORAGE_UNAVAILABLE: 'Local storage is not available. Invoices cannot be saved.',
};
```

---

## Future Circle Integration Plan

> These features are **NOT implemented in Phase 1**. This section documents the integration architecture for future phases.

### Phase 2: Circle Wallets (Embedded Wallets)

**Purpose:** Allow clients without crypto wallets to pay invoices.

**Integration Points:**
- Replace "Connect Wallet" with "Sign In" for payers
- Circle SDK creates/manages wallet behind the scenes
- User authenticates via email/social
- Payment executed from Circle-managed wallet

**Architecture Change:**
- Add Circle Web3 SDK dependency
- Add authentication flow (email OTP or social)
- Payment page gains a "Pay without wallet" option
- Requires Circle API key (server-side proxy needed)

---

### Phase 3: Gas Station / Paymaster

**Purpose:** Gasless transactions — clients don't need native tokens for gas.

**Integration Points:**
- Wrap USDC transfer in a meta-transaction
- Gas Station sponsors the gas fee
- Client signs the transaction; relayer submits it

**Architecture Change:**
- Add Paymaster contract interaction
- Modify transfer flow to use `permit` + relayer pattern
- Server-side component needed for gas sponsorship

---

### Phase 4: CCTP (Cross-Chain Transfer Protocol)

**Purpose:** Accept USDC payments from other chains (Ethereum, Polygon, etc.)

**Integration Points:**
- Payment page shows source chain selector
- CCTP burns USDC on source chain
- CCTP mints USDC on Arc
- Invoice fulfilled when Arc-side mint completes

**Architecture Change:**
- Multi-chain wagmi config
- CCTP contract interactions (burn on source, attest, mint on dest)
- Attestation service polling
- Extended transaction status UI

---

### Phase 5: Webhooks & Backend

**Purpose:** Real-time notifications, server-side invoice storage, multi-user support.

**Integration Points:**
- Replace localStorage with database (Postgres/Supabase)
- Webhook endpoint for payment confirmations
- Email notifications to freelancer on payment
- User authentication (email/OAuth)

**Architecture Change:**
- Add API routes (Next.js API or separate service)
- Database schema for invoices + users
- Webhook handler for Circle/on-chain events
- Email service integration (Resend, SendGrid)

---

## Design Tokens (UI Reference)

### Color Palette (Dark Theme)

| Token | Value | Usage |
|-------|-------|-------|
| `bg-primary` | `#0a0a0f` | Page background |
| `bg-card` | `#12121a` | Card surfaces |
| `bg-elevated` | `#1a1a2e` | Elevated elements |
| `border-default` | `#2a2a3e` | Card borders |
| `text-primary` | `#ffffff` | Primary text |
| `text-secondary` | `#a0a0b0` | Secondary text |
| `accent-blue` | `#3b82f6` | Primary actions |
| `accent-green` | `#10b981` | Success / paid |
| `accent-yellow` | `#f59e0b` | Pending / warning |
| `accent-red` | `#ef4444` | Error / overdue |

### Typography

- **Headings:** Inter or system font, semibold/bold
- **Body:** Inter or system font, regular
- **Monospace:** JetBrains Mono or system mono (addresses, hashes)

### Spacing

- Card padding: 24px (`p-6`)
- Section gaps: 32px (`gap-8`)
- Form field spacing: 16px (`space-y-4`)
- Button padding: 12px 24px (`px-6 py-3`)
