# Flash Nexus — Financial Rules

**Document Version:** 1.0  
**Last Updated:** June 2026  
**Authority:** Mandatory for all financial module development

---

## 1. Purpose

This document defines the non-negotiable financial rules governing Flash Nexus. Every developer, every module, and every future integration must comply with these rules. They implement the Golden Rules from `PROJECT_OVERVIEW.md` in operational detail.

---

## 2. Core Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Immutability of history** | Financial transactions are never permanently deleted |
| 2 | **Traceability** | Every change has who, what, when, why |
| 3 | **Snapshot integrity** | Rates and rules at transaction time are frozen |
| 4 | **Centralized calculation** | FlashCount Engine is the sole balance mutator |
| 5 | **Configuration over code** | Rules in database tables, not hardcoded |
| 6 | **Human authority** | Approvals require human action; AI suggests only |
| 7 | **Tenant isolation** | All financial data scoped by office_id |

---

## 3. Transaction Lifecycle Rules

### 3.1 Creation

Every transaction MUST record at creation:

```
- transaction_number (auto-generated, unique per office)
- office_id
- transaction_date
- type
- amount, currency_id
- exchange_rate (if applicable)
- exchange_rate_source
- percentage, cut_amount, fees (snapshots from active rules)
- created_by (user_id)
- created_at (timestamp)
- status (draft or pending based on approval rules)
```

### 3.2 Editing

- Edits create an **audit log entry** with old_values and new_values
- `edited_by` and `updated_at` updated on the transaction
- If transaction is **approved**, edit requires:
  - New approval cycle, OR
  - Correction entry (preferred for audit clarity)
- Sensitive field edits (amount, rate, currency) may trigger automatic re-approval requirement

### 3.3 Voiding (Not Deleting)

```
VOID is the only way to "remove" a transaction from active balances.

Void process:
1. Validate transaction is not already voided/reversed
2. Create audit log entry (action: void)
3. Set transaction.status = 'voided'
4. Set transaction.voided_at = now()
5. FlashCount Engine reverses balance impact
6. Require void reason (text field)
7. Require approver if amount exceeds threshold
```

**DELETE FROM transactions** is prohibited in application code and should be blocked at database policy level for production roles.

### 3.4 Reversal Entries

For correcting posted transactions:

```
1. Create NEW transaction with type = 'reversal'
2. Set reversal_of_id = original transaction id
3. Mirror amounts (negative impact)
4. FlashCount Engine posts reversal
5. Optionally create correction entry with correct values
6. Full audit trail links all three records
```

### 3.5 Correction Entries

```
1. New transaction type = 'correction'
2. References original via metadata or notes
3. Contains only the delta (difference amount)
4. Requires approval
5. Audit log links correction to original
```

---

## 4. Audit Log Rules

### 4.1 What Must Be Audited

| Entity / Action | Audit Required |
|-----------------|----------------|
| Transaction create, edit, void, approve, reject | ✅ |
| Quote create, edit, convert, cancel, expire | ✅ |
| Cut rule create, edit, deactivate | ✅ |
| Fee/percentage rule create, edit, deactivate | ✅ |
| Exchange rate manual override | ✅ |
| Account balance manual adjustment | ✅ |
| Approval granted or denied | ✅ |
| Client limit change | ✅ |
| Partnership terms change | ✅ |
| Daily closing approval | ✅ |
| User role/permission change | ✅ |
| Login (optional, configurable) | ⚙️ |

### 4.2 Audit Log Structure

```typescript
// Conceptual — not implementation code
AuditLog {
  id: UUID
  office_id: UUID | null  // null for platform-level
  user_id: UUID
  action: 'create' | 'update' | 'void' | 'approve' | 'reject' | 'rule_change' | ...
  entity_type: string
  entity_id: UUID
  old_values: JSON | null
  new_values: JSON | null
  reason: string | null      // required for voids and rule changes
  ip_address: string
  created_at: timestamp      // immutable
}
```

### 4.3 Audit Log Immutability

- Audit logs are **append-only**
- No UPDATE or DELETE on audit_log table
- Even Super Admin cannot modify audit history
- Audit logs retained for minimum 7 years (configurable per compliance needs)

---

## 5. Balance Update Rules (FlashCount Engine)

### 5.1 Single Point of Mutation

**Only the FlashCount Engine service may update account balances.**

```
Forbidden:
- UI component directly updating account.current_balance
- API route bypassing FlashCount Engine
- Database trigger outside Engine (except audit triggers)

Required flow:
Transaction approved → FlashCountEngine.post(transaction) → Balance updated → Snapshot optional
```

