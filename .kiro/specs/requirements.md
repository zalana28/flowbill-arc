# FlowBill Arc — Requirements Specification

## Product Summary

FlowBill Arc is a USDC invoice application for freelancers and global builders on Arc Testnet. It allows users to create invoices, generate shareable payment links, accept USDC payments on-chain, and track invoice status — all without a backend or API keys in Phase 1.

---

## User Personas

### Freelancer (Invoice Creator)
- Creates invoices for clients
- Shares payment links
- Tracks payment status
- Views receipts and transaction history

### Client (Invoice Payer)
- Receives a payment link
- Connects wallet
- Pays invoice in USDC on Arc Testnet
- Receives on-screen confirmation

---

## User Stories

### US-1: Wallet Connection
**As a** freelancer or client,  
**I want to** connect my wallet to FlowBill,  
**So that** I can create invoices or make payments.

**Acceptance Criteria:**
- [ ] App displays a "Connect Wallet" button when no wallet is connected.
- [ ] Supports MetaMask and WalletConnect-compatible wallets via wagmi connectors.
- [ ] Connected state shows truncated wallet address.
- [ ] User can disconnect wallet.

---

### US-2: Network Verification
**As a** user,  
**I want the** app to verify I'm on Arc Testnet,  
**So that** I don't accidentally send funds on the wrong network.

**Acceptance Criteria:**
- [ ] App checks chain ID on wallet connection and on every transaction attempt.
- [ ] If chain ID ≠ 5042002, app shows a warning banner with "Switch to Arc Testnet" button.
- [ ] Switch button triggers `wallet_addEthereumChain` / `wallet_switchEthereumChain` with correct Arc Testnet params.
- [ ] Transactions are blocked until user is on Arc Testnet.

---

### US-3: Create Invoice
**As a** freelancer,  
**I want to** create an invoice with client details, amount, and my wallet address,  
**So that** I can request payment from a client.

**Acceptance Criteria:**
- [ ] Form fields: client name (required), client email (optional), description (required), amount in USDC (required, numeric, > 0), recipient wallet address (required, valid Ethereum address), due date (required, future date).
- [ ] Form validates all required fields before submission.
- [ ] Amount input accepts decimal values up to 6 decimal places (ERC-20 precision).
- [ ] Recipient address validated as a valid 0x address (42 characters, hex).
- [ ] On submit, invoice is saved to localStorage with a unique ID and `status: "pending"`.
- [ ] User is redirected to invoice detail page after creation.

---

### US-4: Invoice Storage
**As a** freelancer,  
**I want** my invoices stored locally,  
**So that** I can view them across sessions without a backend.

**Acceptance Criteria:**
- [ ] Invoices persist in localStorage under a namespaced key (`flowbill_invoices`).
- [ ] Each invoice has a unique UUID.
- [ ] Storage operations (get, set, update, delete) are handled by a dedicated hook/utility.
- [ ] App gracefully handles corrupted or missing localStorage data.

---

### US-5: Invoice Dashboard
**As a** freelancer,  
**I want to** see all my invoices in a dashboard,  
**So that** I can track which are pending, paid, or overdue.

**Acceptance Criteria:**
- [ ] Dashboard shows a list/grid of all invoices.
- [ ] Each invoice card shows: client name, amount, status (pending/paid/overdue), due date.
- [ ] Status badges are color-coded (pending: yellow, paid: green, overdue: red).
- [ ] Empty state displayed when no invoices exist with prompt to create one.
- [ ] Clicking an invoice navigates to its detail page.

---

### US-6: Payment Link Generation
**As a** freelancer,  
**I want to** generate a shareable payment link for an invoice,  
**So that** my client can pay without signing up.

**Acceptance Criteria:**
- [ ] Payment link format: `/pay/[invoice-id]`.
- [ ] Link is displayed on invoice detail page with a copy button.
- [ ] Link works for anyone — no wallet connection required to view invoice details.
- [ ] Payment link page shows invoice summary (amount, description, recipient, due date).

---

### US-7: Client Payment
**As a** client,  
**I want to** pay an invoice with USDC on Arc Testnet,  
**So that** the freelancer receives their payment.

