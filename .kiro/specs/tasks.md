# FlowBill Arc — Implementation Tasks

## Overview

Implementation is organized into 6 task groups, ordered by dependency. Each task includes the files to create/modify and the acceptance criteria it fulfills.

---

## Task Group 1: Project Scaffolding & Configuration

### Task 1.1: Initialize Next.js project
- Initialize Next.js with App Router, TypeScript, Tailwind CSS, ESLint
- Configure `tsconfig.json` with strict mode
- Configure Tailwind with dark theme as default
- Set up path aliases (`@/` → `src/`)

**Files:**
- `package.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.js`
- `next.config.ts`
- `src/app/layout.tsx` (minimal)
- `src/app/page.tsx` (placeholder)
- `src/app/globals.css`

**Validates:** NFR-5 (TypeScript strict), NFR-2 (responsive foundation)

---

### Task 1.2: Install and configure wagmi + viem
- Install wagmi, viem, @tanstack/react-query
- Define Arc Testnet chain (`src/lib/constants.ts`)
- Create wagmi config (`src/lib/wagmi-config.ts`)
- Create Providers wrapper (`src/providers/web3-provider.tsx`)
- Wrap app layout with providers

**Files:**
- `src/lib/constants.ts`
- `src/lib/wagmi-config.ts`
- `src/providers/web3-provider.tsx`
- `src/app/layout.tsx` (update)

**Validates:** FR-1 (wallet connection setup), FR-2 (network config)

---

### Task 1.3: Define types and constants
- Create Invoice, PaymentRecord, InvoiceStatus types
- Define USDC contract address, ABI, decimals
- Define error message constants
- Define app metadata constants

**Files:**
- `src/types/invoice.ts`
- `src/lib/constants.ts` (extend)

**Validates:** NFR-5 (typed model), design data model spec

---

## Task Group 2: Core Utilities & Hooks

### Task 2.1: localStorage utility
- Create storage helper with get/set/update/delete operations
- Namespace under `flowbill_invoices`
- Handle JSON parse errors gracefully
- Include schema version for future migrations

**Files:**
- `src/lib/storage.ts`

**Validates:** FR-5 (localStorage persistence), US-4 acceptance criteria

---

### Task 2.2: Invoice management hook
- Create `useInvoices` hook wrapping storage utility
- Operations: getAll, getById, create, update, delete
- Generate UUID for new invoices
- Handle overdue status computation at read time
- Return loading state for SSR hydration safety

**Files:**
- `src/hooks/use-invoices.ts`

**Validates:** FR-5, FR-11 (status transitions), US-4, US-5

---

### Task 2.3: Network verification hook
- Create `useNetworkCheck` hook
- Check if connected chain is Arc Testnet (5042002)
- Expose `switchToArcTestnet()` function
- Handle `wallet_switchEthereumChain` and `wallet_addEthereumChain` fallback
- Expose `isCorrectNetwork`, `isSwitching` state

**Files:**
- `src/hooks/use-network-check.ts`

**Validates:** FR-2, FR-3, US-2 acceptance criteria

---

### Task 2.4: USDC payment hook
- Create `usePayInvoice` hook
- Execute ERC-20 `transfer(to, amount)` with 6 decimals
- Wait for 1 block confirmation
- Return `txHash`, `isPaying`, `isConfirming`, `isSuccess`, `isError`, `error`
- Map viem errors to user-friendly messages

**Files:**
- `src/hooks/use-pay-invoice.ts`
- `src/lib/blockchain.ts`

**Validates:** FR-8 (USDC transfer), FR-9 (confirmation), US-7, US-8

---

### Task 2.5: Utility helpers
- Address truncation (`0x1234...abcd`)
- Amount formatting (with USDC symbol)
- Explorer URL builders (tx, address)
- Date formatting helpers
- UUID generation

**Files:**
- `src/lib/utils.ts`

**Validates:** Receipt plan, design spec utilities

---

## Task Group 3: Shared UI Components

### Task 3.1: Base UI components
- Button (primary, secondary, ghost, loading state)
- Card (with optional header/footer)
- Badge (pending/paid/overdue color variants)
- Input (with label, error message, helper text)
- LoadingSpinner

