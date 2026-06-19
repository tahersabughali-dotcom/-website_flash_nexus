# Flash Nexus — Project Overview

**Official Name:** Flash Nexus  
**Arabic Brand Name:** فلاش نِكسَس  
**Internal Code Name:** flash95 (development only)  
**Tagline (EN):** The Operating System for Exchange Offices & Financial Networks  
**Tagline (AR):** نظام التشغيل المتكامل لمكاتب الصرافة والشبكات المالية  

**Document Version:** 1.0  
**Status:** Phase 0 — Architecture & Documentation  
**Last Updated:** June 2026  

---

## 1. Executive Summary

Flash Nexus is a modular, multi-tenant SaaS platform designed to become the **command center** for exchange offices, money transfer businesses, remittance operators, and financial service networks.

It is **not** a simple website, accounting tool, remittance calculator, CRM, invoice generator, marketplace, or AI product in isolation. It is an integrated **operating system** that connects:

- Office owners and managers
- Accountants and cashiers
- Clients seeking trusted financial services
- Partner offices in multi-office networks
- Pricing, accounting, compliance, and future AI-assisted operations

The platform answers operational, financial, and strategic questions in plain language — not only recording numbers, but explaining business reality.

---

## 2. Brand Meaning

| Element | Meaning |
|---------|---------|
| **Flash** | Speed, lightning, instant action |
| **Nexus** | Connection point, hub, network center linking multiple parties |
| **Combined** | The fast connection hub between exchange offices, clients, partners, financial services, remittance pricing, accounting, and trusted office networks |

### Internal Module Names (Public Branding Uses Flash Nexus)

| Internal Name | Purpose |
|---------------|---------|
| FlashCount Engine | Accounting and balance engine |
| FlashAudit Center | Audit and risk center |
| FlashQuote / Remittance Pricing Center | Pricing and quote module |
| FlashNetwork | Office network and partner marketplace |
| FlashDocs | Invoices and documents |
| FlashRates | Exchange rates center |
| FlashAI | Future AI center |

---

## 3. Product Vision

Flash Nexus should help an office owner or manager answer questions such as:

- How much money came in today? How much went out?
- What is my real profit or loss?
- Where is my capital and liquidity?
- Which clients or partners owe me money?
- Which transactions are pending, edited, or need approval?
- Was the exchange rate, fee, or cut (قص) correct?
- Can I quote a customer without asking the accountant?
- What is the current price for Qatar → Gaza?
- Which execution route is better?
- Which partner office can deliver this service?
- Is this office or service verified?
- Can clients find my office? Can I find partner offices?
- Can we keep developing the live system without stopping users?

The manager dashboard should surface: income, outgoing, profit, loss, liquidity, capital, pending money, risk alerts, price alerts, weak-profit transactions, missing attachments, partner settlement issues, pending approvals, quote expiry, and daily closing status.

---

## 4. Core Product Philosophy

### Simple UI, Powerful Backend

| Layer | Principle |
|-------|-----------|
| **Frontend** | Clean, white/blue, premium, Arabic RTL-ready, mobile-friendly, uncluttered — easy for managers, powerful for accountants, controlled for clients, professional for partners |
| **Backend** | Precise, modular, audit-ready, financially safe, secure, scalable, multi-tenant, migration-ready, integration-ready, AI-ready |

The office owner should **not** need programming or deep accounting knowledge. The system should **guide** them.

---

## 5. What Flash Nexus Is

Flash Nexus is a **long-term modular SaaS platform** for:

1. **Internal operations** — transactions, accounts, balances, daily closing, cash shifts
2. **Remittance pricing** — country price lists, cut rules, quotes, rate locks
3. **Accounting** — chart of accounts, journal entries, profit/loss, capital, liquidity
4. **Documents** — invoices, receipts, statements, future document studio
5. **Network & marketplace** — public office directory, partner discovery, deal tickets
6. **Compliance & audit** — verification workflows, audit logs, risk monitoring
7. **Future capabilities** — AI assistance, official API integrations, mobile, public API

---

## 6. What Flash Nexus Is Not (At Launch)

- Not a replacement for legal licensing or regulatory compliance
- Not an unofficial scraping-based rate aggregator as core architecture
- Not an AI that approves or modifies financial records without human oversight
- Not a monolithic app where all modules ship at once
- Not a temporary project — it is designed for continuous post-launch development

