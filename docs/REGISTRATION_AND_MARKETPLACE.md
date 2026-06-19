# Flash Nexus — Registration & Marketplace

**Document Version:** 1.0  
**Last Updated:** June 2026  

---

## 1. Overview

Flash Nexus serves two distinct audiences through two registration paths:

| Path | User Type | Primary Goal |
|------|-----------|--------------|
| **Client Registration** | End customers | Find trusted offices, request services |
| **Office Registration** | Business operators | Manage operations, find partners |

Both paths share the same platform authentication but diverge immediately after account type selection.

---

## 2. Registration Architecture

```
                    ┌─────────────────┐
                    │  Public Website │
                    │  (Landing Page) │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ Register Client │           │ Register Office │
    └────────┬────────┘           └────────┬────────┘
             │                             │
             ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ Client Profile  │           │ Office Profile  │
    │ Setup           │           │ Setup Wizard    │
    └────────┬────────┘           └────────┬────────┘
             │                             │
             ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ Client Portal   │           │ Office Dashboard│
    │ (Marketplace)   │           │ (Operations)    │
    └─────────────────┘           └─────────────────┘
```

---

## 3. Client Registration

### 3.1 Registration Flow

| Step | Action |
|------|--------|
| 1 | User clicks "Register as Client" |
| 2 | Enters: full name, email, password, phone, country |
| 3 | Email verification (Supabase) |
| 4 | Account created: `account_type = 'client'` |
| 5 | ClientProfile created |
| 6 | Redirect to Client Portal or Office Directory |

### 3.2 Client Profile Data

| Field | Required | Visibility |
|-------|----------|------------|
| Full name | Yes | Offices when requesting service |
| Email | Yes | Auth only (not public) |
| Phone | Recommended | Offices when requesting service |
| Country | Yes | Public in requests |
| Preferred currency | Optional | Internal |
| Avatar | Optional | Optional public |

### 3.3 Client Capabilities

| Capability | MVP | Future |
|------------|-----|--------|
| Search office directory | ✅ Basic | Advanced filters |
| View office public profiles | ✅ | |
| Request quote online | Basic | Full workflow |
| Send service request | Basic | |
| Track request status | Basic | |
| View own invoices/receipts | ✅ | |
| Upload verification documents | ❌ | P2 |
| Rate/review offices | ❌ | Phase 10 |
| In-app chat with office | ❌ | P2 |

### 3.4 Client Access Restrictions

Clients MUST NOT see:

- Internal office accounting
- Office profit/loss
- Other clients' data
- Partner settlements
- Staff information
- Unpublished office services
- Audit logs

Enforced via RBAC and RLS policies.

---

## 4. Office Registration

### 4.1 Registration Flow

| Step | Action |
|------|--------|
| 1 | User clicks "Register Your Office" |
| 2 | Enters: commercial name, email, password, country, city, phone |
| 3 | Email verification |
| 4 | Account created: `account_type = 'office_staff'` |
| 5 | Office entity created with `verification_status = 'unverified'` |
| 6 | User assigned as Office Owner |
| 7 | Office Setup Wizard begins |

### 4.2 Office Setup Wizard

| Step | Content |
|------|---------|
| 1 — Business Info | Legal name, description, contact details |
| 2 — Location | Country, city, address (optional) |
| 3 — Services | Select service types offered |
| 4 — Corridors | Countries/corridors served |
| 5 — Currencies | Supported currencies |
| 6 — Delivery Methods | Cash, bank, USDT, wallet, etc. |
| 7 — Documents | Upload licenses, registrations (optional in MVP) |
| 8 — Visibility | Public profile on/off, partner search on/off |
| 9 — Invite Team | Invite first accountant (optional) |
| 10 — Complete | Redirect to Office Dashboard |

### 4.3 Office Profile Data

