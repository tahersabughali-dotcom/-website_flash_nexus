# Flash Nexus — Development Roadmap

**Document Version:** 1.0  
**Last Updated:** June 2026  

---

## Roadmap Overview

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5
  Docs       Foundation    SaaS         Financial    Pricing      Docs/Reports
                                                                      │
Phase 6 ◄── Phase 7 ◄─────────────────────────────────────────────────┘
  Daily Ops    Discovery
      │
Phase 8 ──► Phase 9 ──► Phase 10 ──► Phase 11
  Smart Tools  Integrations  Partner Net   Global Scale
```

**Target MVP Release:** End of Phase 5 + partial Phase 7 → **v1.0.0**

---

## Phase 0: Documentation & Architecture

**Status:** IN PROGRESS  
**Deliverable:** Complete documentation package (this repo `docs/` folder)

### Objectives
- Understand and organize the full product vision
- Identify missing logic and structural gaps
- Create architecture documentation for future development
- Establish golden rules and development standards

### Outputs
| Document | Status |
|----------|--------|
| PROJECT_OVERVIEW.md | ✅ |
| PRODUCT_REQUIREMENTS.md | ✅ |
| MODULES_MAP.md | ✅ |
| MVP_SCOPE.md | ✅ |
| ROADMAP.md | ✅ |
| DATA_MODEL_CONCEPT.md | ✅ |
| FINANCIAL_RULES.md | ✅ |
| REMITTANCE_PRICING_CENTER.md | ✅ |
| REGISTRATION_AND_MARKETPLACE.md | ✅ |
| UI_UX_GUIDELINES.md | ✅ |
| DEVELOPMENT_RULES.md | ✅ |
| DEPLOYMENT_AND_VERSIONING.md | ✅ |
| SECURITY_AND_PERMISSIONS.md | ✅ |
| FUTURE_FEATURES.md | ✅ |

### Exit Criteria
- All documentation reviewed and approved by product owner
- No application code written yet
- Clear MVP boundaries agreed

---

## Phase 1: Project Foundation

**Target Version:** v0.1.0 (internal)  
**Estimated Duration:** 1–2 weeks

### Objectives
- Initialize Next.js project with TypeScript
- Configure Tailwind CSS and shadcn/ui
- Establish folder structure per DEVELOPMENT_RULES.md
- Create app shell: layout, sidebar, topbar
- Flash Nexus branding (white/blue, logo placeholder)
- RTL-ready layout foundation
- Placeholder pages for major modules
- Environment configuration (.env.example)

### Deliverables
- [ ] Next.js App Router project (`flash-nexus/`)
- [ ] Tailwind + shadcn/ui configured
- [ ] Root layout with RTL support toggle
- [ ] Sidebar navigation (placeholder links)
- [ ] Public layout vs authenticated layout
- [ ] README with setup instructions
- [ ] `.env.example` with required variables (no secrets)

### Does NOT Include
- Supabase connection
- Authentication
- Database migrations
- Business logic

---

## Phase 2: SaaS Foundation

**Target Version:** v0.2.0 (staging)  
**Estimated Duration:** 2–3 weeks

### Objectives
- Connect Supabase (auth, database, storage)
- Implement multi-tenant office model
- User registration (client + office paths)
- Role-based access control
- Office onboarding flow
- Employee invitation

### Deliverables
- [ ] Supabase project (dev environment)
- [ ] Initial database migrations
- [ ] Auth: login, logout, password reset
- [ ] Client registration flow
- [ ] Office registration flow
- [ ] Office profile setup wizard
- [ ] User ↔ Office membership with roles
- [ ] RLS policies for tenant isolation
- [ ] Permission middleware/guards
- [ ] Super Admin seed account

### Key Entities
- `users`, `offices`, `office_members`, `roles`, `permissions`

---

## Phase 3: Core Financial Engine

**Target Version:** v0.3.0 (staging)  
**Estimated Duration:** 3–4 weeks

### Objectives
- Build the financial heart of the platform
- Clients, accounts, currencies, transactions
- FlashCount Engine for balance updates
- Immutable audit logs
- Transaction approval workflow

### Deliverables
- [ ] Clients Center (CRUD, statuses)
- [ ] Chart of accounts
- [ ] Currency configuration per office
- [ ] Transaction entry (all MVP types)
- [ ] Transaction edit with audit trail
- [ ] Void/reversal (no permanent delete)
- [ ] FlashCount Engine service
- [ ] Balance calculation and display
- [ ] Approval workflow (request → approve/reject)
- [ ] Audit log viewer (basic)
- [ ] Attachment upload (basic)

### Golden Rules Enforced
- FR-01 through FR-10 (see FINANCIAL_RULES.md)

---

## Phase 4: Remittance Pricing

**Target Version:** v0.4.0 (staging)  
**Estimated Duration:** 3–4 weeks

### Objectives
- Enable manager-independent pricing
- Country price lists, cut rules, fee rules
- Quote generation, rate lock, conversion to transaction

### Deliverables
- [ ] Country/corridor price list management
- [ ] Cut (قص) rule engine with tiers
- [ ] Percentage and fee rule engine
- [ ] Exchange rate entry with history
- [ ] Remittance Pricing Calculator UI
- [ ] Quote creation with validity timer
- [ ] Rate lock mechanism
- [ ] Quote status lifecycle
- [ ] Quote → Transaction conversion
- [ ] Expected profit/loss display
- [ ] Manual rate override with audit
- [ ] Seed data: Qatar→Gaza, UAE→Egypt, KSA→Gaza (minimum)

### Critical User Story
> Manager calculates Qatar → Gaza remittance quote in under 2 minutes without accountant.

---

## Phase 5: Documents & Reports

**Target Version:** v0.5.0 (staging)  
**Estimated Duration:** 2–3 weeks

### Objectives
- Basic invoicing and receipts
- Essential reports for daily operations
- Dashboard with real KPIs

### Deliverables
- [ ] Invoice template (linked to transaction)
- [ ] Receipt template (linked to transaction)
- [ ] PDF export
- [ ] Office logo on documents
- [ ] Daily summary report
- [ ] Profit/loss report
- [ ] Client transaction report
- [ ] Pending transactions report
- [ ] Quote report
- [ ] Dashboard KPI widgets (in/out, profit, pending, quotes)

---

## Phase 6: Daily Operations

**Target Version:** v1.1.0  
**Estimated Duration:** 3–4 weeks

### Objectives
- Cash management and shift tracking
- Daily closing with reconciliation
- Basic settlements

### Deliverables
- [ ] Cash & Shifts Center
- [ ] Daily Closing Center
- [ ] Settlements Center (basic)
- [ ] Capital & Liquidity Center (basic)
- [ ] Cash difference handling with approval

---

## Phase 7: Discovery & Partner Basics

**Target Version:** v1.0.0 (MVP) + v1.2.0 (enhanced)  
**Estimated Duration:** 2–3 weeks (MVP portion parallel with Phase 5)

### MVP Portion (v1.0.0)
- [ ] Public landing pages
- [ ] Public office directory (basic search)
- [ ] Office partner search (basic)
- [ ] Partner request send/accept/reject
- [ ] Verification status display
- [ ] Service listing with unverified labels

### Enhanced (v1.2.0)
- [ ] Advanced search filters
- [ ] Client online quote request
- [ ] Office service trust display (manual scores)

---

## Phase 8: Smart Tools

**Target Version:** v1.3.0+  
**Estimated Duration:** 4–6 weeks

### Objectives
- AI-assisted operations (suggest only)
- Smart data import
- Receipt scanning

### Deliverables
- [ ] Smart Import Center (Excel, CSV)
- [ ] Receipt AI Scanner (FlashAI)
- [ ] AI pricing assistant (suggestions)
- [ ] AI report summaries
- [ ] AI audit risk detection
- [ ] Migration Center (legacy imports)

---

## Phase 9: Integrations

**Target Version:** v1.4.0+  
**Estimated Duration:** 6–8 weeks

### Objectives
- Official API connections
- Webhook processing
- Pending review workflow for external data

### Deliverables
- [ ] Integration Hub architecture
- [ ] Wise integration (if licensed)
- [ ] Rate provider APIs
- [ ] Webhook receiver and sync logs
- [ ] External transaction → Pending Review → Post

### Constraints
- Official APIs only
- No scraping as core architecture
- Legal/licensing compliance per integration

---

## Phase 10: Partner Network

**Target Version:** v1.5.0+  
**Estimated Duration:** 6–8 weeks

### Deliverables
- [ ] Full Business Identity & verification workflows
- [ ] Service trust score automation
- [ ] Deal Ticket Center
- [ ] Partner settlements
- [ ] Disputes Center
- [ ] Ratings system

---

## Phase 11: Global Scale

**Target Version:** v2.0.0+  
**Estimated Duration:** Ongoing

### Deliverables
- [ ] Full marketplace automation
- [ ] Mobile app (React Native or PWA)
- [ ] Public API with documentation
- [ ] Enterprise plans and features
- [ ] Advanced AI (CFO, Auditor)
- [ ] Advanced compliance module
- [ ] Multi-region deployment
- [ ] Flash Academy
- [ ] Sandbox/Demo mode

---

## Release Versioning Plan

| Version | Phase | Milestone |
|---------|-------|-----------|
| v0.1.0 | Phase 1 | Project shell |
| v0.2.0 | Phase 2 | Auth + multi-tenant |
| v0.3.0 | Phase 3 | Financial engine |
| v0.4.0 | Phase 4 | Remittance pricing |
| v0.5.0 | Phase 5 | Documents + reports |
| **v1.0.0** | **Phase 5 + 7 (MVP)** | **First production release** |
| v1.1.0 | Phase 6 | Daily operations |
| v1.2.0 | Phase 7 enhanced | Discovery upgrade |
| v1.3.0 | Phase 8 | Smart tools |
| v1.4.0 | Phase 9 | Integrations |
| v1.5.0 | Phase 10 | Partner network |
| v2.0.0 | Phase 11 | Global scale |

---

## Git Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch for staging |
| `feature/*` | Individual feature work |
| `release/*` | Release preparation |
| `hotfix/*` | Production emergency fixes |

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep into MVP | Delayed launch | Strict MVP_SCOPE.md adherence |
| Financial calculation errors | Trust loss | Centralized engine + tests |
| Tenant data leakage | Critical security | RLS + server-side checks |
| Rate complexity (قص tiers) | UX confusion | Clear calculator UI + docs |
| Non-programmer continuity | Stalled development | Strong documentation (this phase) |
| Breaking live users on update | Business disruption | Migrations, feature flags, staging |

---

*Roadmap is a living plan. Review and adjust at the end of each phase.*