**Files:**
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/loading-spinner.tsx`

**Validates:** NFR-2 (responsive), design component spec

---

### Task 3.2: Layout components
- Header with logo, nav links, wallet button
- WalletButton (connect/disconnect/address display)
- NetworkBanner (wrong network warning with switch button)
- PageContainer (consistent max-width, padding)

**Files:**
- `src/components/header.tsx`
- `src/components/wallet-button.tsx`
- `src/components/network-banner.tsx`
- `src/components/page-container.tsx`
- `src/app/layout.tsx` (integrate)

**Validates:** FR-1, FR-2, FR-3, US-1, US-2

---

### Task 3.3: Invoice display components
- InvoiceCard (for dashboard list)
- StatusBadge (color-coded status)
- AmountDisplay (formatted USDC)
- AddressDisplay (truncated with copy)
- EmptyState (no invoices prompt)

**Files:**
- `src/components/invoice/invoice-card.tsx`
- `src/components/invoice/status-badge.tsx`
- `src/components/invoice/amount-display.tsx`
- `src/components/invoice/address-display.tsx`
- `src/components/invoice/empty-state.tsx`

**Validates:** US-5, FR-6, design component spec

---

## Task Group 4: Pages — Creator Flow

### Task 4.1: Dashboard page (`/`)
- List all invoices from localStorage
- Show InvoiceCard for each
- EmptyState when no invoices
- "Create Invoice" CTA button
- Link each card to `/invoice/[id]`
- Require wallet connection (show connect prompt if not)

**Files:**
- `src/app/page.tsx`

**Validates:** FR-6, US-5 acceptance criteria

---

### Task 4.2: Create Invoice page (`/create`)
- Invoice creation form with all fields
- Client name (required), email (optional), description (required)
- Amount input (required, > 0, max 6 decimals)
- Recipient address (required, valid 0x, pre-fill from wallet)
- Due date (required, must be future)
- Form validation with inline errors
- On submit: save to localStorage, redirect to `/invoice/[id]`

**Files:**
- `src/app/create/page.tsx`
- `src/components/invoice/invoice-form.tsx`

**Validates:** FR-4, US-3 acceptance criteria

---

### Task 4.3: Invoice Detail page (`/invoice/[id]`)
- Display full invoice details
- Status badge (pending/paid/overdue)
- Payment link section with copy button
- Receipt section (conditional: only when paid)
- Receipt shows: payer, recipient, amount, tx hash, timestamp, explorer link
- Handle invoice not found (404 state)

**Files:**
- `src/app/invoice/[id]/page.tsx`
- `src/components/invoice/payment-link-section.tsx`
- `src/components/invoice/receipt-section.tsx`

**Validates:** FR-7, FR-10, US-6, US-9 acceptance criteria

---

## Task Group 5: Pages — Payer Flow

### Task 5.1: Payment page (`/pay/[id]`)
- Display invoice summary (amount, description, recipient, due date)
- No wallet required to view
- "Connect Wallet & Pay" button
- Network verification before payment
- Transaction status states: idle → pending → confirmed → success / error
- On success: update invoice in localStorage, show receipt
- On error: show error message with retry option
- Handle invoice not found
- Handle already paid invoice

**Files:**
- `src/app/pay/[id]/page.tsx`
- `src/components/invoice/payment-button.tsx`
- `src/components/invoice/transaction-status.tsx`

**Validates:** FR-8, FR-9, FR-10, US-7, US-8, US-10

---

## Task Group 6: Polish & Documentation

### Task 6.1: Error states and edge cases
- 404 page for invalid routes
- Invoice not found state on detail/payment pages
- localStorage unavailable warning
- Wallet disconnected mid-flow handling
- Already-paid invoice state on payment page
- Loading states during hydration (SSR mismatch prevention)

**Files:**
- `src/app/not-found.tsx`
- Various components (updates)

**Validates:** US-10, NFR-6, error handling plan

---

### Task 6.2: Responsive design pass
- Verify all pages work at 375px, 768px, 1024px, 1440px
- Adjust grid layouts for mobile
- Test form usability on mobile
- Verify touch targets are 44px+ minimum

**Files:**
- Various components (Tailwind class adjustments)

**Validates:** NFR-2 (375px+ responsive)

---

### Task 6.3: README and documentation
- Project description and features
- Tech stack overview
- Setup instructions (install, dev, build)
- Environment variables (if any — WalletConnect project ID)
- Arc Testnet details for developers
- Future roadmap section
- License

**Files:**
- `README.md`

**Validates:** Code quality requirements (clear README)

---

## Dependency Graph

```
Task Group 1 (Scaffolding)
    │
    ▼
Task Group 2 (Utilities & Hooks)
    │
    ▼
Task Group 3 (Shared UI)
    │
    ├──────────────────┐
    ▼                  ▼
Task Group 4        Task Group 5
(Creator Flow)      (Payer Flow)
    │                  │
    └────────┬─────────┘
             ▼
      Task Group 6
      (Polish & Docs)
```

---

## Estimated Effort

| Task Group | Tasks | Complexity |
|------------|-------|------------|
| 1. Scaffolding | 3 | Low |
| 2. Utilities & Hooks | 5 | Medium |
| 3. Shared UI | 3 | Medium |
| 4. Creator Flow | 3 | Medium |
| 5. Payer Flow | 1 | High |
| 6. Polish & Docs | 3 | Low-Medium |
| **Total** | **18 tasks** | — |

---

## Implementation Notes

1. **Start with Task Group 1** — nothing else can proceed without the scaffold.
2. **Task Group 2 is critical path** — hooks must be solid before building pages.
3. **Task Groups 4 and 5 can partially parallelize** — they share UI components from Group 3.
4. **USDC contract address** — must be verified on Arc Testnet before Task 2.4. If no deployed ERC-20 USDC exists, the native transfer approach (using 18 decimals for value transfer) may be needed as fallback, but the spec assumes ERC-20 exists.
5. **WalletConnect Project ID** — needed for WalletConnect connector. Can use injected-only for initial dev, add WalletConnect when ID is available.
6. **SSR hydration** — localStorage is client-only. All invoice reads must be guarded with `useEffect` or `typeof window !== 'undefined'` checks to prevent hydration mismatch.
