# Flash Nexus — Product Requirements Document (PRD)

**Product:** Flash Nexus (فلاش نِكسَس)  
**Document Type:** Product Requirements Document  
**Version:** 1.0  
**Status:** Approved for Phase 0 Planning  
**Last Updated:** June 2026  

---

## 1. Document Purpose

This PRD organizes all product requirements for Flash Nexus in a structured format suitable for architecture, development prioritization, and stakeholder alignment. It complements `PROJECT_OVERVIEW.md` with actionable requirements.

---

## 2. Problem Statement

Exchange offices and remittance businesses operate with fragmented tools: spreadsheets, disconnected calculators, manual quote sheets, informal partner arrangements, and accounting software that does not understand remittance-specific concepts (cut/قص, corridor pricing, partner execution).

Managers cannot answer basic questions quickly. Accountants become bottlenecks for pricing. Audit trails are weak. Partner networks are informal. Clients struggle to find trusted offices.

---

## 3. Product Goals

| ID | Goal | Success Metric |
|----|------|----------------|
| G1 | Single command center for office financial operations | Manager answers daily KPIs from dashboard without external tools |
| G2 | Manager-independent remittance pricing | Quote generated in < 2 minutes without accountant |
| G3 | Audit-ready financial records | 100% of financial changes traceable to user + timestamp |
| G4 | Multi-tenant SaaS with office isolation | Zero cross-tenant data leakage |
| G5 | Client and partner discovery | Verified offices discoverable; unverified clearly marked |
| G6 | Safe continuous deployment | Production updates without downtime for core operations |
| G7 | Arabic-first, RTL-ready UX | Full RTL layout support from MVP foundation |

---

## 4. User Personas & Requirements

### 4.1 Super Admin (Platform Owner)

**Needs:**
- Manage all offices, subscriptions, platform settings
- Office approval and verification workflows
- Feature flags and system status visibility
- Platform-level risk and support tools
- Deployment/version visibility

**Requirements:**
| ID | Requirement | Priority |
|----|-------------|----------|
| SA-01 | View and manage all tenant offices | P1 (MVP foundation) |
| SA-02 | Approve/suspend office verification states | P1 |
| SA-03 | Manage feature flags per office or globally | P2 |
| SA-04 | Platform health and deployment status dashboard | P2 |
| SA-05 | Subscription plan management | P2 |

---

### 4.2 Office Owner

**Needs:**
- Full control inside own office: staff, clients, accounts, pricing, reports
- Strategic visibility: profit, loss, capital, liquidity
- Public profile and partner network configuration

**Requirements:**
| ID | Requirement | Priority |
|----|-------------|----------|
| OO-01 | Create and configure office profile | P0 (MVP) |
| OO-02 | Invite and manage employees with roles | P0 |
| OO-03 | View dashboard with daily KPIs | P0 |
| OO-04 | Configure currencies, countries, corridors | P0 |
| OO-05 | Approve sensitive transactions and rule changes | P0 |
| OO-06 | Control public visibility and service listings | P1 |
| OO-07 | Manage partner relationships | P1 |
| OO-08 | Daily closing approval | P2 |

---

### 4.3 Financial Manager

**Requirements:**
| ID | Requirement | Priority |
|----|-------------|----------|
| FM-01 | View capital and liquidity reports | P1 |
| FM-02 | Review settlements and aging | P2 |
| FM-03 | Approve high-value or risky transactions | P0 |
| FM-04 | View risk alerts and weak-profit transactions | P1 |
| FM-05 | Review pricing performance | P1 |

---

### 4.4 Accountant

**Requirements:**
| ID | Requirement | Priority |
|----|-------------|----------|
| AC-01 | Create and edit transactions (within permissions) | P0 |
| AC-02 | Upload attachments to transactions | P0 |
| AC-03 | Request edits to locked/approved records via workflow | P1 |
| AC-04 | View allowed reports | P0 |
| AC-05 | Cannot permanently delete financial records | P0 (constraint) |
| AC-06 | Cannot bypass approval workflows | P0 (constraint) |

---

### 4.5 Cashier

**Requirements:**
| ID | Requirement | Priority |
|----|-------------|----------|
| CA-01 | Open/close cash shift | P2 |
| CA-02 | Record cash receipts and payments | P2 |
| CA-03 | Cash handover with manager approval | P2 |
| CA-04 | Shift report generation | P2 |

---

### 4.6 Auditor

**Requirements:**
| ID | Requirement | Priority |
|----|-------------|----------|
| AU-01 | Read-only access to transactions and audit logs | P1 |
| AU-02 | View edited transactions and missing attachments | P1 |
| AU-03 | View daily closing issues | P2 |
| AU-04 | Export audit reports | P2 |

