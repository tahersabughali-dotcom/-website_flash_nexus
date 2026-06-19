# Flash Nexus — MVP Scope Definition

**Document Version:** 1.0  
**Last Updated:** June 2026  
**Purpose:** Define exact boundaries of the first production release (v1.0.0)

---

## 1. MVP Philosophy

The first real version must be:

- **Practical** — solves daily office operations and pricing pain
- **Stable** — financially safe, audit-ready, multi-tenant
- **Focused** — not overloaded with future modules
- **Deployable** — production-ready with documented deployment process
- **Extensible** — architecture supports future modules without rewrite

> Rule: Build the core financial engine and remittance pricing before advanced AI, integrations, or marketplace automation.

---

## 2. MVP Includes (v1.0.0)

### 2.1 Public & Registration

| # | Feature | Scope Detail |
|---|---------|--------------|
| 1 | Public landing page | What is Flash Nexus, for clients, for offices, contact |
| 2 | Client registration | Account creation, basic profile |
| 3 | Office registration | Business profile, services, corridors, visibility settings |
| 4 | Login / auth foundation | Email auth, session, logout (Supabase) |

### 2.2 SaaS Foundation

| # | Feature | Scope Detail |
|---|---------|--------------|
| 5 | Office setup | Profile, currencies, countries after registration |
| 6 | Users & invitations | Invite employees to office |
| 7 | Roles | Owner, Manager, Accountant, Cashier (basic), Auditor (read) |
| 8 | Permissions | RBAC enforced server-side |
| 9 | Multi-tenant structure | `office_id` isolation on all tenant data |

### 2.3 Core Financial Engine

| # | Feature | Scope Detail |
|---|---------|--------------|
| 10 | Clients | CRUD, basic status (Active, VIP, Risky, Suspended) |
| 11 | Accounts | Chart of accounts, client accounts, cash, bank (basic) |
| 12 | Currencies | Per-office currency configuration |
| 13 | Transactions | Incoming, outgoing, remittance, fee, expense, correction, reversal |
| 14 | Audit logs | Every financial mutation logged |
| 15 | Approvals | Basic approval workflow for sensitive transactions |
| 16 | Attachments | Basic file upload on transactions (if feasible in timeline) |

### 2.4 Remittance Pricing (Critical MVP Value)

| # | Feature | Scope Detail |
|---|---------|--------------|
| 17 | Remittance Pricing Calculator | Manager can quote without accountant |
| 18 | Country Price Lists | Corridor-based rules (e.g., Qatar → Gaza) |
| 19 | Cut Rules (قص) | Fixed, percentage, tier-based with audit |
| 20 | Percentage / Fee Rules | Configurable per corridor |
| 21 | Quotes | Generate with validity period |
| 22 | Rate Lock | Lock rate on active quote |
| 23 | Quote → Transaction | Convert approved quote to transaction |

### 2.5 Documents & Reports

| # | Feature | Scope Detail |
|---|---------|--------------|
| 24 | Basic invoices | Linked to transaction, PDF export |
| 25 | Basic receipts | Linked to transaction, PDF export |
| 26 | Basic reports | Daily summary, P&L, client transactions, pending, quotes |

### 2.6 Dashboard & Settings

| # | Feature | Scope Detail |
|---|---------|--------------|
| 27 | Basic dashboard | Today in/out, profit, pending, latest transactions, expiring quotes |
| 28 | Settings Center | Currencies, corridors, rules, visibility, roles |

### 2.7 Discovery (Basic)

| # | Feature | Scope Detail |
|---|---------|--------------|
| 29 | Public office directory | Search by country, corridor, service, verification |
| 30 | Basic office partner search | Office-to-office discovery |
| 31 | Basic partner request | Send/accept/reject partnership request |

### 2.8 Operations & Documentation

| # | Feature | Scope Detail |
|---|---------|--------------|
| 32 | Deployment documentation | Dev/staging/prod, migrations, changelog |
| 33 | Feature flags (foundation) | Hide incomplete modules |
| 34 | Arabic RTL layout | Foundation from day one |
| 35 | Version visibility | App version in settings/about |

---

## 3. MVP Explicitly Excludes

### 3.1 AI & Automation

| Feature | Reason Deferred |
|---------|-----------------|
| Full AI Center (FlashAI) | Requires stable data foundation first |
| AI receipt scanner | Phase 8 |
| AI pricing suggestions | Phase 8 |
| AI audit automation | Phase 8 |
| Automated service trust score | Phase 10 |

### 3.2 External Integrations

| Feature | Reason Deferred |
|---------|-----------------|
| Wise API | Phase 9 — official integration |
| Binance API | Phase 9 |
| PayPal / Stripe / Payoneer | Phase 9 |
| Bank API feeds | Phase 9 |
| Webhook sync | Phase 9 |
| Rate provider APIs | Manual rates sufficient for MVP |

