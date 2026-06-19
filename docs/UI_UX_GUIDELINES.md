# Flash Nexus — UI/UX Guidelines

**Document Version:** 1.0  
**Last Updated:** June 2026  

---

## 1. Design Philosophy

> **Simple UI. Powerful backend.**

The office owner should feel guided, not overwhelmed. The accountant should feel efficient, not restricted. The client should feel trust, not confusion.

### Core Principles

| Principle | Meaning |
|-----------|---------|
| **Clarity over density** | Show what matters now; hide complexity behind progressive disclosure |
| **Action-oriented** | Every screen answers "what should I do?" |
| **Trust through transparency** | Verification status, profit indicators, audit info visible when relevant |
| **RTL-first** | Arabic layout is primary, not an afterthought |
| **Mobile-aware** | Managers check dashboards on phones |
| **Consistent patterns** | Same components, same behaviors across modules |

---

## 2. Visual Identity

### 2.1 Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| Primary Blue | `#1E40AF` (blue-800) | Headers, primary buttons, active nav |
| Primary Light | `#3B82F6` (blue-500) | Links, icons, accents |
| Primary Subtle | `#EFF6FF` (blue-50) | Backgrounds, cards, highlights |
| White | `#FFFFFF` | Main background, cards |
| Gray Text | `#374151` (gray-700) | Body text |
| Gray Muted | `#6B7280` (gray-500) | Secondary text, labels |
| Success Green | `#059669` (emerald-600) | Profitable, verified, approved |
| Warning Amber | `#D97706` (amber-600) | Unverified, weak profit, pending |
| Danger Red | `#DC2626` (red-600) | Losing, suspended, rejected |
| Border | `#E5E7EB` (gray-200) | Card borders, dividers |

### 2.2 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page title | Inter / Noto Sans Arabic | 24px (1.5rem) | 700 |
| Section heading | Inter / Noto Sans Arabic | 18px (1.125rem) | 600 |
| Body | Inter / Noto Sans Arabic | 14px (0.875rem) | 400 |
| Small / Label | Inter / Noto Sans Arabic | 12px (0.75rem) | 500 |
| Numbers (financial) | Tabular nums, monospace optional | 14–16px | 600 |

- **Arabic:** Noto Sans Arabic or IBM Plex Sans Arabic
- **English:** Inter
- Financial numbers use `font-variant-numeric: tabular-nums` for alignment

### 2.3 Logo & Branding

- Public branding: **Flash Nexus** / **فلاش نِكسَس**
- Logo: Lightning bolt + connection node concept (to be designed)
- Internal code name `flash95` never shown in UI
- Tagline on landing: "The Operating System for Exchange Offices & Financial Networks"

---

## 3. Layout System

### 3.1 Application Shell

```
┌──────────────────────────────────────────────────────────┐
│  Topbar: Logo | Office Name | Search | Notifications | User │
├──────────┬───────────────────────────────────────────────┤
│          │                                               │
│ Sidebar  │              Main Content Area                │
│ (nav)    │                                               │
│          │                                               │
│          │                                               │
│          │                                               │
└──────────┴───────────────────────────────────────────────┘
```

### 3.2 Sidebar Navigation

- Collapsible on desktop
- Drawer/hamburger on mobile
- Grouped by module category:
  - **Overview** — Dashboard
  - **Operations** — Transactions, Clients, Pricing
  - **Finance** — Accounts, Reports
  - **Network** — Directory, Partners
  - **Admin** — Settings, Users
- Active item: primary blue background
- Icons from Lucide (shadcn/ui default)

### 3.3 Topbar

- Office switcher (if user belongs to multiple offices)
- Global search (future)
- Notification bell with badge count
- User menu: profile, language, logout
- RTL: sidebar flips to right, topbar elements mirror

### 3.4 Content Area

- Max width: `1280px` for forms and tables
- Full width for dashboards and reports
- Consistent padding: `24px` (p-6)
- Page header: title + description + primary action button

---

## 4. RTL (Arabic) Support

### 4.1 Requirements

| Requirement | Implementation |
|-------------|----------------|
| Layout direction | `dir="rtl"` on `<html>` when Arabic selected |
| Sidebar position | Right side in RTL |
| Text alignment | Right-aligned for Arabic content |
| Icons with direction | Chevron, arrow icons flip |
| Numbers | LTR within RTL context (standard practice) |
| Forms | Labels above inputs, right-aligned in RTL |
| Tables | Column order may mirror for readability |

### 4.2 Language Toggle

