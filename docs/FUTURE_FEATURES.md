# Flash Nexus — Future Features

**Document Version:** 1.0  
**Last Updated:** June 2026  
**Purpose:** Document post-MVP capabilities to guide architecture without implementing now

---

## 1. Overview

This document catalogs features **explicitly deferred** from MVP. They are planned, architecturally considered, but not built until the core financial engine and remittance pricing are stable in production.

Each section includes: purpose, dependencies, phase, and key constraints.

---

## 2. AI Center (FlashAI)

**Phase:** 8+  
**Internal Name:** FlashAI

### 2.1 Planned Capabilities

| Capability | Description |
|------------|-------------|
| AI CFO | Strategic financial analysis and recommendations |
| AI Accountant | Transaction categorization suggestions |
| AI Auditor | Anomaly detection, risk flagging |
| AI Reports | Natural language report summaries |
| AI Pricing | Pricing optimization suggestions |
| AI Risk | Client and transaction risk scoring |
| AI Receipt Reader | OCR extraction from receipt images |
| AI Import | Intelligent data import from files |
| AI Market | Rate trend analysis |
| AI Service Verification | Document authenticity assistance |

### 2.2 Constraints (Non-Negotiable)

```
AI SUGGESTS — Humans DECIDE

✅ Analyze, summarize, suggest, detect, explain, extract
❌ Approve, modify, delete, or post financial records
❌ Override manager decisions
❌ Silent background changes

Every AI action → Human review → Human approval → System execution
```

### 2.3 Architecture Preparation (MVP)

- Feature flag: `AI_CENTER: false`
- Audit log supports `actor_type: 'ai'` for suggestions
- API design allows AI provider abstraction (OpenAI, Anthropic, local)
- Receipt attachment entity ready for OCR metadata

### 2.4 Dependencies

- Stable transaction and quote data
- Audit log infrastructure
- Attachment storage
- Sufficient operational data for meaningful analysis

---

## 3. External Integrations (Integration Hub)

**Phase:** 9

### 3.1 Planned Integrations

| Provider | Type | Use Case |
|----------|------|----------|
| Wise | Official API | Transfer tracking, rates |
| Binance | Official API | USDT rates, crypto transfers |
| PayPal | Official API | Payment tracking |
| Stripe | Official API | Subscription billing |
| Payoneer | Official API | Transfer tracking |
| Revolut | Official API | Business account sync |
| Banks | Open Banking / Manual | Statement import |
| Rate Providers | Official API | Live exchange rates |
| Custom APIs | Webhook | Partner office sync |

### 3.2 Integration Architecture

```
External Provider
       │
       ▼
┌─────────────────┐
│ Integration Hub │
│ - Webhook recv  │
│ - API polling   │
│ - Sync logs     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Pending Review  │  ← All external data enters here first
│ Queue           │
└────────┬────────┘
         │ Human approves
         ▼
┌─────────────────┐
│ FlashCount      │
│ Engine          │
└─────────────────┘
```

### 3.3 Constraints

- **Official APIs only** — no scraping as core architecture
- **Pending Review** — external transactions never auto-post
- **Sync logs** — every integration action logged
- **Legal compliance** — respect provider terms and licensing
- **Feature flags** — each integration independently toggleable

### 3.4 Dependencies

- Core Financial Engine stable
- Pending Review workflow
- Audit log infrastructure
- Subscription billing (for API access tiers)

---

## 4. Mobile App

**Phase:** 11

### 4.1 Planned Features

| Feature | Priority |
|---------|----------|
| Manager dashboard (KPIs) | High |
| Pricing calculator | High |
| Approval queue | High |
| Push notifications (alerts) | Medium |
| Transaction entry (simplified) | Medium |
| Client directory search | Low |
| Offline mode (read-only) | Low |

### 4.2 Technology Options

