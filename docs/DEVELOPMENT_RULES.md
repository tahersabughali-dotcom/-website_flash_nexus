# Flash Nexus — Development Rules

**Document Version:** 1.0  
**Last Updated:** June 2026  
**Authority:** Mandatory for all code contributions

---

## 1. Architecture Principles

### 1.1 Modular SaaS Architecture

```
Each module is a bounded context:
- Own routes/pages
- Own services (business logic)
- Own types
- Shared: auth, UI components, database client, utils

Modules communicate through services, not direct database access from UI.
```

### 1.2 Separation of Concerns

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Pages/Routes** | Layout, data fetching orchestration | `app/` |
| **Components** | UI rendering, user interaction | `components/` |
| **Services** | Business logic, calculations, rules | `lib/services/` |
| **Repositories** | Database queries (optional layer) | `lib/repositories/` |
| **Types** | TypeScript interfaces and enums | `lib/types/` |
| **Validators** | Zod schemas for input validation | `lib/validators/` |
| **Hooks** | Reusable React state/effects | `hooks/` |
| **Utils** | Pure helper functions | `lib/utils/` |

### 1.3 Golden Rule: No Business Logic in UI

```typescript
// ❌ FORBIDDEN — calculation in component
const profit = amount * rate - cut - fee;

// ✅ REQUIRED — calculation in service
const result = await PricingCalculatorService.calculate(input);
```

---

## 2. Folder Structure

```
flash-nexus/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public layout group
│   │   ├── page.tsx              # Landing
│   │   ├── offices/              # Directory
│   │   ├── register/
│   │   └── login/
│   ├── (auth)/                   # Authenticated layout group
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── clients/
│   │   ├── pricing/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── partners/
│   ├── api/                      # API routes (if needed)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── layout/                   # Sidebar, Topbar, Shell
│   ├── forms/                    # Reusable form components
│   ├── tables/                   # Data table components
│   ├── financial/                # Amount display, profit badge
│   └── modules/                  # Module-specific components
│       ├── dashboard/
│       ├── transactions/
│       ├── pricing/
│       └── ...
├── lib/
│   ├── services/                 # Business logic
│   │   ├── flashcount/           # Balance engine
│   │   ├── pricing/              # Remittance pricing
│   │   ├── quotes/
│   │   ├── transactions/
│   │   ├── audit/
│   │   └── permissions/
│   ├── repositories/             # Data access (optional)
│   ├── supabase/                 # Supabase client, types
│   ├── types/                    # Shared TypeScript types
│   ├── validators/               # Zod schemas
│   ├── constants/                # Enums, config constants
│   └── utils/                    # Pure utilities
├── hooks/                        # Custom React hooks
├── docs/                         # Project documentation (symlink or copy)
├── supabase/
│   └── migrations/               # Database migrations
├── public/                       # Static assets
├── .env.example
├── CHANGELOG.md
├── package.json
└── tsconfig.json
```

---

## 3. TypeScript Standards

### 3.1 Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 3.2 Type Conventions

| Convention | Example |
|------------|---------|
| Interfaces for entities | `interface Transaction { ... }` |
| Types for unions/primitives | `type TransactionStatus = 'draft' \| 'pending' \| ...` |
| Enums for fixed sets | `enum TransactionType { INCOMING = 'incoming', ... }` |
| Suffix DTOs | `CreateTransactionDTO`, `QuoteCalculationResult` |
| Prefix hooks | `useTransactions`, `useQuoteCalculator` |
| Suffix services | `TransactionService`, `PricingCalculatorService` |

### 3.3 No `any`

- Use `unknown` and narrow with type guards
- Generate Supabase types: `supabase gen types typescript`
- Zod for runtime validation at API boundaries

---

## 4. Naming Conventions

### 4.1 Files

| Type | Convention | Example |
|------|------------|---------|
| React component | PascalCase.tsx | `TransactionForm.tsx` |
| Service | kebab-case.service.ts | `pricing-calculator.service.ts` |
| Hook | use-kebab-case.ts | `use-transactions.ts` |
| Type | kebab-case.types.ts | `transaction.types.ts` |
| Validator | kebab-case.schema.ts | `transaction.schema.ts` |
| Migration | timestamp_description.sql | `20260618_create_transactions.sql` |
| Page | page.tsx (Next.js convention) | `app/transactions/page.tsx` |

### 4.2 Database