- Settings → Language: العربية | English
- Persisted in user preferences
- MVP: Arabic primary, English strings prepared
- Future: full i18n with next-intl or similar

### 4.3 Bilingual Content

- UI labels: translation files
- User-generated content: stored as entered (no auto-translate)
- Financial terms: support Arabic labels (قص, رسوم, ربح)

---

## 5. Component Patterns

### 5.1 Use shadcn/ui Components

| Component | Usage |
|-----------|-------|
| Button | Primary, secondary, destructive, ghost |
| Card | Dashboard widgets, form sections |
| Table | Transactions, clients, reports |
| Dialog | Confirmations, quick forms |
| Sheet | Mobile sidebar, detail panels |
| Badge | Status, verification, profit class |
| Alert | Warnings (losing transaction, unverified) |
| Tabs | Module sub-sections |
| Form | All data entry (react-hook-form + zod) |
| Select / Combobox | Country, currency, corridor selectors |
| Toast | Success/error notifications |

### 5.2 Status Badges

| Status | Color | Example |
|--------|-------|---------|
| Verified | Green | `✅ Verified` |
| Unverified | Amber | `⚠️ Unverified` |
| Suspended | Red | `🚫 Suspended` |
| Pending | Blue | `🔄 Pending` |
| Profitable | Green | `+42.00 QAR` |
| Losing | Red | `-15.00 QAR` |
| Approved | Green | `Approved` |
| Draft | Gray | `Draft` |

### 5.3 Financial Display

```
Amount format:
  - Always show currency code or symbol
  - 2 decimal places (or per currency config)
  - Thousands separator
  - Negative amounts in red with minus sign
  - Positive profit with + prefix in green

Example: +1,324.04 USD  |  -25.00 USD (قص)
```

---

## 6. Screen Guidelines by User Type

### 6.1 Manager / Owner

**Goal:** Answer daily questions in under 30 seconds.

| Screen | Key Elements |
|--------|--------------|
| Dashboard | KPI cards (in/out/profit), alerts, quick actions |
| Pricing Calculator | Large input fields, instant result, profit indicator |
| Approvals | Queue with one-click approve/reject |
| Reports | Pre-built, one-click generate |

**UX Rules:**
- Maximum 3 clicks to quote a customer
- Dashboard loads with today's data by default
- Alerts are actionable (click → go to item)

### 6.2 Accountant

**Goal:** Fast, accurate transaction entry.

| Screen | Key Elements |
|--------|--------------|
| Transaction Form | Auto-fill from quote, clear field labels |
| Client Search | Quick search by name/phone/number |
| Transaction List | Filters, status, attachment indicator |
| Audit View | Read-only history on transaction detail |

**UX Rules:**
- Tab through form fields efficiently
- Required fields clearly marked
- Attachment upload drag-and-drop
- Cannot see delete button (void only)

### 6.3 Client

**Goal:** Find a trusted office and request service.

| Screen | Key Elements |
|--------|--------------|
| Office Directory | Search filters, result cards, verification badges |
| Office Profile | Services, corridors, contact, request button |
| My Requests | Status tracking |
| My Documents | Invoices, receipts |

**UX Rules:**
- No internal office data visible
- Verification status prominent
- Simple registration (minimal fields)
- Mobile-first directory browsing

### 6.4 Super Admin

**Goal:** Platform oversight.

| Screen | Key Elements |
|--------|--------------|
| Office List | Verification status, plan, actions |
| Verification Queue | Documents, approve/reject |
| System Status | Version, environment, feature flags |

---

## 7. Key Screen Wireframes (Conceptual)

### 7.1 Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  Dashboard                              [Today ▼]       │
├──────────┬──────────┬──────────┬──────────────────────────┤
│ Incoming │ Outgoing │  Profit  │  Pending Approvals (3)  │
│ 45,200   │ 32,100   │ +8,450   │  [Review →]             │
│ QAR      │ QAR      │ QAR      │                         │
├──────────┴──────────┴──────────┴──────────────────────────┤
│  ⚠️ Alerts                                              │
│  • 2 quotes expiring in 10 minutes                      │
│  • 1 transaction missing attachment                     │
├─────────────────────────────────────────────────────────┤
│  Latest Transactions                    [View All →]    │
│  ┌─────┬──────────┬────────┬────────┬────────┐         │
│  │ #   │ Client   │ Amount │ Type   │ Status │         │
│  ├─────┼──────────┼────────┼────────┼────────┤         │
│  │ 142 │ Ahmed    │ 5000   │ Remit  │ ✅     │         │
│  └─────┴──────────┴────────┴────────┴────────┘         │
├─────────────────────────────────────────────────────────┤
│  Quick Actions                                          │
│  [+ Transaction]  [Calculate Quote]  [+ Client]         │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Remittance Pricing Calculator

