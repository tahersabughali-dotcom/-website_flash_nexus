# Flash Nexus — Conceptual Data Model

**Document Version:** 1.0  
**Last Updated:** June 2026  
**Note:** This is a **conceptual** model. Final SQL schemas and migrations will be created in Phase 2+.

---

## 1. Modeling Principles

1. **Multi-tenant by design** — virtually every business entity belongs to an `office_id`
2. **Audit everything financial** — separate audit log entities, not just column timestamps
3. **No hard deletes on financial records** — use `status`, `voided_at`, `reversal_of_id`
4. **Snapshot rates and rules** — transactions and quotes store values at time of creation
5. **Configuration vs. transaction data** — rules live in config tables; transactions snapshot them
6. **Extensibility** — JSON metadata columns where appropriate for future fields without breaking migrations

---

## 2. Entity Relationship Overview

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Platform  │────►│      Office      │────►│   Branch    │
│  (SaaS)     │     │   (Tenant)       │     │  (optional) │
└─────────────┘     └────────┬─────────┘     └─────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐   ┌─────────────────┐   ┌──────────────┐
│ OfficeMember  │   │     Client      │   │   Account    │
│ (User+Role)   │   │                 │   │ (Chart)      │
└───────────────┘   └────────┬────────┘   └──────┬───────┘
                             │                    │
                             ▼                    ▼
                    ┌─────────────────┐   ┌──────────────┐
                    │   Transaction   │◄──│   Balance    │
                    │                 │   │  Snapshot    │
                    └────────┬────────┘   └──────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────────┐
        │  Quote   │  │ Invoice  │  │  Attachment  │
        └──────────┘  └──────────┘  └──────────────┘

┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Client    │────►│  ServiceRequest  │     │ Partnership │
│  (global)   │     │  / QuoteRequest  │     │  (office↔office)│
└─────────────┘     └──────────────────┘     └─────────────┘
```

---

## 3. Platform & Tenancy Entities

### 3.1 User
Global platform user account (Supabase Auth linked).

| Attribute | Description |
|-----------|-------------|
| id | UUID (matches auth.users) |
| email | Login email |
| full_name | Display name |
| phone | Optional |
| avatar_url | Optional |
| preferred_language | ar, en |
| account_type | client, office_staff, super_admin |
| created_at | Timestamp |
| updated_at | Timestamp |

**Relationships:** One user → many OfficeMembers; one user → one ClientProfile (if client)

---

### 3.2 Office (Tenant)
The core tenant entity.

| Attribute | Description |
|-----------|-------------|
| id | UUID |
| commercial_name | Public business name |
| legal_name | Legal entity name |
| slug | URL-friendly identifier |
| country | Office country |
| city | Office city |
| contact_email | Business email |
| contact_phone | Business phone |
| description | Public description |
| logo_url | Branding |
| verification_status | unverified, under_review, partially_verified, fully_verified, approved_partner, suspended |
| public_visibility | hidden, public, partners_only |
| partner_search_enabled | Boolean |
| subscription_plan | basic, pro, enterprise |
| settings | JSON (office-level config) |
| created_at | Timestamp |
| updated_at | Timestamp |

**Relationships:** One office → many branches, members, clients, accounts, transactions, rules

---

### 3.3 Branch
Optional sub-location within an office.

| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| name | Branch name |
| country, city | Location |
| is_active | Boolean |
| created_at | Timestamp |

---

### 3.4 OfficeMember
Links users to offices with roles.

| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| user_id | FK → User |
| role | owner, financial_manager, accountant, cashier, auditor |
| permissions | JSON override (optional) |
| is_active | Boolean |
| invited_by | FK → User |
| joined_at | Timestamp |

---

### 3.5 Role & Permission (Reference)
Configurable permission matrix (may be seeded, extended later).

| Entity | Description |
|--------|-------------|
| Role | Named role with default permissions |
| Permission | Atomic action (e.g., `transaction.create`, `quote.approve`) |
| RolePermission | Many-to-many mapping |

---

## 4. Client Entities

### 4.1 Client (Office-Scoped)
A client belonging to an office.

| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| client_number | Auto-generated per office |
| type | individual, business |
| full_name / business_name | Name |
| phone, email | Contact |
| country | Default country |
| default_currency | FK → Currency |
| status | active, needs_followup, vip, trader, risky, suspended, under_review |
| risk_level | low, medium, high |
| credit_limit | Decimal (optional) |
| daily_limit | Decimal (optional) |
| internal_notes | Text (office only) |
| linked_user_id | FK → User (if registered client) |
| created_by | FK → User |
| created_at | Timestamp |
| updated_at | Timestamp |

---

### 4.2 ClientProfile (Global — for registered clients)
Platform-level client identity for marketplace.

| Attribute | Description |
|-----------|-------------|
| id | UUID |
| user_id | FK → User |
| full_name | Name |
| country | Country |
| phone | Contact |
| created_at | Timestamp |

---

## 5. Financial Entities

### 5.1 Currency
Per-office or platform-wide currency definition.

| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office (null = platform default) |
| code | ISO code (USD, QAR, ILS, EGP) |
| name | Display name |
| symbol | $, ر.ق, etc. |
| decimal_places | Integer |
| is_active | Boolean |

---

### 5.2 Account (Chart of Accounts)
| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| parent_id | FK → Account (hierarchy) |
| code | Account code |
| name | Account name |
| type | asset, liability, equity, income, expense |
| subtype | cash, bank, client_receivable, partner_payable, etc. |
| currency_id | FK → Currency |
| client_id | FK → Client (if client sub-account) |
| current_balance | Decimal (maintained by FlashCount) |
| is_active | Boolean |
| created_at | Timestamp |

---

### 5.3 Transaction
Central financial record.

| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| branch_id | FK → Branch (optional) |
| transaction_number | Auto-generated per office |
| type | incoming, outgoing, remittance, internal_transfer, fee, expense, settlement, platform_fee, exchange_diff, pending, imported, correction, reversal |
| status | draft, pending, approved, voided, reversed |
| transaction_date | Business date |
| client_id | FK → Client (optional) |
| origin_country | Country code |
| destination_country | Country/region code |
| amount | Primary amount |
| currency_id | FK → Currency |
| source_account_id | FK → Account |
| destination_account_id | FK → Account |
| exchange_rate | Decimal (snapshot) |
| exchange_rate_source | manual, corridor_rule, quote_lock, api |
| percentage | Applied percentage (snapshot) |
| cut_amount | قص amount (snapshot) |
| cut_rule_id | FK → CutRule (reference) |
| office_fee | Decimal |
| platform_fee | Decimal |
| partner_fee | Decimal |
| net_profit | Calculated at posting |
| quote_id | FK → Quote (if from quote) |
| partner_office_id | FK → Office (if partner execution) |
| delivery_method | cash, bank, usdt, wallet, partner |
| notes | Text |
| approval_status | none, pending, approved, rejected |
| approved_by | FK → User |
| approved_at | Timestamp |
| created_by | FK → User |
| edited_by | FK → User |
| created_at | Timestamp |
| updated_at | Timestamp |
| voided_at | Timestamp (if voided) |
| reversal_of_id | FK → Transaction (if reversal) |
| metadata | JSON |

**Rule:** Never DELETE. Void or reverse only.

---

### 5.4 TransactionLine (Optional — for multi-line journal entries)
| Attribute | Description |
|-----------|-------------|
| id | UUID |
| transaction_id | FK → Transaction |
| account_id | FK → Account |
| debit | Decimal |
| credit | Decimal |
| currency_id | FK → Currency |
| description | Text |

---

### 5.5 BalanceSnapshot
Point-in-time balance for reporting.

| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| account_id | FK → Account |
| balance | Decimal |
| currency_id | FK → Currency |
| snapshot_type | daily_close, manual, system |
| snapshot_at | Timestamp |
| created_by | FK → User |

---

## 6. Pricing & Quote Entities

### 6.1 Corridor (Country Price List Entry)
| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| origin_country | Country code |
| destination_country | Region/country code |
| sending_currency_id | FK → Currency |
| receiving_currency_id | FK → Currency |
| delivery_method | cash, bank, usdt, wallet, partner |
| is_active | Boolean |
| min_amount | Decimal |
| max_amount | Decimal |
| execution_time_estimate | Hours/days |
| requires_approval | Boolean |
| requires_partner | Boolean |
| created_at | Timestamp |

---

### 6.2 ExchangeRate
| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| corridor_id | FK → Corridor (optional) |
| currency_pair | e.g., QAR/USD |
| rate_type | reference, buy, sell, execution |
| rate | Decimal |
| source | manual, api_wise, api_binance, corridor_rule |
| effective_from | Timestamp |
| effective_to | Timestamp (null = current) |
| created_by | FK → User |
| created_at | Timestamp |

---

### 6.3 CutRule (قص)
| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| corridor_id | FK → Corridor (optional) |
| name | Rule name |
| cut_type | fixed, percentage, tiered |
| value | Decimal (for fixed/percentage) |
| tiers | JSON [{min, max, cut_value}] |
| delivery_method | Optional filter |
| client_status | Optional VIP filter |
| is_active | Boolean |
| created_at | Timestamp |

---

### 6.4 CutRuleAudit
| Attribute | Description |
|-----------|-------------|
| id | UUID |
| cut_rule_id | FK → CutRule |
| changed_by | FK → User |
| old_value | JSON snapshot |
| new_value | JSON snapshot |
| reason | Text |
| changed_at | Timestamp |

---

### 6.5 FeeRule / PercentageRule
| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| corridor_id | FK → Corridor (optional) |
| rule_type | percentage, fixed_fee, office_fee, partner_fee |
| value | Decimal |
| tiers | JSON (optional) |
| is_active | Boolean |

*FeeRuleAudit mirrors CutRuleAudit structure.*

---

### 6.6 Quote
| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| quote_number | Auto-generated |
| client_id | FK → Client (optional) |
| corridor_id | FK → Corridor |
| origin_country | Snapshot |
| destination_country | Snapshot |
| sending_amount | Decimal |
| sending_currency_id | FK → Currency |
| receiving_amount | Calculated net |
| receiving_currency_id | FK → Currency |
| exchange_rate | Locked rate |
| percentage | Snapshot |
| cut_amount | Snapshot |
| office_fee | Snapshot |
| partner_fee | Snapshot |
| expected_profit | Calculated |
| is_profitable | Boolean |
| delivery_method | Snapshot |
| partner_office_id | FK → Office (optional) |
| status | draft, sent, client_approved, expired, converted, cancelled |
| valid_from | Timestamp |
| valid_until | Timestamp |
| rate_locked | Boolean |
| rate_locked_at | Timestamp |
| converted_transaction_id | FK → Transaction |
| created_by | FK → User |
| created_at | Timestamp |
| calculation_trace | JSON (full calculation breakdown) |

---

## 7. Document Entities

### 7.1 Invoice
| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| invoice_number | Auto-generated |
| client_id | FK → Client |
| transaction_id | FK → Transaction (optional) |
| quote_id | FK → Quote (optional) |
| amount | Decimal |
| currency_id | FK → Currency |
| status | draft, issued, paid, voided |
| issued_at | Timestamp |
| due_at | Timestamp (optional) |
| pdf_url | Storage URL |
| created_by | FK → User |

---

### 7.2 Receipt
Similar structure to Invoice, linked to transaction.

---

### 7.3 Attachment
| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| attachable_type | transaction, client, invoice, office, partnership |
| attachable_id | UUID |
| file_name | Original name |
| file_url | Storage URL |
| file_type | MIME type |
| uploaded_by | FK → User |
| uploaded_at | Timestamp |

---

## 8. Audit Entities

### 8.1 AuditLog
Immutable record of all significant actions.

| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office (null for platform actions) |
| user_id | FK → User |
| action | create, update, void, approve, reject, login, rule_change |
| entity_type | transaction, quote, cut_rule, client, etc. |
| entity_id | UUID |
| old_values | JSON |
| new_values | JSON |
| ip_address | String |
| user_agent | String |
| created_at | Timestamp |

**Rule:** AuditLog records are never updated or deleted.

---

## 9. Marketplace & Network Entities

### 9.1 OfficeService
Services an office offers.

| Attribute | Description |
|-----------|-------------|
| id | UUID |
| office_id | FK → Office |
| service_type | remittance, cash_delivery, usdt, wise, bank_transfer, etc. |
| name | Display name |
| corridors | JSON array of supported routes |
| currencies | JSON array |
| delivery_methods | JSON array |
| verification_status | available_verified, available_unverified, under_review, suspended, not_available, high_risk |
| visibility | public, partners_only, internal, hidden |
| trust_score | Decimal (future, nullable) |
| is_active | Boolean |

---

### 9.2 Partnership
| Attribute | Description |
|-----------|-------------|
| id | UUID |
| requesting_office_id | FK → Office |
| receiving_office_id | FK → Office |
| status | pending, accepted, rejected, active, suspended, terminated |
| enabled_services | JSON |
| enabled_corridors | JSON |
| partner_fees | JSON |
| limits | JSON |
| settlement_rules | JSON |
| requested_by | FK → User |
| accepted_by | FK → User |
| created_at | Timestamp |
| updated_at | Timestamp |

---

### 9.3 ServiceRequest / QuoteRequest (Client → Office)
| Attribute | Description |
|-----------|-------------|
| id | UUID |
| client_user_id | FK → User |
| office_id | FK → Office |
| request_type | quote, service |
| origin_country | Country |
| destination_country | Country |
| amount | Decimal |
| sending_currency | Currency code |
| receiving_currency | Currency code |
| delivery_method | Method |
| status | pending, quoted, accepted, rejected, completed, cancelled |
| linked_quote_id | FK → Quote |
| message | Text |
| created_at | Timestamp |

---

## 10. Operations Entities (Post-MVP)

### 10.1 CashShift
| id, office_id, cashier_id, opened_at, closed_at, opening_balance, closing_balance, difference, status, approved_by |

### 10.2 DailyClosing
| id, office_id, closing_date, opening_balance, total_in, total_out, profit, loss, closing_balance, cash_difference, status, approved_by |

### 10.3 Settlement
| id, office_id, type (client/partner/platform), counterparty_id, amount, currency_id, status, aging_bucket |

### 10.4 DealTicket (Future)
| id, requesting_office_id, executing_office_id, client_id, amount, status, settlement_id |

---

## 11. Platform Entities

### 11.1 Subscription
| office_id, plan, status, limits (users, clients, branches, storage), started_at, expires_at |

### 11.2 FeatureFlag
| key, enabled_globally, enabled_office_ids (JSON), description |

### 11.3 SystemRelease (Future)
| version, deployed_at, environment, migration_ids, changelog |

---

## 12. Key Relationships Summary

| From | To | Cardinality | Notes |
|------|-----|-------------|-------|
| Office | Client | 1:N | Tenant isolation |
| Office | Account | 1:N | Chart of accounts |
| Office | Transaction | 1:N | All financial activity |
| Client | Transaction | 1:N | Optional link |
| Transaction | Quote | N:1 | Quote conversion |
| Corridor | CutRule | 1:N | Pricing rules |
| Corridor | FeeRule | 1:N | Fee rules |
| Office | OfficeService | 1:N | Marketplace listing |
| Office | Partnership | N:N | Via Partnership entity |
| User | OfficeMember | 1:N | Multi-office staff |
| Transaction | AuditLog | 1:N | Full trail |
| Transaction | Attachment | 1:N | Supporting docs |

---

## 13. Indexing Strategy (Conceptual)

- All tables: index on `office_id`
- Transactions: index on `(office_id, transaction_date)`, `(office_id, status)`, `(office_id, client_id)`
- Quotes: index on `(office_id, status)`, `(office_id, valid_until)`
- AuditLog: index on `(office_id, entity_type, entity_id)`, `(office_id, created_at)`
- ExchangeRate: index on `(office_id, currency_pair, effective_from)`

---

## 14. Missing Logic Identified

| Gap | Resolution |
|-----|------------|
| Branch-level balance isolation | Accounts optionally scoped to branch_id |
| Multi-currency transaction with conversion | TransactionLine supports per-currency legs |
| Partner office as counterparty | partner_office_id on transaction + settlement entity |
| Client owing office vs office owing client | Account subtype + settlement direction |
| Platform fee tracking | Separate account type + transaction type |
| Quote recalculation on expiry | Service logic, not schema — status transition |
| Rate lock conflict with live rate change | Quote stores locked rate; recalc only on new quote |

---

*Final schemas will be derived from this model during Phase 2 migrations. All changes via forward-only migrations.*