| Field | Required | Public |
|-------|----------|--------|
| Commercial name | Yes | Yes |
| Legal name | Recommended | No |
| Country | Yes | Yes |
| City | Yes | Yes |
| Description | Recommended | Yes |
| Contact email | Yes | Configurable |
| Contact phone | Recommended | Configurable |
| Logo | Optional | Yes |
| Services offered | Yes | Yes |
| Corridors served | Yes | Yes |
| Currencies | Yes | Yes |
| Delivery methods | Yes | Yes |
| Verification status | System | Yes (badge) |

---

## 5. Office Verification States

### 5.1 State Machine

```
unverified → under_review → partially_verified → fully_verified → approved_partner
     │              │                                    │
     └──────────────┴──────→ suspended ←────────────────┘
```

### 5.2 State Definitions

| State | Meaning | Public Visibility |
|-------|---------|-------------------|
| **unverified** | New registration, no review | Hidden or marked unverified |
| **under_review** | Documents submitted, admin reviewing | Hidden or "Under Review" |
| **partially_verified** | Some documents verified | Visible with partial badge |
| **fully_verified** | All required documents verified | Full visibility |
| **approved_partner** | Platform-trusted partner | Enhanced badge |
| **suspended** | Risk/compliance issue | Hidden |

### 5.3 Verification Rules

1. New offices are **never** automatically verified
2. Unverified offices may appear in directory only if they opt in AND platform allows
3. Unverified offices MUST display "Unverified" badge prominently
4. Super Admin controls verification state transitions
5. Suspended offices are hidden from all public search

---

## 6. Public Office Directory

### 6.1 Purpose

Allow clients to discover exchange offices that serve their needed routes and services.

### 6.2 Search Filters

| Filter | MVP | Future |
|--------|-----|--------|
| Country (office location) | ✅ | |
| City | ✅ | |
| Origin country | ✅ | |
| Destination country | ✅ | |
| Corridor/route | ✅ | |
| Service type | ✅ | |
| Currency | ✅ | |
| Delivery method | ✅ | |
| Verification level | ✅ | |
| Rating | ❌ | Phase 10 |
| Trust score | ❌ | Phase 10 |
| Execution speed | ❌ | Phase 10 |
| Availability (online now) | ❌ | Future |

### 6.3 Search Example

```
Customer in Qatar wants to send money to Gaza.

Search:
  Origin:        Qatar
  Destination:   Gaza
  Service:       Remittance / Cash delivery
  Send currency: QAR
  Receive currency: USD

Results:
┌──────────────────────────────────────────────────────┐
│ 🏢 Al-Noor Exchange — Doha, Qatar                    │
│    ✅ Fully Verified                                 │
│    Services: Remittance, Cash delivery               │
│    Route: QAT → GZA (QAR → USD)                     │
│    Delivery: Cash pickup                             │
│    [Request Quote]  [Contact]                        │
├──────────────────────────────────────────────────────┤
│ 🏢 Quick Transfer Office — Doha, Qatar               │
│    ⚠️ Unverified                                     │
│    Services: Remittance (unverified)                 │
│    Route: QAT → GZA (QAR → USD)                     │
│    [Request Quote]                                   │
└──────────────────────────────────────────────────────┘
```

### 6.4 Directory Result Card Fields

| Field | Source |
|-------|--------|
| Office name | Office.commercial_name |
| Location | Office.country, city |
| Services | OfficeService list |
| Verification badge | Office.verification_status |
| Service status | OfficeService.verification_status |
| Delivery methods | OfficeService.delivery_methods |
| Rating/trust | Future (Phase 10) |
| CTA buttons | Request Quote, Contact (if public) |

### 6.5 Visibility Rules

| Rule | Implementation |
|------|----------------|
| Office controls visibility | `office.public_visibility` setting |
| Platform can override | Super Admin can hide suspended/high-risk |
| Unverified ≠ verified | Never show unverified as verified |
| Private data hidden | No internal balances, profit, staff |
| Contact info | Only if office enables public contact |

---

## 7. Office Partner Discovery

### 7.1 Purpose