| Element | Convention | Example |
|---------|------------|---------|
| Tables | snake_case, plural | `transactions`, `cut_rules` |
| Columns | snake_case | `office_id`, `created_at` |
| Foreign keys | `{table}_id` | `client_id`, `quote_id` |
| Indexes | `idx_{table}_{columns}` | `idx_transactions_office_date` |
| Enums | snake_case | `transaction_status` |

### 4.3 API / Services

| Element | Convention | Example |
|---------|------------|---------|
| Service methods | verbNoun | `createTransaction`, `calculateQuote` |
| Route paths | kebab-case | `/api/transactions`, `/pricing/calculator` |
| Query params | snake_case | `?office_id=...&status=pending` |

---

## 5. Business Logic Rules

### 5.1 Centralized Financial Services

| Service | Responsibility |
|---------|---------------|
| `FlashCountEngine` | Balance updates, posting, snapshots |
| `PricingCalculatorService` | Remittance price calculation |
| `QuoteService` | Quote lifecycle, rate lock, conversion |
| `TransactionService` | CRUD, void, reversal, approval |
| `AuditService` | Audit log creation (called by all services) |
| `PermissionService` | Role/permission checks |

### 5.2 No Hardcoded Financial Rules

```typescript
// ❌ FORBIDDEN
const CUT_AMOUNT = 25;
const PROFIT_THRESHOLD = 5;

// ✅ REQUIRED
const cutRule = await CutRuleService.resolveForCorridor(corridorId, amount);
const threshold = await OfficeSettingsService.get('profit_threshold');
```

### 5.3 Configuration Tables

All configurable rules live in database:

- `corridors` — country price lists
- `exchange_rates` — rate history
- `cut_rules` — قص rules
- `fee_rules` — fee and percentage rules
- `approval_rules` — when approval required
- `office_settings` — office-level config JSON

---

## 6. Permission Checks

### 6.1 Server-Side Enforcement

```typescript
// Every service method that mutates data:
async createTransaction(input: CreateTransactionDTO, userId: string) {
  const member = await PermissionService.requireOfficeMember(userId, input.officeId);
  PermissionService.requirePermission(member, 'transaction.create');
  // ... proceed
}
```

### 6.2 Never UI-Only Permissions

```typescript
// ❌ FORBIDDEN — button hidden but API open
{canApprove && <ApproveButton />}

// ✅ REQUIRED — button hidden AND server checks
{canApprove && <ApproveButton />}
// + in service: PermissionService.requirePermission(member, 'transaction.approve')
```

### 6.3 Tenant Isolation

Every database query MUST include `office_id` filter:

```typescript
// ✅ REQUIRED
const transactions = await supabase
  .from('transactions')
  .select('*')
  .eq('office_id', officeId);
```

---

## 7. Audit Logging

### 7.1 When to Audit

Every service method that creates, updates, voids, or approves financial records MUST call `AuditService.log()`.

### 7.2 Audit Pattern

```typescript
// After successful mutation:
await AuditService.log({
  officeId,
  userId,
  action: 'create',
  entityType: 'transaction',
  entityId: transaction.id,
  newValues: transaction,
  ipAddress: request.ip,
});
```

### 7.3 Audit Service Is Append-Only

No update or delete methods on AuditService.

---

## 8. Component Guidelines

### 8.1 Reusable Components

Build once, use everywhere:

| Component | Usage |
|-----------|-------|
| `<AmountDisplay>` | Formatted currency amount with color |
| `<ProfitBadge>` | Profitable/losing indicator |
| `<VerificationBadge>` | Office/service verification status |
| `<StatusBadge>` | Transaction/quote status |
| `<PageHeader>` | Title + description + action |
| `<EmptyState>` | No data placeholder |
| `<ConfirmDialog>` | Destructive action confirmation |
| `<DataTable>` | Paginated, sortable table |

### 8.2 Form Pattern

```typescript
// react-hook-form + zod + shadcn Form components
const form = useForm<CreateTransactionDTO>({
  resolver: zodResolver(createTransactionSchema),
});

// Submit calls service, not direct DB
const onSubmit = async (data) => {
  await TransactionService.create(data, userId);
};
```

---

## 9. Database & Migrations

### 9.1 Migration Rules

1. All schema changes via migration files in `supabase/migrations/`
2. Migrations are forward-only (no rollback scripts in production)
3. Add columns before using them (backward compatible)
4. Never drop columns in same release they're deprecated
5. Name: `YYYYMMDDHHMMSS_description.sql`