---

### 4.7 Client / Customer

**Requirements:**
| ID | Requirement | Priority |
|----|-------------|----------|
| CL-01 | Register client account | P0 |
| CL-02 | Search public office directory by route, service, verification | P1 |
| CL-03 | Request quote from office | P1 |
| CL-04 | Track quote and service request status | P1 |
| CL-05 | View own invoices, receipts, statements | P1 |
| CL-06 | Upload verification documents when requested | P2 |
| CL-07 | Cannot see internal office accounting or other clients | P0 (constraint) |

---

### 4.8 Partner Office

**Requirements:**
| ID | Requirement | Priority |
|----|-------------|----------|
| PO-01 | Search for partner offices | P1 |
| PO-02 | Send and receive partnership requests | P1 |
| PO-03 | Define partnership terms (corridors, fees, limits) | P2 |
| PO-04 | Participate in deal tickets | P2 |
| PO-05 | View shared settlements | P2 |

---

### 4.9 AI Assistant (Future)

**Requirements:**
| ID | Requirement | Priority |
|----|-------------|----------|
| AI-01 | Analyze, summarize, suggest, detect risks | P3 |
| AI-02 | Assist pricing and receipt extraction | P3 |
| AI-03 | Never approve or silently modify financial records | P0 (constraint) |
| AI-04 | All AI-suggested actions require human approval | P0 (constraint) |

---

## 5. Functional Requirements by Domain

### 5.1 Authentication & Multi-Tenancy

| ID | Requirement | MVP |
|----|-------------|-----|
| AUTH-01 | Email/password authentication via Supabase | Yes |
| AUTH-02 | Separate registration flows: Client vs Office | Yes |
| AUTH-03 | User can belong to one or more offices with distinct roles | Yes |
| AUTH-04 | Row-level tenant isolation by `office_id` | Yes |
| AUTH-05 | Session management and secure logout | Yes |
| AUTH-06 | Future: SSO, 2FA | No |

---

### 5.2 Core Financial Engine

| ID | Requirement | MVP |
|----|-------------|-----|
| FIN-01 | Clients CRUD with status classification | Yes |
| FIN-02 | Chart of accounts and account balances | Yes |
| FIN-03 | Multi-currency support per office | Yes |
| FIN-04 | Transaction types: incoming, outgoing, remittance, fee, expense, settlement, correction, reversal | Yes |
| FIN-05 | Every transaction: creator, editor, approver, rate snapshot | Yes |
| FIN-06 | Soft delete / void only — no permanent delete | Yes |
| FIN-07 | Audit log for all financial mutations | Yes |
| FIN-08 | Balance updates via centralized FlashCount Engine | Yes |
| FIN-09 | Transaction approval workflow | Yes |
| FIN-10 | Attachments on transactions | Basic |

---

### 5.3 Remittance Pricing

| ID | Requirement | MVP |
|----|-------------|-----|
| RP-01 | Country/corridor price lists | Yes |
| RP-02 | Configurable cut (قص) rules with tiers | Yes |
| RP-03 | Percentage and fee rules | Yes |
| RP-04 | Pricing calculator for managers | Yes |
| RP-05 | Quote generation with validity period | Yes |
| RP-06 | Rate lock on active quotes | Yes |
| RP-07 | Convert quote to transaction | Yes |
| RP-08 | Expected profit/loss indicator on quote | Yes |
| RP-09 | Manual rate override with audit | Yes |
| RP-10 | Best route finder | Manual/simple |

---

### 5.4 Documents

| ID | Requirement | MVP |
|----|-------------|-----|
| DOC-01 | Basic invoice linked to transaction | Yes |
| DOC-02 | Basic receipt linked to transaction | Yes |
| DOC-03 | PDF export | Yes |
| DOC-04 | Office logo on documents | Basic |
| DOC-05 | Document studio (Canva-like) | No |
| DOC-06 | QR code on documents | No |

---

### 5.5 Reports

| ID | Requirement | MVP |
|----|-------------|-----|
| REP-01 | Daily summary report | Yes |
| REP-02 | Profit/loss report | Yes |
| REP-03 | Client transaction report | Yes |
| REP-04 | Pending transactions report | Yes |
| REP-05 | Quote report | Yes |
| REP-06 | Report builder | No |

---

### 5.6 Marketplace & Network

| ID | Requirement | MVP |
|----|-------------|-----|
| MKT-01 | Public landing page | Yes |
| MKT-02 | Public office directory with search | Basic |
| MKT-03 | Office verification status display | Yes |
| MKT-04 | Client quote request to office | Basic |
| MKT-05 | Office partner search | Basic |
| MKT-06 | Partner request workflow | Basic |
| MKT-07 | Service trust score automation | No |
| MKT-08 | Deal tickets | No |