Enable offices to find trusted partner offices for execution (e.g., cash delivery at destination).

### 7.2 Search Filters

| Filter | MVP | Future |
|--------|-----|--------|
| Country | ✅ | |
| City | ✅ | |
| Services | ✅ | |
| Corridors | ✅ | |
| Currencies | ✅ | |
| Verification level | ✅ | |
| Liquidity availability | ❌ | P2 |
| Trust score | ❌ | Phase 10 |
| Successful operations | ❌ | Phase 10 |
| Average execution speed | ❌ | Phase 10 |
| Dispute history | ❌ | Phase 10 |
| Partner fees | ❌ | P2 |
| Limits | ❌ | P2 |
| Risk level | ❌ | P2 |

### 7.3 Search Example

```
Office in Qatar needs partner in Gaza for cash delivery.

Search:
  Country:     Palestine / Gaza
  Service:     Cash delivery
  Corridor:    QAT → GZA
  Currency:    USD

Results:
┌──────────────────────────────────────────────────────┐
│ 🏢 Gaza Cash Services — Gaza City                      │
│    ✅ Approved Partner                               │
│    Services: Cash delivery ✅ Verified               │
│    Corridor: QAT → GZA                               │
│    Avg execution: ~2 hours (future)                  │
│    [Send Partnership Request]  [View Profile]          │
├──────────────────────────────────────────────────────┤
│ 🏢 New Gaza Office — Gaza City                        │
│    ⚠️ Unverified                                     │
│    Services: Cash delivery ⚠️ Unverified             │
│    [Send Partnership Request]                        │
└──────────────────────────────────────────────────────┘
```

### 7.4 Partner vs Client Directory Differences

| Aspect | Client Directory | Partner Directory |
|--------|------------------|-------------------|
| Audience | End clients | Office staff only |
| Shows partner fees | No | Yes (future) |
| Shows liquidity | No | Yes (future) |
| Shows dispute history | No | Yes (future) |
| Shows internal trust data | No | Yes (future) |
| Authentication required | No (browse), Yes (request) | Yes (office member) |

---

## 8. Partner Request Workflow

### 8.1 Lifecycle

```
1. Office A searches partner directory
2. Office A views Office B profile
3. Office A reviews services and verification status
4. Office A sends partnership request
   └── Includes: message, desired services, corridors
5. Office B receives notification
6. Office B reviews request
7. Office B may request additional documents
8. Office B decides: Accept | Reject | Pending
9. If Accepted:
   └── Define partnership terms
10. Partnership status → Active
11. Shared operations via Deal Tickets (future)
12. All changes audited
```

### 8.2 Partnership Request Data

| Field | Description |
|-------|-------------|
| requesting_office_id | Sender |
| receiving_office_id | Target |
| message | Introduction / purpose |
| requested_services | Service types needed |
| requested_corridors | Routes needed |
| status | pending, accepted, rejected |
| requested_by | User who sent |
| created_at | Timestamp |

### 8.3 Partnership Terms (On Acceptance)

| Term | Description |
|------|-------------|
| enabled_services | Which services are active |
| enabled_corridors | Which routes are active |
| enabled_currencies | Which currencies |
| partner_fees | Fee structure |
| limits | Transaction limits |
| settlement_rules | How settlements work |
| risk_notes | Internal notes |
| required_approvals | Approval thresholds |

### 8.4 MVP Scope

| Feature | Included |
|---------|----------|
| Send partnership request | ✅ |
| Accept / reject request | ✅ |
| Basic partnership record | ✅ |
| Define detailed terms | Basic JSON |
| Deal tickets | ❌ Phase 10 |
| Partner settlements | ❌ Phase 6 |
| Partner chat | ❌ P2 |

---

## 9. Service Visibility & Verification

### 9.1 Service Statuses

