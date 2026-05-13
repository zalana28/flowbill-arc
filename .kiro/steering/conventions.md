# FlowBill Arc — Code Conventions

## File & Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Dashboard / home
│   ├── create/             # Create invoice page
│   ├── invoice/[id]/       # Invoice detail / receipt
│   └── pay/[id]/           # Public payment page
├── components/             # Reusable UI components
│   ├── ui/                 # Primitive UI (buttons, cards, inputs)
│   └── invoice/            # Invoice-specific components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility modules
│   ├── constants.ts        # Network, token, app constants
│   ├── blockchain.ts       # Viem/wagmi utilities
│   ├── storage.ts          # localStorage helpers
│   └── utils.ts            # General utilities
├── types/                  # TypeScript type definitions
└── providers/              # Context providers (wagmi, etc.)
```

## Naming Conventions

- **Files:** kebab-case (`invoice-card.tsx`, `use-invoices.ts`)
- **Components:** PascalCase (`InvoiceCard`, `PaymentForm`)
- **Hooks:** camelCase with `use` prefix (`useInvoices`, `useNetwork`)
- **Constants:** UPPER_SNAKE_CASE (`ARC_TESTNET_CHAIN_ID`, `USDC_DECIMALS`)
- **Types/Interfaces:** PascalCase (`Invoice`, `PaymentStatus`)

## TypeScript

- Strict mode enabled
- No `any` types — use `unknown` when type is uncertain
- All component props typed with interfaces
- All hook return types explicitly typed
- Prefer `interface` for object shapes, `type` for unions/intersections

## Component Patterns

- Functional components only
- Props destructured in function signature
- Default exports for page components
- Named exports for shared components
- Co-locate component-specific types in the same file

## State Management

- React state + hooks for local state
- localStorage for invoice persistence (MVP)
- No global state library needed for Phase 1

## Error Handling

- All blockchain calls wrapped in try/catch
- User-facing error messages (no raw error objects)
- Network errors surface a "switch network" prompt
- Transaction errors show clear failure reason

## Styling

- Tailwind CSS utility classes
- No CSS modules or styled-components
- Consistent spacing scale (Tailwind defaults)
- Dark theme as primary (use `dark:` variants or set as default)

## Git Practices

- Feature branches off `main`
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- PR per feature/task group