| Option | Pros | Cons |
|--------|------|------|
| React Native (Expo) | Shared TypeScript, team familiarity | Separate codebase |
| PWA | No app store, instant updates | Limited native features |
| Flutter | Performance | New language for team |

**Recommendation:** PWA first (Phase 7–8), native app if demand warrants (Phase 11).

### 4.3 Architecture Preparation

- API-first design (server actions can become REST endpoints)
- Responsive UI already mobile-friendly
- Push notification infrastructure (future)

---

## 5. Public API

**Phase:** 11

### 5.1 Planned Endpoints

| Category | Endpoints |
|----------|-----------|
| Transactions | CRUD (within permissions) |
| Quotes | Create, convert |
| Clients | CRUD |
| Reports | Generate |
| Rates | Read current rates |
| Webhooks | Subscribe to events |

### 5.2 API Design Principles

- RESTful with OpenAPI documentation
- API key authentication per office
- Rate limiting per plan tier
- Webhook delivery with retry
- Versioned: `/api/v1/...`

### 5.3 Enterprise Feature

Public API likely restricted to Pro and Enterprise plans.

---

## 6. Advanced Marketplace

**Phase:** 10–11

### 6.1 Features Beyond MVP Directory

| Feature | Description |
|---------|-------------|
| Automated trust scores | Calculated from operations, disputes, ratings |
| Deal Ticket Center | Multi-office shared operations |
| Partner settlement automation | Netting, aging, auto-reconciliation |
| Office ratings | Client and partner ratings |
| Dispute resolution | Formal dispute workflow |
| Liquidity marketplace | Offices offer/bid liquidity |
| Service-level agreements | Partner SLA tracking |
| Featured listings | Paid promotion for verified offices |

### 6.2 Trust Score Formula (Future)

```
trust_score =
  (successful_ops_weight × success_rate) +
  (volume_weight × normalized_volume) +
  (speed_weight × speed_score) +
  (dispute_weight × (1 - dispute_rate)) +
  (verification_weight × verification_level) +
  (document_weight × document_completeness) +
  (rating_weight × average_rating)
```

Displayed per service, not just per office.

---

## 7. Advanced Invoice Studio (FlashDocs)

**Phase:** Future (post-v1.5)

### 7.1 Vision

Canva-like document designer for financial documents:

- Drag-and-drop template builder
- Custom fields and layouts
- Office branding (logo, colors, stamp, signature)
- Multiple template versions
- QR code generation
- Multi-language documents
- Batch generation

### 7.2 MVP Provides

- Fixed invoice and receipt templates
- PDF export
- Office logo
- Linked to transactions

### 7.3 Future Adds

- Template editor
- Custom document types
- Email delivery
- Digital signatures
- Document versioning

---

## 8. Advanced Report Builder

**Phase:** Future (post-v1.5)

### 8.1 Vision

- Drag-and-drop report designer
- Custom filters and groupings
- Scheduled report delivery
- Export to Excel, PDF, CSV
- Chart visualizations
- Comparative period analysis

### 8.2 MVP Provides

- Pre-built reports: daily, P&L, client, pending, quotes
- PDF export
- Date range filters

---

## 9. Advanced Compliance

**Phase:** 10–11

### 9.1 Features

| Feature | Description |
|---------|-------------|
| Document expiry tracking | License, ID expiry alerts |
| Transaction limits | Per-client, per-corridor limits |
| AML screening | Integration with screening providers |
| Regulatory reporting | Export for compliance authorities |
| KYC workflows | Client verification workflows |
| Risk classification | Automated client risk scoring |
| Compliance dashboard | Officer view of compliance status |

### 9.2 Disclaimer

Flash Nexus organizes compliance data but does **not** replace legal licensing or regulatory obligations of individual offices.

---

## 10. Enterprise Features

**Phase:** 11

### 10.1 Enterprise Plan Capabilities