### 5.2 Posting Rules

| Transaction Type | Source Account | Destination Account | Balance Effect |
|------------------|---------------|---------------------|----------------|
| Incoming | External/null | Cash/Bank | +destination |
| Outgoing | Cash/Bank | External/null | -source |
| Remittance | Cash/Bank | Client/Partner payable | -source, +liability |
| Fee | Client/Cash | Income account | Transfer to income |
| Expense | Cash/Bank | Expense account | -source |
| Settlement | Payable | Cash/Bank | -liability, -cash |
| Reversal | Opposite of original | Opposite of original | Reverse original |

### 5.3 Consistency Checks

Before posting, FlashCount Engine MUST verify:

1. Transaction status is `approved` (or auto-approved per rules)
2. Transaction is not voided
3. Source account has sufficient balance (if debit)
4. Currency matches account currency (or conversion rules applied)
5. office_id matches on transaction and all accounts
6. No duplicate posting (idempotency key)

### 5.4 Balance Snapshots

- Created on daily closing
- Created on manual request
- Used for historical reporting without replaying all transactions

---

## 6. Approval Workflow Rules

### 6.1 When Approval Is Required

Configured per office in approval_rules table:

| Trigger | Example |
|---------|---------|
| Amount exceeds threshold | > 10,000 QAR |
| Transaction type | All remittance outgoing |
| Client risk level | risky, under_review |
| Corridor | Specific high-risk routes |
| Negative profit | Quote shows losing transaction |
| Edit on approved record | Any field change |
| Void request | All voids |
| Manual rate override | Any override from corridor default |

### 6.2 Approval States

```
none → pending → approved | rejected

Rules:
- Only users with 'transaction.approve' permission can approve
- Approver cannot be the same as creator (configurable)
- Rejection requires reason
- Approved transactions are posted by FlashCount Engine
- Rejected transactions remain in rejected status (not deleted)
```

### 6.3 Approval Record

```
Transaction stores:
- approval_status
- approved_by (user_id)
- approved_at (timestamp)
- rejection_reason (if rejected)
```

---

## 7. Exchange Rate Rules

### 7.1 Rate Storage

Every rate entry MUST include:

```
- rate value
- currency_pair (e.g., QAR/USD)
- rate_type (reference, buy, sell, execution)
- source (manual, corridor_rule, api_provider_name)
- effective_from (timestamp)
- effective_to (timestamp or null for current)
- created_by
- office_id
```

### 7.2 Rate History

- Changing a rate does NOT update the old record
- Old rate gets `effective_to = now()`
- New rate created with `effective_from = now()`
- Full history queryable for any point in time

### 7.3 Rate on Transactions

- Transaction stores the **exact rate used** at entry time
- Rate is NOT recalculated if corridor rate changes later
- To use new rate: create new transaction or correction

### 7.4 Manual Override

```
1. User enters override rate
2. System shows corridor default vs override
3. Difference highlighted
4. Override reason required
5. Audit log created
6. May trigger approval requirement
```

---

## 8. Quote & Rate Lock Rules

### 8.1 Quote Validity

```
Every quote MUST have:
- valid_from (default: creation time)
- valid_until (calculated from office settings, e.g., 15 minutes, 1 hour, 24 hours)

On expiry:
- status → 'expired'
- rate lock released
- Conversion blocked until recalculation
```

### 8.2 Rate Lock

```
When quote is created with rate_locked = true:
- Exchange rate frozen at quote.exchange_rate
- Corridor rate changes do NOT affect this quote
- Lock valid only within valid_until window
- Lock released on: expiry, cancellation, conversion
```

### 8.3 Quote to Transaction Conversion

```
Pre-conditions:
1. Quote status = 'client_approved' OR 'sent' (per office config)
2. Quote NOT expired (valid_until > now)
3. If expired → require recalculate → new quote or refresh

Conversion process:
1. Create transaction from quote snapshots (rate, cut, fees)
2. Link transaction.quote_id = quote.id
3. Set quote.status = 'converted'
4. Set quote.converted_transaction_id = transaction.id
5. Store calculation_trace on quote for audit
6. Transaction enters normal approval flow
```

### 8.4 Calculation Trace

Every quote stores full calculation breakdown in JSON:

```json
{
  "inputs": { "amount": 5000, "corridor": "QAT-GZA", ... },
  "rate_used": { "value": 0.274, "source": "corridor_rule", "id": "..." },
  "cut_applied": { "type": "tiered", "tier": "1001-5000", "amount": 25 },
  "fees": { "office_fee": 15, "partner_fee": 10 },
  "intermediate": { "gross_receive": 1370, "after_cut": 1345, ... },
  "net_receive": 1320,
  "expected_profit": 45,
  "is_profitable": true
}
```