### 3.3 Advanced Operations

| Feature | Reason Deferred |
|---------|-----------------|
| Cash & Shifts Center | Phase 6 |
| Daily Closing Center | Phase 6 |
| Settlements Center (full) | Phase 6 |
| Deal Tickets | Phase 10 |
| Smart Import Center | Phase 8 |
| Migration Center (Al-Aseel, Al-Mizan) | Phase 2 post-MVP |

### 3.4 Advanced Product Features

| Feature | Reason Deferred |
|---------|-----------------|
| Mobile app | Phase 11 |
| Public API | Phase 11 |
| Advanced Invoice Studio (Canva-like) | Future |
| Advanced Report Builder | Future |
| Full marketplace automation | Phase 10–11 |
| Communication Center (chat) | P2 |
| Flash Academy | Future |
| Sandbox / Demo Mode | P2 |
| Subscription billing (Stripe) | P2 — manual plans OK for MVP |

### 3.5 Advanced Network

| Feature | Reason Deferred |
|---------|-----------------|
| Partner settlement automation | Phase 10 |
| Service trust score calculation | Phase 10 |
| Full deal ticket workflow | Phase 10 |
| Dispute resolution center | P2 |

---

## 4. MVP Quality Gates

Before MVP release, ALL of the following must pass:

### 4.1 Financial Safety

- [ ] No permanent delete of financial transactions
- [ ] All transactions have creator, timestamp, office_id
- [ ] Audit log on every financial mutation
- [ ] Balance updates only through FlashCount Engine
- [ ] Quote expiry enforced before conversion

### 4.2 Security

- [ ] Tenant isolation verified (cannot access other office data)
- [ ] RBAC enforced server-side
- [ ] Client cannot see internal office data
- [ ] Unverified services labeled correctly

### 4.3 Functionality

- [ ] Office can complete full day: client → quote → transaction → invoice
- [ ] Manager can price remittance without accountant
- [ ] At least 3 corridor price lists configured (seed data)
- [ ] Dashboard reflects real transaction data

### 4.4 Operations

- [ ] Deployed to production environment
- [ ] Database migrations documented and tested
- [ ] Backup strategy documented
- [ ] CHANGELOG.md started
- [ ] Rollback procedure documented

---

## 5. MVP User Stories (Priority Order)

### Must Have (P0)

1. As an **office owner**, I can register my office and invite my accountant.
2. As an **accountant**, I can record an incoming remittance transaction with rate and fee.
3. As a **manager**, I can calculate a Qatar → Gaza quote and show the client expected receive amount.
4. As a **manager**, I can convert an approved quote into a transaction.
5. As an **office owner**, I can see today's income, outgoing, and profit on the dashboard.
6. As a **client**, I can register and search for offices serving my corridor.
7. As the **system**, I never permanently delete a financial record.

### Should Have (P1)

8. As a **manager**, I can configure cut rules for a corridor with tier amounts.
9. As an **accountant**, I can attach a receipt image to a transaction.
10. As an **office owner**, I can generate a PDF invoice for a transaction.
11. As an **office**, I can send a partnership request to another office.
12. As a **manager**, I can see transactions pending my approval.

### Nice to Have (P2 — only if time permits)

13. As a **client**, I can submit a quote request online to an office.
14. As an **auditor**, I can view audit log for any transaction.
15. As an **office owner**, I can set public profile visibility.

---

## 6. MVP Technical Boundaries

| Area | MVP Approach |
|------|--------------|
| Database | PostgreSQL via Supabase, migrations from start |
| Auth | Supabase Auth, email/password |
| File storage | Supabase Storage for attachments |
| Rate sources | Manual entry + history |
| Best route finder | Manual selection, not automated ranking |
| Reports | Pre-built templates, not custom builder |
| i18n | Arabic primary, English strings prepared for future |
| Payments (subscription) | Manual/offline if needed |
| Email | Basic transactional (invite, password reset) |

---

## 7. Post-MVP Immediate Priorities (v1.1.0)

1. Cash & Shifts Center
2. Daily Closing Center
3. Client quote request workflow (online)
4. FlashAudit Center (basic alerts)
5. Settlements (basic)
6. More corridor seed data

---

## 8. Scope Change Process

Any feature moving into or out of MVP requires:

1. Documented reason
2. Impact on timeline assessment
3. Update to this file, `MODULES_MAP.md`, and `ROADMAP.md`
4. Version bump note in CHANGELOG

---

*MVP scope is intentionally narrow. A stable, trusted financial core is worth more than a wide, fragile feature set.*
