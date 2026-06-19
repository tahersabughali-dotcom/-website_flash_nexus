# Flash Nexus — Remittance Pricing Center (FlashQuote)

**Internal Module Name:** FlashQuote / Remittance Pricing Center  
**Document Version:** 1.0  
**Last Updated:** June 2026  
**Priority:** MVP Critical Path

---

## 1. Module Purpose

The Remittance Pricing Center enables **office managers** to calculate customer remittance prices **instantly** without depending on accountants. It is one of the highest-value MVP features.

> "What is the current price for Qatar to Gaza? What will the receiver get? Is this profitable?"

This module answers these questions in seconds with full traceability.

---

## 2. Core Capabilities

| Capability | MVP | Future |
|------------|-----|--------|
| Corridor-based price lists | ✅ | |
| Variable exchange rates | ✅ Manual | API feeds |
| Variable percentages | ✅ | |
| Cut (قص) rules with tiers | ✅ | |
| Office and partner fees | ✅ | |
| Quote generation | ✅ | |
| Rate lock | ✅ | |
| Quote validity period | ✅ | |
| Expected profit/loss display | ✅ | |
| Convert quote → transaction | ✅ | |
| Best route finder | Manual selection | Automated ranking |
| Client-facing quote sharing | Basic | Full portal |
| AI pricing suggestions | ❌ | Phase 8 |

---

## 3. Worked Example: Qatar → Gaza

### 3.1 Scenario

A customer walks into an exchange office in **Doha, Qatar**. They want to send **5,000 QAR** to family in **Gaza**. The receiver should get cash in **USD** via partner office cash delivery.

### 3.2 Manager Input

| Field | Value |
|-------|-------|
| Origin country | Qatar (QAT) |
| Destination | Gaza (GZA) |
| Sending amount | 5,000 |
| Sending currency | QAR |
| Receiving currency | USD |
| Delivery method | Cash delivery (partner) |
| Client type | Regular (not VIP) |
| Partner office | Gaza Partner Office X (optional) |

### 3.3 System Lookup Chain

```
1. Find active Corridor: QAT → GZA, QAR → USD, cash_delivery
2. Load current ExchangeRate for QAR/USD (execution rate)
3. Load active PercentageRule for corridor
4. Load active CutRule for corridor + amount tier
5. Load FeeRules (office_fee, partner_fee)
6. Check approval requirements
7. Calculate
```

### 3.4 Sample Calculation (Illustrative)

```
INPUT:
  Sending amount:     5,000.00 QAR
  Exchange rate:      1 QAR = 0.2740 USD (source: corridor_rule, manual entry)
  
STEP 1 — Gross conversion:
  5,000 × 0.2740 = 1,370.00 USD

STEP 2 — Percentage adjustment (e.g., -0.5%):
  1,370.00 × (1 - 0.005) = 1,363.15 USD

STEP 3 — Cut (قص) tier (1,001–5,000 → 25 USD fixed):
  1,363.15 - 25.00 = 1,338.15 USD

STEP 4 — Fees:
  Office fee:    15.00 QAR (converted: 15 × 0.2740 = 4.11 USD deducted from receive side)
  Partner fee: 10.00 USD
  
  Net receive: 1,338.15 - 4.11 - 10.00 = 1,324.04 USD

PROFIT CALCULATION:
  Office fee income:        15.00 QAR
  Spread gain (if buy/sell diff): 8.00 QAR (example)
  Partner fee cost:         -10.00 USD equivalent
  Cut retained (if margin):  25.00 USD equivalent
  ─────────────────────────
  Expected profit:          ~42.00 QAR equivalent
  Classification:           ✅ Profitable
```

### 3.5 Manager Output Display