---

### 5.7 Settings & Configuration

| ID | Requirement | MVP |
|----|-------------|----------|
| SET-01 | Office profile settings | Yes |
| SET-02 | Currency and country configuration | Yes |
| SET-03 | Cut, percentage, fee rule management | Yes |
| SET-04 | Approval rule configuration | Basic |
| SET-05 | Public visibility controls | Yes |
| SET-06 | Role and permission management | Yes |
| SET-07 | Language preference (AR primary) | Yes |

---

## 6. Non-Functional Requirements

### 6.1 Security

| ID | Requirement |
|----|-------------|
| SEC-01 | HTTPS everywhere |
| SEC-02 | RBAC enforced server-side, not UI-only |
| SEC-03 | Tenant data isolation at database level |
| SEC-04 | Audit logs immutable |
| SEC-05 | Sensitive operations require approval |
| SEC-06 | File uploads scanned and size-limited |

### 6.2 Performance

| ID | Requirement |
|----|-------------|
| PERF-01 | Dashboard loads in < 3s on average connection |
| PERF-02 | Quote calculation < 1s |
| PERF-03 | Pagination on all large lists |

### 6.3 Reliability

| ID | Requirement |
|----|-------------|
| REL-01 | Database backups daily (production) |
| REL-02 | Zero-downtime deployments for non-schema changes |
| REL-03 | Backward-compatible migrations |

### 6.4 Usability

| ID | Requirement |
|----|-------------|
| UX-01 | Arabic RTL layout support |
| UX-02 | Mobile-responsive for manager dashboard |
| UX-03 | Maximum 3 clicks to common actions |
| UX-04 | Clear verification/unverified labeling |

### 6.5 Maintainability

| ID | Requirement |
|----|-------------|
| MAINT-01 | TypeScript strict mode |
| MAINT-02 | All schema changes via migrations |
| MAINT-03 | Feature flags for incomplete modules |
| MAINT-04 | Centralized business logic in services |

---

## 7. Business Rules (Cross-Cutting)

1. Financial transactions are never permanently deleted
2. Void/reversal creates new audit-linked records
3. Quotes expire; execution requires recalculation if expired
4. Rates store source + timestamp + history
5. Cut and fee rule changes are fully audited
6. Unverified services display as unverified — never as verified
7. AI cannot approve financial changes autonomously
8. External integration data enters as Pending Review before posting
9. Multi-tenant: all queries scoped by office_id
10. Manager can calculate customer pricing without accountant

---

## 8. Out of Scope for MVP

See `MVP_SCOPE.md` for full detail. Summary:

- Full AI center
- Wise, Binance, PayPal, Stripe integrations
- Mobile app
- Public API
- Advanced invoice studio
- Advanced report builder
- Automated service trust scores
- Full deal ticket automation
- Cash shifts and daily closing (Phase 6)

---

## 9. Assumptions

| # | Assumption | Risk if Wrong |
|---|------------|---------------|
| A1 | Primary users are Arabic-speaking exchange office operators | UI/copy priorities may need adjustment |
| A2 | Supabase provides sufficient RLS for multi-tenancy | May need additional middleware |
| A3 | Manual rate entry is acceptable for MVP | May need faster rate import sooner |
| A4 | Single office per registration initially; branches later | Schema must support branches from start |
| A5 | Domain/TLD configuration deferred | No impact on architecture |
| A6 | Subscription billing can be manual initially | Stripe integration deferred |

---

## 10. Open Questions

| # | Question | Owner | Impact |
|---|----------|-------|--------|
| Q1 | Exact domain name and TLD? | Product Owner | Branding only |
| Q2 | Which corridors are priority for MVP price lists? | Product Owner | Data seeding |
| Q3 | Subscription pricing tiers and limits? | Product Owner | Billing module |
| Q4 | Legal jurisdiction for platform terms? | Legal | Compliance module |
| Q5 | Initial target country for launch marketing? | Product Owner | Localization priority |
| Q6 | Al-Aseel / Al-Mizan migration format details? | Product Owner | Migration Center |

---

## 11. Acceptance Criteria for MVP Release

MVP is complete when:

1. Office can register, configure, and invite staff
2. Accountant can enter transactions with full audit trail
3. Manager can calculate remittance quote and convert to transaction
4. Basic invoices and receipts can be generated
5. Dashboard shows daily KPIs
6. Client can register and search basic office directory
7. Office can search basic partner directory and send request
8. All financial golden rules are enforced in code
9. Deployed to production with dev/staging pipeline documented
10. No critical security or tenant isolation gaps

---

*This PRD is a living document. Update version and changelog when requirements change.*