**Acceptance Criteria:**
- [ ] Payment page shows invoice details and a "Pay" button.
- [ ] Client must connect wallet before paying.
- [ ] App verifies client is on Arc Testnet before enabling payment.
- [ ] Payment executes a USDC ERC-20 `transfer` call with **6 decimals** precision.
- [ ] Amount sent matches the invoice amount exactly.
- [ ] Recipient address matches the invoice's specified recipient.
- [ ] App shows loading/pending state while transaction is confirming.
- [ ] On confirmation, invoice status updates to "paid" with transaction hash and timestamp.

---

### US-8: Transaction Confirmation
**As a** user (freelancer or client),  
**I want to** see confirmation that a payment went through,  
**So that** I know the transaction succeeded.

**Acceptance Criteria:**
- [ ] App waits for at least 1 block confirmation.
- [ ] On success, displays a success state with transaction hash.
- [ ] On failure, displays error message with reason (insufficient funds, rejected, etc.).
- [ ] Transaction hash is clickable and links to Arc Testnet explorer.

---

### US-9: Receipt Display
**As a** user,  
**I want to** view a payment receipt,  
**So that** I have a record of the completed transaction.

**Acceptance Criteria:**
- [ ] Receipt displays: invoice ID, payer address, recipient address, amount (USDC), transaction hash, paid timestamp, explorer link.
- [ ] Receipt is accessible from the invoice detail page after payment.
- [ ] Explorer link format: `https://testnet.arcscan.app/tx/{txHash}`.
- [ ] Receipt data persists in localStorage with the invoice record.

---

### US-10: Error Handling
**As a** user,  
**I want** clear error messages when something goes wrong,  
**So that** I can understand and resolve issues.

**Acceptance Criteria:**
- [ ] Wrong network → "Please switch to Arc Testnet" with action button.
- [ ] Insufficient USDC balance → "Insufficient USDC balance to complete this payment."
- [ ] Transaction rejected → "Transaction was rejected by your wallet."
- [ ] Transaction failed → "Transaction failed. Please try again." with details.
- [ ] Invalid payment link → "Invoice not found" page.
- [ ] Wallet disconnected mid-flow → prompt to reconnect.

---

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Wallet connection via wagmi (MetaMask + WalletConnect) | P0 |
| FR-2 | Arc Testnet verification (chain ID 5042002) | P0 |
| FR-3 | Add/switch to Arc Testnet programmatically | P0 |
| FR-4 | Invoice creation form with validation | P0 |
| FR-5 | Invoice persistence in localStorage | P0 |
| FR-6 | Invoice dashboard with status indicators | P0 |
| FR-7 | Public payment link generation | P0 |
| FR-8 | USDC ERC-20 transfer (6 decimals) on payment | P0 |
| FR-9 | Transaction confirmation (1+ block) | P0 |
| FR-10 | Receipt display with explorer link | P0 |
| FR-11 | Invoice status transitions (pending → paid / overdue) | P0 |
| FR-12 | Responsive dark UI | P1 |
| FR-13 | Copy payment link to clipboard | P1 |
| FR-14 | Due date overdue detection | P1 |

## Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Page load time | < 2s on 4G |
| NFR-2 | Mobile responsive | Works on 375px+ screens |
| NFR-3 | Accessibility | Semantic HTML, keyboard navigable |
| NFR-4 | No secrets in client code | Zero API keys in bundle |
| NFR-5 | TypeScript strict mode | No `any` types |
| NFR-6 | Graceful degradation | Works with localStorage disabled (shows error) |

---

## Scope Boundaries

### Phase 1 (This Build)
- Client-side only (no backend)
- localStorage for persistence
- USDC ERC-20 transfer on Arc Testnet
- Public payment links (no auth)

### Future Phases (Documented Only)
- **Circle Wallets** — Embedded wallets for non-crypto-native clients
- **Gas Station / Paymaster** — Gasless transactions for payers
- **CCTP** — Cross-chain USDC transfers
- **Webhooks** — Real-time payment notifications
- **Backend** — Server-side invoice storage, authentication, multi-user support
- **Circle API** — Programmable wallets, compliance features