```
┌─────────────────────────────────────────────────┐
│  QUOTE PREVIEW — QAT → GZA                      │
├─────────────────────────────────────────────────┤
│  Send:           5,000.00 QAR                   │
│  Rate:           0.2740 (locked 15 min)         │
│  Cut (قص):       25.00 USD                      │
│  Office fee:     15.00 QAR                      │
│  Partner fee:    10.00 USD                      │
│  ─────────────────────────────────              │
│  Client receives: 1,324.04 USD                  │
│  Expected profit: +42.00 QAR  ✅ Profitable     │
│  Valid until:    18 Jun 2026, 15:45             │
│  Approval:       Not required                   │
├─────────────────────────────────────────────────┤
│  [Save Quote]  [Send to Client]  [Convert → Tx] │
└─────────────────────────────────────────────────┘
```

---

## 4. Country Price Lists

### 4.1 Structure

Each price list entry (Corridor) defines a remittance route:

| Field | Description |
|-------|-------------|
| origin_country | Sending country (ISO) |
| destination_country | Receiving country/region |
| sending_currency | Currency customer pays in |
| receiving_currency | Currency receiver gets |
| delivery_method | cash, bank, usdt, wallet, partner |
| current_rate | Linked ExchangeRate |
| percentage_rule | Linked PercentageRule |
| cut_rule | Linked CutRule |
| fee_rules | Linked FeeRules |
| min_amount | Minimum transaction |
| max_amount | Maximum transaction |
| execution_time | Estimated hours/days |
| requires_approval | Boolean |
| requires_partner | Boolean |
| is_active | Boolean |

### 4.2 MVP Priority Corridors (Seed Data)

| # | Route | Currencies | Method |
|---|-------|------------|--------|
| 1 | Qatar → Gaza | QAR → USD | Cash delivery |
| 2 | Saudi Arabia → Gaza | SAR → USD | Cash delivery |
| 3 | UAE → Egypt | AED → EGP | Bank / Cash |
| 4 | Kuwait → Gaza | KWD → USD | Cash delivery |
| 5 | Jordan → Gaza | JOD → USD | Cash delivery |
| 6 | Turkey → Palestine | TRY → USD | Bank |
| 7 | Europe → Gaza | EUR → USD | Bank / Partner |

*Product owner to confirm final MVP corridor list.*

### 4.3 Rate Update Frequency

- Rates may change every minute in active markets
- System stores full history (see FINANCIAL_RULES.md)
- Calculator always uses **current active rate** unless quote is locked
- Manager can manually update rate with audit trail

---

## 5. Variable Rates

### 5.1 Rate Types

| Type | Use Case |
|------|----------|
| reference | Market reference (display only) |
| buy | Office buys currency |
| sell | Office sells currency |
| execution | Used in remittance calculation |

### 5.2 Rate Sources (MVP)

| Source | Description |
|--------|-------------|
| manual | Accountant/manager enters |
| corridor_rule | Default rate on corridor config |

### 5.3 Rate Sources (Future)

| Source | Integration Phase |
|--------|-------------------|
| api_wise | Phase 9 |
| api_binance | Phase 9 |
| api_bank | Phase 9 |
| trading_view | Phase 9 |

### 5.4 Manual Override Flow

```
1. Manager opens calculator
2. System shows corridor default rate: 0.2740
3. Manager clicks "Override rate"
4. Enters new rate: 0.2750
5. System shows difference: +0.0010 (+0.36%)
6. Manager enters reason: "Market moved, competitor rate"
7. Audit log created
8. If override > threshold → approval required
9. Calculation uses override rate
```

---

## 6. Cut (قص) Rules

### 6.1 Business Meaning

**قص (Cut)** is a deduction applied in remittance pricing — common in Middle East exchange office operations. It may be:

- A fixed amount per transaction
- A percentage of the amount
- Variable by amount tier
- Different per corridor or delivery method

### 6.2 Tier Example

```
Corridor: QAT → GZA, USD receive

Tier 1:     1 — 1,000      → Cut: 10 USD
Tier 2:     1,001 — 5,000  → Cut: 25 USD
Tier 3:     5,001 — 10,000 → Cut: 45 USD
Tier 4:     10,001+        → Cut: 80 USD
```

