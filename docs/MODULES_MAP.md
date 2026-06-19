# Flash Nexus — Modules Map

**Document Version:** 1.0  
**Last Updated:** June 2026  

This document maps all 45 planned modules, their purpose, dependencies, and phase assignment.

**Legend:**
- **MVP** = Phase 1 delivery (first production version)
- **P2** = Phase 2–7 (post-MVP, pre-scale)
- **Future** = Phase 8–11

---

## Module Dependency Overview

```
Registration Center ──► SaaS Foundation (Auth, Offices, Roles)
                              │
                              ▼
                    Core Financial Engine (FlashCount)
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
    Remittance Pricing   Documents      Reports
              │               │               │
              └───────────────┼───────────────┘
                              ▼
              Daily Operations / Discovery / Smart Tools
                              │
                              ▼
              Integrations / Partner Network / Global Scale
```

---

## Module Registry

### 1. Dashboard
| Field | Value |
|-------|-------|
| **Purpose** | Command center: daily KPIs, alerts, tasks, pending items |
| **Depends On** | Core Financial Engine, Remittance Pricing (partial) |
| **Phase** | **MVP** (basic) → P2 (full alerts) |

---

### 2. Registration Center
| Field | Value |
|-------|-------|
| **Purpose** | Client and office registration, onboarding, account type selection |
| **Depends On** | Auth foundation |
| **Phase** | **MVP** |

---

### 3. Public Website
| Field | Value |
|-------|-------|
| **Purpose** | Landing, marketing pages, pre-login experience |
| **Depends On** | None |
| **Phase** | **MVP** (basic pages) |

---

### 4. Public Office Directory
| Field | Value |
|-------|-------|
| **Purpose** | Client search for offices by route, service, verification |
| **Depends On** | Office profiles, Registration Center |
| **Phase** | **MVP** (basic) → P2 (advanced filters) |

---

### 5. Client Portal
| Field | Value |
|-------|-------|
| **Purpose** | Client quotes, requests, documents, profile |
| **Depends On** | Registration, Remittance Pricing, Documents |
| **Phase** | **MVP** (basic) → P2 (full portal) |

---

### 6. Office Partner Discovery
| Field | Value |
|-------|-------|
| **Purpose** | Office-to-office partner search |
| **Depends On** | Office profiles, Business Identity |
| **Phase** | **MVP** (basic) |

---

### 7. Partner Request Workflow
| Field | Value |
|-------|-------|
| **Purpose** | Partnership lifecycle: request, accept, terms |
| **Depends On** | Partner Discovery |
| **Phase** | **MVP** (basic) → P2 (full terms) |

---

### 8. Administration Center
| Field | Value |
|-------|-------|
| **Purpose** | Office profile, branches, employees, roles, permissions, tasks |
| **Depends On** | SaaS Foundation |
| **Phase** | **MVP** |

---

### 9. Core Financial Engine
| Field | Value |
|-------|-------|
| **Internal Name** | FlashCount Engine (balance portion) |
| **Purpose** | Clients, accounts, currencies, transactions, balances, audit logs, approvals |
| **Depends On** | SaaS Foundation |
| **Phase** | **MVP** — **CRITICAL PATH** |

---

### 10. Clients Center
| Field | Value |
|-------|-------|
| **Purpose** | Client profiles, limits, risk, profitability, communication |
| **Depends On** | Core Financial Engine |
| **Phase** | **MVP** (basic) → P2 (full CRM) |

---

### 11. Transactions Center
| Field | Value |
|-------|-------|
| **Purpose** | All transaction types, entry, edit, approval, attachments |
| **Depends On** | Core Financial Engine |
| **Phase** | **MVP** |

---

### 12. Remittance Pricing Center
| Field | Value |
|-------|-------|
| **Internal Name** | FlashQuote |
| **Purpose** | Manager pricing calculator, quote generation |
| **Depends On** | Country Price Lists, Cut Rules, Exchange Rates |
| **Phase** | **MVP** — **CRITICAL PATH** |

---

### 13. Country Price Lists
| Field | Value |
|-------|-------|
| **Purpose** | Per-corridor rate, percentage, cut, fee rules |
| **Depends On** | Settings, Currencies |
| **Phase** | **MVP** |

---

### 14. Cut Rules (قص Rules)
| Field | Value |
|-------|-------|
| **Purpose** | Flexible cut configuration with tiers and audit |
| **Depends On** | Settings |
| **Phase** | **MVP** |