### 9.2 Migration Safety

```sql
-- ✅ Safe: add nullable column
ALTER TABLE transactions ADD COLUMN partner_fee DECIMAL;

-- ❌ Unsafe: drop column in same release
ALTER TABLE transactions DROP COLUMN old_field;

-- ✅ Safe: deprecate over 2 releases
-- Release 1: stop writing to old_field
-- Release 2: drop old_field
```

### 9.3 Row Level Security

- Enable RLS on all tenant tables
- Policies check `office_id` membership
- Service role key only in server-side code, never client

---

## 10. Error Handling

### 10.1 Service Errors

```typescript
// Custom error classes
class InsufficientBalanceError extends Error { ... }
class QuoteExpiredError extends Error { ... }
class PermissionDeniedError extends Error { ... }

// Services throw typed errors
// API routes / server actions catch and return appropriate HTTP status
```

### 10.2 User-Facing Errors

- Clear, actionable messages in Arabic and English
- Never expose stack traces or internal details
- Log full error server-side

---

## 11. Testing Strategy

### 11.1 Priority

| Priority | What to Test |
|----------|-------------|
| P0 | FlashCount Engine balance calculations |
| P0 | PricingCalculatorService (all cut tiers, fees) |
| P0 | Quote expiry and conversion |
| P1 | Permission checks |
| P1 | Audit log creation |
| P2 | UI component rendering |

### 11.2 Test Location

```
lib/services/__tests__/
  flashcount.engine.test.ts
  pricing-calculator.service.test.ts
  quote.service.test.ts
```

---

## 12. Environment Variables

```bash
# .env.example (never commit real values)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # Server only
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_ENV=development   # development | staging | production
```

- `NEXT_PUBLIC_*` = safe for client
- Service role key = server-side only, never in client bundle

---

## 13. Git Workflow

| Branch | Purpose |
|--------|---------|
| `main` | Production |
| `develop` | Staging integration |
| `feature/module-name` | Feature work |
| `hotfix/description` | Production fixes |

### Commit Messages

```
feat(transactions): add void workflow with audit log
fix(pricing): correct tier boundary for cut rules
docs: update financial rules for quote expiry
chore: add migration for cut_rules table
```

---

## 14. Code Review Checklist

Before merging any PR:

- [ ] No business logic in UI components
- [ ] Financial changes go through appropriate service
- [ ] Audit log called for mutations
- [ ] Permission check server-side
- [ ] office_id on all tenant queries
- [ ] No hardcoded financial values
- [ ] TypeScript strict, no `any`
- [ ] Migration included if schema changed
- [ ] No DELETE on financial tables
- [ ] RTL-safe if UI changed

---

## 15. Feature Flags

```typescript
// lib/constants/feature-flags.ts
export const FEATURES = {
  AI_PRICING: false,
  DEAL_TICKETS: false,
  CASH_SHIFTS: false,
  PARTNER_SETTLEMENTS: false,
} as const;

// Usage
if (FEATURES.AI_PRICING) { ... }
```

Unfinished modules hidden behind flags until ready.

---

## 16. Supabase Usage Rules

These rules apply from Phase 2A onward. See also `docs/PHASE_2A_SUPABASE_PREP.md`.

| Rule | Requirement |
|------|-------------|
| **Client vs server** | Use `lib/supabase/client.ts` in Client Components only; use `lib/supabase/server.ts` in Server Components, Server Actions, and Route Handlers |
| **No service role in browser** | Never import `lib/supabase/admin.ts` from client code; `SUPABASE_SERVICE_ROLE_KEY` must not use `NEXT_PUBLIC_*` |
| **RLS for tenant isolation** | All user-facing queries use anon/authenticated role with Row Level Security — never rely on UI-only checks |
| **No RLS bypass for users** | Do not use the admin client for normal office or user operations |
| **Admin client scope** | `lib/supabase/admin.ts` is for controlled server-side platform tasks only (Super Admin, migrations, system jobs) |
| **Env safety** | Copy `.env.example` to `.env.local`; never commit secrets |
| **Types after migrations** | Regenerate `lib/supabase/types.ts` after every schema change (Phase 2B+) |
| **Lazy failure** | Supabase utilities throw at **use time** if env is missing — do not import-and-call at module top level in pages that must static-build |

---

*These rules exist so a non-programmer can continue development safely with AI assistance. Follow them consistently.*
