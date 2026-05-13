# Circle Integration Plan

This document describes the planned Circle integrations for FlowBill Arc, organized into phases. Each phase builds on the previous one.

---

## Current State (Phase 1)

FlowBill Arc works entirely without Circle APIs:

- Wallet-native USDC payments on Arc Testnet
- ERC-20 `transfer()` via wagmi/viem
- Invoice storage in localStorage
- No backend, no API keys, no external services

---

## Phase 2A: Modular Wallets with Client Key

**Goal:** Allow clients without crypto wallets to pay invoices using Circle's embedded wallet experience.

**Key Required:** `NEXT_PUBLIC_CIRCLE_CLIENT_KEY` (client-safe)

**Integration Points:**

- Add Circle Modular Wallets SDK to the payment page
- Offer "Pay without wallet" option alongside existing MetaMask flow
- Client authenticates via email or social login
- Circle creates and manages an embedded wallet
- Payment executes from the Circle-managed wallet

**Files to Add/Modify:**

- `src/providers/circle-wallet-provider.tsx` — SDK initialization
- `src/app/pay/[id]/page.tsx` — add embedded wallet payment option
- `src/hooks/use-circle-wallet.ts` — hook for Circle wallet state

**Scope:** Client-side only. No `CIRCLE_API_KEY` needed for this phase.

---

## Phase 2B: Server API Routes with API Key

**Goal:** Enable server-side Circle operations for wallet management, compliance, and transaction monitoring.

**Key Required:** `CIRCLE_API_KEY` (server-side only)

**Integration Points:**

- `POST /api/circle/wallets/create` — create programmable wallets
- `GET /api/circle/wallets/[id]/balance` — check wallet balances
- `POST /api/circle/transactions/transfer` — initiate server-side transfers
- `GET /api/circle/transactions/[id]` — check transaction status

**Files to Add/Modify:**

- `src/app/api/circle/wallets/route.ts`
- `src/app/api/circle/transactions/route.ts`
- `src/lib/circle-client.ts` — server-side Circle SDK wrapper

**Security:** All routes use `getCircleApiKey()` from `src/lib/circle-config.ts`. The key is never sent to the client.

---

## Phase 2C: Gas Station / Paymaster

**Goal:** Gasless transactions — clients don't need native tokens to pay gas fees.

**Key Required:** `CIRCLE_API_KEY` (server-side for Gas Station policy management)

**Integration Points:**

- Configure Gas Station policy in Circle Console
- Wrap USDC transfers in sponsored meta-transactions
- Client signs the intent; Gas Station pays the gas
- Invoice payment becomes truly gasless for the payer

**Architecture:**

```
Client signs intent → Server submits to Gas Station → Gas Station relays tx → Arc Testnet
```

**Files to Add/Modify:**

- `src/app/api/circle/gas-station/sponsor.ts` — sponsorship endpoint
- `src/hooks/use-gasless-pay.ts` — client hook for gasless payment flow
- `src/lib/gas-station.ts` — Gas Station policy helpers

---

## Phase 2D: CCTP Cross-Chain Invoice Payments

**Goal:** Accept USDC payments from other chains (Ethereum, Polygon, Arbitrum, etc.)

**Key Required:** `CIRCLE_API_KEY` (server-side for attestation polling)

**Integration Points:**

- Payment page shows source chain selector
- CCTP burns USDC on the source chain
- Attestation service confirms the burn
- CCTP mints USDC on Arc Testnet
- Invoice fulfilled when Arc-side mint completes

**Architecture:**

```
Source Chain: burn USDC → Circle Attestation → Arc Testnet: mint USDC → Invoice paid
```

**Files to Add/Modify:**

- `src/app/pay/[id]/cross-chain.tsx` — cross-chain payment UI
- `src/app/api/circle/cctp/attest.ts` — attestation polling endpoint
- `src/hooks/use-cctp-payment.ts` — cross-chain payment hook
- `src/lib/cctp.ts` — CCTP contract interactions

---

## Phase 2E: Webhooks for Production Payment Status

**Goal:** Real-time server-side notifications when payments complete, replacing client-side polling.

**Key Required:** `CIRCLE_API_KEY` (server-side for webhook signature verification)

**Integration Points:**

- `POST /api/webhooks/circle` — webhook receiver endpoint
- Verify webhook signatures using Circle's public key
- Update invoice status in database (replaces localStorage)
- Send email notifications to freelancer on payment
- Handle duplicate delivery and out-of-order events

**Prerequisites:**

- Database (PostgreSQL/Supabase) replacing localStorage
- User authentication system
- Email service (Resend/SendGrid)

**Files to Add/Modify:**

- `src/app/api/webhooks/circle/route.ts` — webhook handler
- `src/lib/webhook-verify.ts` — signature verification
- `src/lib/notifications.ts` — email notification service

---

## Security Rules

### Never Commit API Keys

- `.env*` is in `.gitignore`
- `.env.example` contains only empty placeholders
- Real keys go in `.env.local` (local dev) or environment variables (production)

### Never Expose CIRCLE_API_KEY Client-Side

- Only import `src/lib/circle-config.ts` in server components and API routes
- The file throws an error if `window` is defined (runtime guard)
- `NEXT_PUBLIC_` prefix keys are the only ones safe for the browser
- `CIRCLE_API_KEY` does NOT have the `NEXT_PUBLIC_` prefix

### Use Environment Variables

- Local development: `.env.local`
- Production: Platform environment variables (Vercel, AWS, etc.)
- CI/CD: Secret store or environment variables

### Rotate Leaked Keys Immediately

If a Circle API key is accidentally committed or exposed:

1. Revoke the key immediately in [Circle Console](https://console.circle.com)
2. Generate a new key
3. Update all environments with the new key
4. Audit git history — use `git filter-branch` or BFG to remove the key from history
5. Review access logs in Circle Console for unauthorized usage

---

## Integration Health Check

FlowBill includes a server-side health endpoint:

```
GET /api/circle/health
```

Response:

```json
{
  "configured": false,
  "message": "Circle API key is not configured. Phase 1 wallet-native payments are active.",
  "phase": "circle-integration-prep"
}
```

This endpoint:
- Reports whether `CIRCLE_API_KEY` is set
- Never leaks the key or any prefix
- Does not call external Circle APIs
- Returns a safe status object for monitoring

---

## Resources

- [Circle Console](https://console.circle.com) — Key management
- [Circle Docs](https://developers.circle.com) — SDK and API documentation
- [Arc Docs — Contract Addresses](https://docs.arc.network/arc/references/contract-addresses) — USDC on Arc
- [CCTP Documentation](https://developers.circle.com/stablecoins/cctp-getting-started) — Cross-chain transfers