---

### 15. Quote & Rate Lock
| Field | Value |
|-------|-------|
| **Purpose** | Quote lifecycle, validity, rate lock, conversion |
| **Depends On** | Remittance Pricing Center |
| **Phase** | **MVP** |

---

### 16. Best Route Finder
| Field | Value |
|-------|-------|
| **Purpose** | Compare execution routes (partner, cash, USDT, bank) |
| **Depends On** | Remittance Pricing, Partner Network |
| **Phase** | **MVP** (manual/simple) → Future (automated) |

---

### 17. Accounting Center
| Field | Value |
|-------|-------|
| **Purpose** | Chart of accounts, journal entries, P&L, capital |
| **Depends On** | Core Financial Engine |
| **Phase** | **MVP** (basic) → P2 (full) |

---

### 18. FlashCount Engine
| Field | Value |
|-------|-------|
| **Purpose** | Balance updates, posting, snapshots, consistency |
| **Depends On** | Transactions, Accounts |
| **Phase** | **MVP** — **CRITICAL PATH** |

---

### 19. Exchange Rates & Market Center
| Field | Value |
|-------|-------|
| **Internal Name** | FlashRates |
| **Purpose** | Reference, manual, buy/sell rates, history, alerts |
| **Depends On** | Settings |
| **Phase** | **MVP** (manual) → Future (API feeds) |

---

### 20. Fees & Pricing Center
| Field | Value |
|-------|-------|
| **Purpose** | Fee rules, net profit formula, weak-profit detection |
| **Depends On** | Cut Rules, Country Price Lists |
| **Phase** | **MVP** |

---

### 21. Invoice & Document Studio
| Field | Value |
|-------|-------|
| **Internal Name** | FlashDocs |
| **Purpose** | Invoices, receipts, statements, templates, PDF export |
| **Depends On** | Transactions, Clients |
| **Phase** | **MVP** (basic) → Future (studio) |

---

### 22. Reports Center
| Field | Value |
|-------|-------|
| **Purpose** | Daily, P&L, client, pending, quote reports |
| **Depends On** | Core Financial Engine, Transactions |
| **Phase** | **MVP** (basic) → Future (builder) |

---

### 23. Capital & Liquidity Center
| Field | Value |
|-------|-------|
| **Purpose** | Capital tracking, liquidity by currency/country, shortages |
| **Depends On** | FlashCount Engine, Accounts |
| **Phase** | P2 |

---

### 24. Daily Closing Center
| Field | Value |
|-------|-------|
| **Purpose** | End-of-day reconciliation and manager approval |
| **Depends On** | Transactions, Cash & Shifts |
| **Phase** | P2 (Phase 6) |

---

### 25. Cash & Shifts Center
| Field | Value |
|-------|-------|
| **Purpose** | Shift open/close, cash handover, difference tracking |
| **Depends On** | Core Financial Engine |
| **Phase** | P2 (Phase 6) |

---

### 26. Smart Import Center
| Field | Value |
|-------|-------|
| **Purpose** | Excel/CSV/PDF import with review and approval |
| **Depends On** | Core Financial Engine |
| **Phase** | Future (Phase 8) |

---

### 27. Receipt AI Scanner
| Field | Value |
|-------|-------|
| **Purpose** | OCR/AI extraction from receipt images |
| **Depends On** | FlashAI, Attachments |
| **Phase** | Future (Phase 8) |

---

### 28. Integration Hub
| Field | Value |
|-------|-------|
| **Purpose** | Wise, Binance, banks, webhooks, sync logs |
| **Depends On** | Core Financial Engine, Pending Review workflow |
| **Phase** | Future (Phase 9) |

---

### 29. Business Identity & Network Center
| Field | Value |
|-------|-------|
| **Purpose** | Office verification, trust, documents, licenses |
| **Depends On** | Office profiles |
| **Phase** | **MVP** (basic states) → P2 (full) |

---

### 30. Office Services Network
| Field | Value |
|-------|-------|
| **Purpose** | Service listings with verification status |
| **Depends On** | Business Identity |
| **Phase** | **MVP** (basic) → P2 |

---

### 31. Service Trust Score
| Field | Value |
|-------|-------|
| **Purpose** | Calculated trust from operations, disputes, ratings |
| **Depends On** | Transactions, Partner Network, Ratings |
| **Phase** | Future (Phase 10) |

---