### 6.3 VIP Override

```
Client status = VIP → Cut: 0 (waived)
Requires: client.status = 'vip' in Clients Center
Audit: logged if override applied
```

### 6.4 Cut in Calculator

```
1. Determine amount tier based on sending or receiving amount (configurable)
2. Find matching CutRule
3. Apply cut AFTER percentage, BEFORE fees (default order)
4. Display cut clearly in quote breakdown
5. Store cut_amount and cut_rule_id on quote
```

---

## 7. Percentage & Fee Rules

### 7.1 Percentage Rule

Applied to gross converted amount:

```
adjusted = gross × (1 + percentage/100)

Positive percentage = markup (office gains)
Negative percentage = discount (office absorbs)
```

### 7.2 Fee Rules

| Fee | Typical Application |
|-----|---------------------|
| office_fee | Charged to customer (income) |
| partner_fee | Paid to executing partner (cost) |
| platform_fee | SaaS fee (future) |

Fees can be fixed amount or percentage of sending amount.

---

## 8. Route Pricing & Best Route Finder

### 8.1 Execution Routes

| Route | Description |
|-------|-------------|
| partner_office | Partner delivers cash at destination |
| direct_cash | Office own cash network |
| bank_transfer | Bank deposit at destination |
| usdt | Crypto transfer |
| wallet | Mobile wallet (e.g., PayPal, Wise) |
| internal_settlement | Net against partner balance |

### 8.2 MVP: Manual Route Selection

Manager selects delivery method; system calculates for that route only.

### 8.3 Future: Automated Best Route

Compare all available routes for same corridor:

```
Route A: Partner cash    → Receive: 1,324 USD, Profit: 42 QAR, Time: 2h, Risk: Low
Route B: Bank transfer   → Receive: 1,340 USD, Profit: 28 QAR, Time: 24h, Risk: Low
Route C: USDT            → Receive: 1,355 USD, Profit: 55 QAR, Time: 1h, Risk: Medium

Ranked by: [Most Profitable] [Fastest] [Cheapest for Client] [Lowest Risk]
```

---

## 9. Quote Lifecycle

### 9.1 Status Flow

```
draft → sent → client_approved → converted
  │       │          │
  │       │          └──→ expired (if valid_until passed)
  │       │
  │       └──→ cancelled
  │
  └──→ cancelled
```

### 9.2 Quote Validity

| Setting | Default | Options |
|---------|---------|---------|
| Default validity | 15 minutes | 5m, 15m, 30m, 1h, 4h, 24h |
| Per-office configurable | Yes | Settings Center |
| Expiry behavior | Block conversion | Require recalculate |

### 9.3 Rate Lock

```
On quote creation:
  IF office.settings.rate_lock_enabled = true
  THEN quote.rate_locked = true
       quote.rate_locked_at = now()
       quote.exchange_rate = current rate at lock time

While locked:
  Corridor rate changes do NOT affect this quote
  
On expiry:
  rate_locked effectively false
  must recalculate with current rates
```

---

## 10. Convert Quote to Transaction

### 10.1 Pre-Conditions

| Check | Action if Failed |
|-------|------------------|
| Quote not expired | Prompt recalculate |
| Quote status allows conversion | Show status error |
| Client selected (if required) | Prompt select client |
| Approval obtained (if required) | Route to approval |
| User has permission | Access denied |

### 10.2 Conversion Mapping

| Quote Field | Transaction Field |
|-------------|-------------------|
| sending_amount | amount |
| sending_currency_id | currency_id |
| exchange_rate | exchange_rate |
| percentage | percentage |
| cut_amount | cut_amount |
| office_fee | office_fee |
| partner_fee | partner_fee |
| origin_country | origin_country |
| destination_country | destination_country |
| delivery_method | delivery_method |
| partner_office_id | partner_office_id |
| client_id | client_id |
| corridor_id | metadata.corridor_id |
| calculation_trace | preserved on quote |