```
┌─────────────────────────────────────────────────────────┐
│  Remittance Pricing                                     │
├────────────────────────┬────────────────────────────────┤
│  INPUT                 │  RESULT                        │
│                        │                                │
│  From: [Qatar      ▼]  │  Send:      5,000.00 QAR      │
│  To:   [Gaza       ▼]  │  Rate:      0.2740            │
│  Amount: [5000      ]  │  Cut:       -25.00 USD        │
│  Send: [QAR        ▼]  │  Fees:      -15.00 QAR        │
│  Receive: [USD     ▼]  │  ─────────────────────        │
│  Method: [Cash     ▼]  │  Receive:   1,324.04 USD      │
│  Client: [Search...  ] │  Profit:    +42.00 QAR ✅     │
│                        │  Valid:     15 min              │
│  [Calculate]           │                                │
│                        │  [Save Quote] [Convert → Tx]   │
└────────────────────────┴────────────────────────────────┘
```

---

## 8. Public Website Pages

### 8.1 Page List (MVP)

| Page | Purpose |
|------|---------|
| `/` | Landing — hero, value props, CTAs |
| `/for-clients` | Client benefits |
| `/for-offices` | Office benefits |
| `/offices` | Public directory search |
| `/offices/[slug]` | Office public profile |
| `/register/client` | Client registration |
| `/register/office` | Office registration |
| `/login` | Login |
| `/about` | About Flash Nexus |
| `/contact` | Contact form |

### 8.2 Landing Page Structure

```
1. Hero: Tagline + "Register Office" / "Find Office" CTAs
2. Value props: 3 columns (Speed, Trust, Control)
3. How it works: 3 steps
4. For Offices / For Clients sections
5. Trust indicators (verification, audit, security)
6. Footer: links, contact, language
```

### 8.3 Public vs Authenticated Layout

| Layout | Header | Sidebar | Footer |
|--------|--------|---------|--------|
| Public | Marketing nav | None | Full footer |
| Authenticated | App topbar | Module sidebar | Minimal |

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 640px | Sidebar drawer, stacked cards, simplified tables |
| Tablet | 640–1024px | Collapsible sidebar, 2-column dashboard |
| Desktop | > 1024px | Full sidebar, multi-column dashboard |

### Mobile Priorities

1. Dashboard KPIs (managers check on phone)
2. Pricing calculator
3. Approval queue
4. Office directory (clients)

---

## 10. Accessibility

| Requirement | Standard |
|-------------|----------|
| Color contrast | WCAG AA minimum |
| Keyboard navigation | All interactive elements focusable |
| Screen reader | ARIA labels on icons and status badges |
| Form errors | Associated with fields, announced |
| Focus indicators | Visible focus ring |

---

## 11. Empty States

Every list/table must have a meaningful empty state:

```
┌─────────────────────────────────────┐
│         📋                          │
│   No transactions yet               │
│   Start by creating your first      │
│   transaction or converting a quote.  │
│                                     │
│   [+ New Transaction]               │
└─────────────────────────────────────┘
```

---

## 12. Loading & Error States

| State | Pattern |
|-------|---------|
| Loading | Skeleton placeholders (shadcn Skeleton) |
| Error | Alert with retry button |
| Offline | Banner notification (future PWA) |

---

## 13. Anti-Patterns (Avoid)

| Don't | Do Instead |
|-------|------------|
| Crowd dashboard with 20 widgets | 4–6 KPIs + alerts + recent items |
| Hide verification status | Prominent badge always |
| Use red/green only for decoration | Reserve for financial meaning |
| Hardcode Arabic strings in components | Use translation files |
| Put business logic in UI | Display service results only |
| Show delete button on transactions | Show void with confirmation |
| Auto-approve without user action | Explicit approve button |

---

## 14. Design Tokens (Tailwind Config)

```javascript
// Conceptual — to be added in tailwind.config
theme: {
  extend: {
    colors: {
      brand: {
        50: '#EFF6FF',
        500: '#3B82F6',
        800: '#1E40AF',
      }
    },
    fontFamily: {
      sans: ['Inter', 'Noto Sans Arabic', 'sans-serif'],
    }
  }
}
```

---

*Consistency builds trust. Every screen should feel like Flash Nexus, not a collection of different apps.*