### 32. Deal Ticket Center
| Field | Value |
|-------|-------|
| **Purpose** | Shared multi-office operations with chat and settlement |
| **Depends On** | Partner Network, Transactions |
| **Phase** | Future (Phase 10) |

---

### 33. Settlements Center
| Field | Value |
|-------|-------|
| **Purpose** | Client, partner, platform settlements with aging |
| **Depends On** | Transactions, Partner Network |
| **Phase** | P2 (Phase 6) |

---

### 34. Communication Center
| Field | Value |
|-------|-------|
| **Purpose** | Client, team, partner, support chat linked to records |
| **Depends On** | Users, Clients, Partners |
| **Phase** | P2 → Future |

---

### 35. AI Center
| Field | Value |
|-------|-------|
| **Internal Name** | FlashAI |
| **Purpose** | AI CFO, auditor, pricing, risk, receipt reader |
| **Depends On** | All data modules |
| **Phase** | Future (Phase 8+) |
| **Constraint** | Suggest only — never approve alone |

---

### 36. FlashAudit Center
| Field | Value |
|-------|-------|
| **Purpose** | Risk monitoring, suspicious activity, compliance alerts |
| **Depends On** | Audit logs, Transactions |
| **Phase** | P2 (basic alerts) → Future (full) |

---

### 37. Incidents & Disputes Center
| Field | Value |
|-------|-------|
| **Purpose** | Error tracking, disputes, resolution workflow |
| **Depends On** | Transactions, Partner Network |
| **Phase** | P2 |

---

### 38. Data Quality Center
| Field | Value |
|-------|-------|
| **Purpose** | Missing data detection, quality score |
| **Depends On** | All record modules |
| **Phase** | P2 |

---

### 39. Compliance & Verification Center
| Field | Value |
|-------|-------|
| **Purpose** | Document expiry, limits, review workflows |
| **Depends On** | Business Identity, Documents |
| **Phase** | P2 |

---

### 40. Subscriptions & Billing Center
| Field | Value |
|-------|-------|
| **Purpose** | Plans (Basic/Pro/Enterprise), limits, billing |
| **Depends On** | Super Admin, Offices |
| **Phase** | P2 (manual) → Future (Stripe) |

---

### 41. Settings Center
| Field | Value |
|-------|-------|
| **Purpose** | No-code office configuration for all rules and preferences |
| **Depends On** | SaaS Foundation |
| **Phase** | **MVP** |

---

### 42. Migration Center
| Field | Value |
|-------|-------|
| **Purpose** | Import from Excel, CSV, legacy systems (Al-Aseel, Al-Mizan) |
| **Depends On** | Core Financial Engine, Smart Import |
| **Phase** | P2 |

---

### 43. Sandbox / Demo Mode
| Field | Value |
|-------|-------|
| **Purpose** | Training environment with no real account impact |
| **Depends On** | All core modules |
| **Phase** | P2 |

---

### 44. Flash Academy
| Field | Value |
|-------|-------|
| **Purpose** | In-app learning for transactions, pricing, closing |
| **Depends On** | UI modules |
| **Phase** | Future |

---

### 45. System Operations & Release Management
| Field | Value |
|-------|-------|
| **Purpose** | Super Admin: deployments, migrations, feature flags, backups |
| **Depends On** | Infrastructure |
| **Phase** | **MVP** (documentation) → P2 (admin UI) |

---

## Critical Path for MVP

```
Phase 0: Documentation
    ↓
Phase 1: Project Foundation (Next.js, UI shell, RTL)
    ↓
Phase 2: SaaS Foundation (Auth, Offices, Roles, Multi-tenant)
    ↓
Phase 3: Core Financial Engine (Clients, Accounts, Transactions, Audit)
    ↓
Phase 4: Remittance Pricing (Price Lists, Cut, Quotes, Rate Lock)
    ↓
Phase 5: Documents & Reports (Invoices, Receipts, Basic Reports)
    ↓
Phase 7 (partial): Discovery Basics (Directory, Partner Search)
    ↓
MVP Release
```

---

## Module Count by Phase

| Phase | Count | Examples |
|-------|-------|----------|
| MVP | ~22 modules (basic or full) | Financial Engine, Pricing, Quotes, Settings |
| P2 (Phases 6–7) | ~12 modules | Daily Closing, Cash Shifts, Settlements, Full Audit |
| Future (Phases 8–11) | ~11 modules | AI, Integrations, Deal Tickets, Trust Score, Academy |

---

*When adding new modules, register them here with dependencies and phase before implementation.*