### 10.3 Post-Conversion

1. Transaction created in `pending` or `approved` status
2. Quote status → `converted`
3. Quote.converted_transaction_id set
4. Audit log: action = 'quote_convert'
5. FlashCount Engine posts if auto-approved
6. Option to generate invoice immediately

---

## 11. Manager Workflow

### 11.1 Daily Pricing Workflow

```
1. Manager opens Dashboard
2. Sees "Expiring Quotes" alert (if any)
3. Navigates to Remittance Pricing Center
4. Selects corridor (or quick-select from favorites)
5. Enters amount and client details
6. Reviews calculation breakdown
7. Checks profit indicator
8. If losing → adjusts fee or escalates to owner
9. Saves quote → sends to client (verbally, WhatsApp, or portal)
10. On client approval → converts to transaction
11. Accountant verifies and attaches receipt
```

### 11.2 Corridor Management Workflow

```
1. Owner/Manager opens Country Price Lists
2. Selects or creates corridor
3. Sets/updates exchange rate (audit logged)
4. Configures cut tiers
5. Sets percentage and fees
6. Sets min/max amounts
7. Sets approval thresholds
8. Activates corridor
9. Calculator immediately uses new rules for NEW quotes
10. Existing locked quotes unaffected
```

---

## 12. Service Architecture (Conceptual)

```
┌─────────────────────────────────────────────────┐
│           Remittance Pricing Center UI          │
└───────────────────────┬─────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│         PricingCalculatorService                │
│  - resolveCorridor()                            │
│  - resolveRate()                                │
│  - resolveCutRule()                             │
│  - resolveFeeRules()                            │
│  - calculate() → QuoteCalculationResult           │
│  - checkApprovalRequired()                      │
│  - classifyProfit()                             │
└───────┬─────────┬─────────┬─────────┬───────────┘
        │         │         │         │
        ▼         ▼         ▼         ▼
   Corridor   Rate     CutRule   FeeRule
   Service    Service   Service   Service
        │         │         │         │
        └─────────┴─────────┴─────────┘
                        │
                        ▼
              ┌─────────────────┐
              │  QuoteService   │
              │  - create()     │
              │  - lockRate()   │
              │  - convert()    │
              │  - expire()     │
              └─────────────────┘
```

**Rule:** All calculation logic in services. UI only displays and collects input.

---

## 13. Error & Edge Cases

| Scenario | Handling |
|----------|----------|
| No corridor configured | Show "Route not available" + link to setup |
| Amount below minimum | Validation error with min amount |
| Amount above maximum | Validation error or require approval |
| No active rate | Block calculation, prompt rate entry |
| Rate override without reason | Validation error |
| Expired quote conversion attempt | Block, offer recalculate |
| Losing transaction | Warning banner, may require approval |
| Partner required but none selected | Validation error |
| Concurrent rate change during calculation | Use rate at calculation start (snapshot) |

---

## 14. Reports (MVP)

| Report | Content |
|--------|---------|
| Quote report | All quotes by date, status, corridor, profit |
| Pricing performance | Avg profit per corridor, losing quote count |
| Cut changes report | Audit of cut rule modifications |
| Rate history | Rate changes per corridor over time |

---

## 15. Acceptance Criteria

- [ ] Manager calculates Qatar → Gaza quote in < 2 minutes
- [ ] Cut tiers apply correctly for all configured ranges
- [ ] Quote expires and blocks stale conversion
- [ ] Rate lock holds during validity period
- [ ] Quote converts to transaction with matching snapshots
- [ ] Profit/loss displayed accurately
- [ ] All rate and rule changes appear in audit log
- [ ] Calculation trace stored on every quote

---

*FlashQuote is the product differentiator. Build it right, build it traceable, build it manager-friendly.*