| Status | Display | Public Listing |
|--------|---------|----------------|
| available_verified | ✅ Available (Verified) | Yes, with verified badge |
| available_unverified | ⚠️ Available (Unverified) | Yes, with unverified warning |
| under_review | 🔄 Under Review | Hidden or "Under Review" |
| weak_experience | ⚠️ Limited Experience | Yes, with warning |
| not_available | ❌ Not Available | No |
| suspended | 🚫 Suspended | No |
| high_risk | 🔴 High Risk | Hidden |

### 9.2 Visibility Options

| Setting | Who Can See |
|---------|-------------|
| public | Clients + partner offices |
| partners_only | Partner offices only |
| internal | Office staff only |
| hidden | Nobody (draft) |
| requires_admin_approval | Pending admin before public |

### 9.3 Critical Rules

1. **Unverified services NEVER appear as verified**
2. Service verification is independent of office verification
3. An office can be verified but a specific service unverified
4. Marketplace trust depends on both office and service verification
5. Platform admin can suspend individual services

---

## 10. Trust Score Concept

### 10.1 Purpose

Quantify reliability of offices and services for marketplace ranking.

### 10.2 Score Components (Future — Phase 10)

| Factor | Weight (Illustrative) |
|--------|----------------------|
| Successful transactions | 25% |
| Transaction volume | 15% |
| Execution speed | 15% |
| Dispute rate (inverse) | 20% |
| Office verification level | 10% |
| Document completeness | 5% |
| Partner ratings | 10% |

### 10.3 Display

```
Service: Gaza Cash Delivery
Trust Score: 95/100 ✅

Service: PayPal Transfers
Trust Score: Unverified ⚠️ (insufficient data)
```

### 10.4 MVP Approach

- No automated trust score in MVP
- Display verification status badges only
- Manual "featured partner" flag by Super Admin (optional)

---

## 11. Client → Office Interaction Flows

### 11.1 Quote Request Flow (MVP Basic)

```
1. Client searches directory
2. Client finds office serving QAT → GZA
3. Client clicks "Request Quote"
4. Client fills: amount, currencies, delivery method, message
5. ServiceRequest created (status: pending)
6. Office notified (dashboard alert)
7. Office manager opens Remittance Pricing Center
8. Office calculates quote and responds (manual in MVP)
9. Client sees quote in portal (future: automatic)
```

### 11.2 Service Request Flow

```
Similar to quote request but for general services
(e.g., "I need Wise transfer to Europe")
Office reviews and responds
```

---

## 12. Data Isolation in Marketplace

| Data | Client Sees | Partner Office Sees | Own Office Sees |
|------|-------------|---------------------|-----------------|
| Public profile | ✅ | ✅ | ✅ |
| Public services | ✅ | ✅ | ✅ |
| Verification status | ✅ | ✅ | ✅ |
| Contact info (if public) | ✅ | ✅ | ✅ |
| Internal balances | ❌ | ❌ | ✅ |
| Profit margins | ❌ | ❌ | ✅ |
| Partner fees | ❌ | ✅ (if partnered) | ✅ |
| Client list | ❌ | ❌ | ✅ |
| Transaction history | Own only | Shared deals only | ✅ All |
| Audit logs | ❌ | ❌ | ✅ (per role) |

---

## 13. Super Admin Marketplace Controls

| Control | Description |
|---------|-------------|
| Approve office verification | State transitions |
| Suspend office | Hide from all directories |
| Suspend service | Hide specific service |
| Feature partner | Highlight in search results |
| Block public visibility | Override office setting |
| Review dispute | Incidents center (P2) |
| Platform-wide directory settings | Minimum verification for listing |

---

## 14. MVP Acceptance Criteria

- [ ] Client can register and browse office directory
- [ ] Office can register and complete setup wizard
- [ ] Office appears in directory when public visibility enabled
- [ ] Unverified offices/services show correct badges
- [ ] Office can search partner directory
- [ ] Office can send and accept partnership request
- [ ] Client cannot access office internal data
- [ ] Verification status displayed accurately

---

*The marketplace is a trust product. Verification honesty is more valuable than listing volume.*