---

## 9. Cut (قص) Rules

### 9.1 Cut Types Supported

| Type | Description | Example |
|------|-------------|---------|
| fixed | Flat amount deducted | 20 QAR |
| percentage | % of amount or receive | 1.5% |
| tiered | Different cut per amount range | 1-1000: 10, 1001-5000: 25 |
| by_delivery | Cut varies by method | Cash: 30, Bank: 10 |
| by_client | VIP override | VIP: 0 cut |

### 9.2 Cut Rule Priority (Resolution Order)

```
1. Client-specific override (if VIP/trader status)
2. Delivery method specific rule
3. Corridor-specific rule
4. Office default rule
5. Manual override (requires audit + optional approval)
```

### 9.3 Cut Rule Changes

Every change MUST create CutRuleAudit:

```
- cut_rule_id
- changed_by
- old_value (full JSON snapshot)
- new_value (full JSON snapshot)
- reason (required text)
- changed_at
```

### 9.4 Cut on Transactions

- Transaction stores `cut_amount` (calculated result) and `cut_rule_id` (reference)
- Cut is NOT recalculated retroactively on rule changes

---

## 10. Percentage & Fee Rules

### 10.1 Rule Types

| Rule | Applied To |
|------|------------|
| percentage | Sending or receiving amount |
| office_fee | Fixed or % office charge |
| partner_fee | Partner execution cost |
| platform_fee | SaaS platform fee (future) |

### 10.2 Fee Rule Changes

Same audit requirements as Cut Rules (FeeRuleAudit table).

### 10.3 Fee Stacking

```
Calculation order (configurable per office, default):
1. Apply exchange rate → gross receive amount
2. Apply percentage adjustment
3. Apply cut (قص)
4. Deduct office fee
5. Deduct partner fee
6. Deduct platform fee
7. = net receive amount
```

Document the order in office settings. Changes to order are audited.

---

## 11. Profit Calculation

### 11.1 Net Profit Formula

```
expected_profit =
    office_fee
  + exchange_rate_spread_gain
  - partner_fee
  - platform_fee
  - cut_cost (if cut reduces office margin)
  - direct_expenses (linked expenses)
```

### 11.2 Profit Classification

| Classification | Condition |
|----------------|-----------|
| Profitable | expected_profit > profit_threshold |
| Weak profit | 0 < expected_profit <= profit_threshold |
| Break-even | expected_profit = 0 |
| Losing | expected_profit < 0 |

`profit_threshold` configurable per office (default: office currency equivalent of 5 units).

### 11.3 Losing Transaction Handling

- Display clear warning in calculator and transaction form
- May require manager approval per approval_rules
- FlashAudit Center flags for review (post-MVP)

---

## 12. Multi-Currency Rules

### 12.1 Account Currency

- Each account has ONE primary currency
- Transactions must specify currency_id
- Cross-currency transactions use exchange_rate for conversion

### 12.2 Conversion

```
If source currency ≠ destination currency:
- exchange_rate required
- Both legs recorded in TransactionLine (future) or metadata
- FlashCount Engine converts using snapshot rate
```

---

## 13. Financial Safety Checklist

Before any financial feature ships:

- [ ] No DELETE on transactions table in application code
- [ ] Audit log on every mutation
- [ ] created_by, edited_by populated
- [ ] FlashCount Engine is sole balance updater
- [ ] Rates and rules snapshotted on transactions/quotes
- [ ] Quote expiry enforced
- [ ] Approval workflow respected
- [ ] office_id on every query
- [ ] Void/reversal creates linked records
- [ ] Rule changes create audit entries
- [ ] Profit calculation uses centralized service
- [ ] Manual overrides require reason

---

## 14. Anti-Patterns (Forbidden)

| Anti-Pattern | Why Forbidden |
|--------------|---------------|
| `DELETE FROM transactions` | Destroys audit trail |
| Balance update in React component | Bypasses engine, causes inconsistency |
| Hardcoded cut percentage in UI | Cannot audit or configure |
| Skipping approval for "small" amounts without rule | Inconsistent policy |
| AI auto-approving transactions | Violates human authority rule |
| Recalculating old transaction rates | Distorts historical accuracy |
| Cross-tenant queries without office_id filter | Data leakage |
| Storing only current rate without history | Cannot verify past transactions |

---

*These rules are the financial constitution of Flash Nexus. No exception without documented architecture decision and product owner approval.*