| Feature | Description |
|---------|-------------|
| Multi-branch management | Centralized multi-location |
| Custom roles | Beyond default role set |
| SSO / SAML | Enterprise authentication |
| Dedicated support | Priority support channel |
| Custom integrations | Bespoke API connections |
| SLA guarantees | Uptime commitments |
| Data residency | Region-specific deployment |
| White-label | Custom branding |
| Advanced audit | Extended audit retention |
| Bulk operations | Mass import/export |

### 10.2 Subscription Tiers (Conceptual)

| Plan | Users | Clients | Branches | Integrations | AI | API |
|------|-------|---------|----------|--------------|-----|-----|
| Basic | 3 | 100 | 1 | ❌ | ❌ | ❌ |
| Pro | 10 | 1,000 | 3 | 2 | Basic | ❌ |
| Enterprise | Unlimited | Unlimited | Unlimited | Unlimited | Full | ✅ |

*Pricing to be determined by product owner.*

---

## 11. Additional Future Modules

### 11.1 Communication Center (P2)

- In-app chat: client ↔ office, team, partner
- Link messages to transactions, invoices
- Convert message to task or approval
- Support chat with platform

### 11.2 Flash Academy (Future)

- In-app tutorials
- Interactive guides for transactions, pricing, closing
- Video content
- Certification for staff

### 11.3 Sandbox / Demo Mode (P2)

- Isolated environment for training
- Sample data pre-loaded
- No impact on real accounts
- Sales demonstration tool

### 11.4 Migration Center (P2)

- Import from Al-Aseel, Al-Mizan
- Excel/CSV bulk import
- Opening balance import
- Data mapping wizard
- Validation and review before posting

### 11.5 Smart Import Center (Phase 8)

- AI-assisted file parsing
- Duplicate detection
- Auto-classification
- Review and approve workflow

### 11.6 System Operations Module (P2)

- Super Admin deployment dashboard
- Migration tracking
- Feature flag UI
- Backup status
- Release history

---

## 12. Architecture Decisions for Future-Proofing

These decisions in MVP/architecture prepare for future features without implementing them:

| Decision | Future Benefit |
|----------|---------------|
| Feature flags from day one | Enable modules without redeployment |
| Modular service architecture | Add integrations without rewrite |
| JSON metadata on entities | Extend without migrations |
| Audit log with entity_type | Any new entity automatically auditable |
| API route structure | Becomes public API foundation |
| Attachment entity with type | Receipt AI, document studio |
| Partnership entity with JSON terms | Deal tickets, settlements |
| Office settings as JSON | Enterprise customization |
| Calculation trace on quotes | AI pricing analysis |
| Supabase Realtime ready | Live notifications, chat |

---

## 13. Feature Prioritization Framework

When deciding what to build next post-MVP:

```
Priority Score =
  (User Demand × 3) +
  (Revenue Impact × 2) +
  (Dependency Resolution × 2) +
  (Technical Readiness × 1) -
  (Complexity × 1) -
  (Risk × 2)
```

Suggested post-MVP order (from ROADMAP.md):

1. Daily operations (cash, closing, settlements)
2. Enhanced discovery and client quote requests
3. FlashAudit basic alerts
4. Smart import
5. AI receipt scanner
6. Integration Hub (first provider)
7. Partner network automation
8. Mobile PWA
9. Public API
10. Enterprise features

---

## 14. What Will Never Be Built

| Feature | Reason |
|---------|--------|
| Unofficial rate scraping as core | Unstable, legal risk, unreliable |
| AI auto-approval of finances | Violates golden rules |
| Permanent delete of transactions | Violates golden rules |
| Cross-tenant data sharing without partnership | Security violation |
| Fake verification badges | Trust destruction |
| Cryptocurrency trading | Outside remittance scope |
| Unlicensed payment processing | Regulatory risk |

---

*Future features are exciting, but a stable financial core is the foundation everything else builds on. Resist the temptation to skip ahead.*