---

## 7. Target Users

| User Type | Primary Need |
|-----------|--------------|
| **Super Admin** | Platform operations, subscriptions, verification, feature flags |
| **Office Owner** | Full office control, strategy, approvals, visibility |
| **Financial Manager** | Capital, liquidity, P&L, settlements, risk |
| **Accountant** | Transaction entry, attachments, reports (within permissions) |
| **Cashier** | Cash box, shifts, receipts, handover |
| **Auditor** | Read-heavy review of transactions, edits, audit logs |
| **Client / Customer** | Find offices, request quotes, track requests, view own documents |
| **Partner Office** | Partnerships, shared operations, settlements |
| **AI Assistant** (future) | Analyze, suggest, detect — never approve alone |

---

## 8. Registration Model

Two distinct registration paths:

1. **Client Registration** — marketplace and self-service portal entry
2. **Office Registration** — business onboarding, verification, internal operations

This dual model is essential: Flash Nexus is both an **internal management system** and a **network/marketplace** where clients find offices and offices find partners.

---

## 9. Mandatory Golden Rules (Summary)

These rules govern all architecture and development decisions. Full detail is in `FINANCIAL_RULES.md`, `SECURITY_AND_PERMISSIONS.md`, and `DEVELOPMENT_RULES.md`.

1. Never permanently delete financial transactions
2. Every financial change has an audit log
3. Every transaction records creator, editor, approver, and rate at time of entry
4. Every quote has a validity period; expired quotes must be recalculated
5. Every rate has source, timestamp, and history
6. Every cut (قص) and fee rule change is audited
7. Multi-tenant isolation — every office has isolated data
8. Business logic centralized in services/engines, not UI
9. Financial rules in configuration tables, not hardcoded
10. AI never approves or silently modifies financial records
11. External integrations via official APIs, webhooks, or manual import — not unstable scraping
12. Unverified services never presented as verified
13. Dev / staging / production separation with safe migrations and feature flags
14. Core financial engine before advanced AI or integrations

---

## 10. Recommended Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL |
| Auth / DB / Storage | Supabase |
| Architecture | Modular SaaS, multi-tenant, RBAC, audit-ready |
| Environments | Development, Staging, Production |
| Future | AI providers, official financial APIs, webhooks, mobile, public API, CI/CD |

---

## 11. Development Approach

- Built **step by step** using Cursor
- The primary stakeholder is **not a programmer** — documentation, architecture, and code must be extremely organized, clear, safe, and easy to continue
- **Phase 0 (current):** Documentation and architecture only — no application code
- **MVP first:** Practical, stable, focused — not overloaded
- **Continuous development after launch:** Live users must not be blocked by ongoing development

---

## 12. Documentation Index

| Document | Purpose |
|----------|---------|
| `PRODUCT_REQUIREMENTS.md` | Full PRD |
| `MODULES_MAP.md` | All modules, dependencies, phase assignment |
| `MVP_SCOPE.md` | First version boundaries |
| `ROADMAP.md` | Phased delivery plan |
| `DATA_MODEL_CONCEPT.md` | Conceptual entities and relationships |
| `FINANCIAL_RULES.md` | Financial safety and calculation rules |
| `REMITTANCE_PRICING_CENTER.md` | Pricing module deep dive |
| `REGISTRATION_AND_MARKETPLACE.md` | Registration and network flows |
| `UI_UX_GUIDELINES.md` | Design and UX principles |
| `DEVELOPMENT_RULES.md` | Engineering standards |
| `DEPLOYMENT_AND_VERSIONING.md` | Environments, releases, migrations |
| `SECURITY_AND_PERMISSIONS.md` | Roles, isolation, protection |
| `FUTURE_FEATURES.md` | Post-MVP capabilities |

---

## 13. Success Criteria (Long-Term)

Flash Nexus succeeds when an exchange office can:

1. Run daily operations with confidence in numbers and audit trail
2. Quote remittance prices instantly without accountant dependency
3. See real profit, loss, capital, and liquidity at a glance
4. Onboard staff with clear roles and permissions
5. Be discovered by clients and partner offices (when verified and opted in)
6. Continue receiving platform updates without operational disruption
7. Scale from a single office to a multi-branch, multi-partner network

---

*This document is the north star for all Flash Nexus development. When in doubt, return here and to the Golden Rules.*
