import type { ModuleDefinition } from "@/types/module";

export const modules: ModuleDefinition[] = [
  {
    slug: "administration",
    title: "Administration Center",
    arabicTitle: "مركز الإدارة",
    description:
      "Manage office profile, branches, employees, roles, permissions, tasks, and approvals.",
    status: "MVP",
    plannedFeatures: [
      "Office profile and branches",
      "Employee invitations",
      "Role and permission management",
      "Task and approval queues",
    ],
  },
  {
    slug: "clients",
    title: "Clients Center",
    arabicTitle: "مركز العملاء",
    description:
      "Client profiles, balances, limits, risk levels, and communication history.",
    status: "MVP",
    plannedFeatures: [
      "Client CRUD with statuses",
      "Credit and daily limits",
      "VIP and risk classification",
      "Transaction and invoice history",
    ],
  },
  {
    slug: "transactions",
    title: "Transactions Center",
    arabicTitle: "مركز المعاملات",
    description:
      "Record and manage all financial transactions with full audit trail.",
    status: "Core",
    plannedFeatures: [
      "Incoming, outgoing, remittance types",
      "Void and reversal (no permanent delete)",
      "Attachments and approvals",
      "Creator, editor, approver tracking",
    ],
  },
  {
    slug: "remittance-pricing",
    title: "Remittance Pricing Center",
    arabicTitle: "مركز تسعير الحوالات",
    description:
      "Calculate customer remittance prices instantly without accountant dependency.",
    status: "Core",
    plannedFeatures: [
      "Corridor-based calculator",
      "Expected profit/loss indicator",
      "Rate lock and quote generation",
      "Manager-friendly pricing workflow",
    ],
  },
  {
    slug: "country-price-lists",
    title: "Country Price Lists",
    arabicTitle: "قوائم أسعار الدول",
    description:
      "Price rules per route and corridor (e.g., Qatar to Gaza).",
    status: "MVP",
    plannedFeatures: [
      "Origin and destination corridors",
      "Rate, percentage, cut, and fee rules",
      "Min/max amounts and delivery methods",
      "Approval requirements per corridor",
    ],
  },
  {
    slug: "cut-rules",
    title: "Cut Rules (قص)",
    arabicTitle: "قواعد القص",
    description:
      "Flexible cut configuration with tiers, corridors, and full audit trail.",
    status: "MVP",
    plannedFeatures: [
      "Fixed, percentage, and tier-based cuts",
      "Corridor and delivery method rules",
      "VIP client overrides",
      "Audited rule changes",
    ],
  },
  {
    slug: "quotes",
    title: "Quotes & Rate Lock",
    arabicTitle: "عروض الأسعار وتثبيت السعر",
    description:
      "Quote lifecycle with validity period, rate lock, and conversion to transactions.",
    status: "MVP",
    plannedFeatures: [
      "Quote validity and expiry",
      "Rate lock on active quotes",
      "Convert quote to transaction",
      "Full calculation trace",
    ],
  },
  {
    slug: "accounting",
    title: "Accounting Center",
    arabicTitle: "مركز المحاسبة",
    description:
      "Chart of accounts, journal entries, profit/loss, capital, and settlements.",
    status: "MVP",
    plannedFeatures: [
      "Chart of accounts",
      "Opening and current balances",
      "Journal entries",
      "Profit and loss reporting",
    ],
  },
  {
    slug: "flashcount",
    title: "FlashCount Engine",
    arabicTitle: "محرك فلاش كاونت",
    description:
      "Central accounting and balance engine — sole authority for balance updates.",
    status: "Core",
    plannedFeatures: [
      "Transaction posting",
      "Balance consistency checks",
      "Financial snapshots",
      "Prevention of inconsistent states",
    ],
  },
  {
    slug: "invoices-documents",
    title: "Invoices & Documents",
    arabicTitle: "الفواتير والمستندات",
    description:
      "Generate invoices, receipts, and financial documents linked to transactions.",
    status: "MVP",
    plannedFeatures: [
      "Invoice and receipt templates",
      "PDF export",
      "Office logo on documents",
      "Link to transactions and quotes",
    ],
  },
  {
    slug: "reports",
    title: "Reports Center",
    arabicTitle: "مركز التقارير",
    description:
      "Daily, profit/loss, client, pending, and quote reports for office operations.",
    status: "MVP",
    plannedFeatures: [
      "Daily summary report",
      "Profit and loss",
      "Client transactions",
      "Pending and quote reports",
    ],
  },
  {
    slug: "exchange-rates",
    title: "Exchange Rates & Market",
    arabicTitle: "أسعار الصرف والسوق",
    description:
      "Reference, buy, sell, and execution rates with source, history, and alerts.",
    status: "MVP",
    plannedFeatures: [
      "Manual rate entry with history",
      "Rate source and timestamp",
      "Buy/sell/execution rate types",
      "Future API rate feeds",
    ],
  },
  {
    slug: "fees-pricing",
    title: "Fees & Pricing Center",
    arabicTitle: "مركز الرسوم والتسعير",
    description:
      "Fee rules, net profit formula, and weak-profit transaction detection.",
    status: "MVP",
    plannedFeatures: [
      "Office, partner, and platform fees",
      "Net profit calculation",
      "Profitable vs losing indicators",
      "Fee rule audit trail",
    ],
  },
  {
    slug: "capital-liquidity",
    title: "Capital & Liquidity Center",
    arabicTitle: "مركز رأس المال والسيولة",
    description:
      "Track capital, liquidity by currency and country, and expected shortages.",
    status: "Future",
    plannedFeatures: [
      "Total capital overview",
      "Liquidity by currency",
      "Money with clients and partners",
      "Currency risk alerts",
    ],
  },
  {
    slug: "cash-shifts",
    title: "Cash & Shifts Center",
    arabicTitle: "مركز النقد والورديات",
    description:
      "Open/close shifts, cash handover, difference tracking, and shift reports.",
    status: "Future",
    plannedFeatures: [
      "Shift open and close",
      "Cash handover workflow",
      "Cash difference handling",
      "Manager approval on shifts",
    ],
  },
  {
    slug: "daily-closing",
    title: "Daily Closing Center",
    arabicTitle: "مركز الإغلاق اليومي",
    description:
      "End-of-day reconciliation with manager approval and difference handling.",
    status: "Future",
    plannedFeatures: [
      "Opening and closing balances",
      "Daily profit and loss summary",
      "Pending transaction review",
      "Manager closing approval",
    ],
  },
  {
    slug: "smart-import",
    title: "Smart Import Center",
    arabicTitle: "مركز الاستيراد الذكي",
    description:
      "Import Excel, CSV, PDF, and bank statements with review and approval.",
    status: "Future",
    plannedFeatures: [
      "File upload and parsing",
      "Duplicate detection",
      "Review and approve workflow",
      "Classification assistance",
    ],
  },
  {
    slug: "receipt-scanner",
    title: "Receipt AI Scanner",
    arabicTitle: "ماسح الإيصالات الذكي",
    description:
      "Extract amounts, dates, and details from receipt images with AI assistance.",
    status: "Future",
    plannedFeatures: [
      "Receipt image upload",
      "OCR extraction",
      "Confidence scoring",
      "Human review before posting",
    ],
  },
  {
    slug: "integrations",
    title: "Integration Hub",
    arabicTitle: "مركز التكامل",
    description:
      "Official API connections to Wise, Binance, banks, and rate providers.",
    status: "Future",
    plannedFeatures: [
      "Official API integrations",
      "Webhook processing",
      "Pending review before posting",
      "Sync logs and error handling",
    ],
  },
  {
    slug: "business-network",
    title: "Business Identity & Network",
    arabicTitle: "الهوية التجارية والشبكة",
    description:
      "Office verification, trust scores, documents, and network identity.",
    status: "MVP",
    plannedFeatures: [
      "Verification status workflow",
      "Document management",
      "Public office profile",
      "Trust score (future automation)",
    ],
  },
  {
    slug: "office-services",
    title: "Office Services Network",
    arabicTitle: "شبكة خدمات المكاتب",
    description:
      "List and manage services offered with verification and visibility controls.",
    status: "Future",
    plannedFeatures: [
      "Service listings with status",
      "Verification per service",
      "Public and partner visibility",
      "Service trust scores",
    ],
  },
  {
    slug: "partner-discovery",
    title: "Partner Discovery",
    arabicTitle: "اكتشاف الشركاء",
    description:
      "Search for partner offices by corridor, service, and verification level.",
    status: "MVP",
    plannedFeatures: [
      "Office-to-office search",
      "Filter by corridor and service",
      "Verification status display",
      "Partner profile view",
    ],
  },
  {
    slug: "partner-requests",
    title: "Partner Requests",
    arabicTitle: "طلبات الشراكة",
    description:
      "Partnership lifecycle: request, review, accept, and define terms.",
    status: "MVP",
    plannedFeatures: [
      "Send partnership request",
      "Accept or reject workflow",
      "Partnership terms configuration",
      "Audited partnership changes",
    ],
  },
  {
    slug: "deal-tickets",
    title: "Deal Ticket Center",
    arabicTitle: "مركز تذاكر الصفقات",
    description:
      "Shared multi-office operations with chat, approvals, and settlement.",
    status: "Future",
    plannedFeatures: [
      "Cross-office deal tickets",
      "Shared operation tracking",
      "Chat and attachments",
      "Settlement linkage",
    ],
  },
  {
    slug: "settlements",
    title: "Settlements Center",
    arabicTitle: "مركز التسويات",
    description:
      "Client, partner, and platform settlements with aging reports.",
    status: "Future",
    plannedFeatures: [
      "Settlement tracking",
      "Aging buckets (0–3, 4–7, 8–15, 15+ days)",
      "Partner netting",
      "Settlement documents",
    ],
  },
  {
    slug: "communication",
    title: "Communication Center",
    arabicTitle: "مركز التواصل",
    description:
      "Client, team, partner, and support chat linked to records.",
    status: "Future",
    plannedFeatures: [
      "Client and partner chat",
      "Link messages to transactions",
      "Convert message to task",
      "Support channel",
    ],
  },
  {
    slug: "ai-center",
    title: "AI Center (FlashAI)",
    arabicTitle: "مركز الذكاء الاصطناعي",
    description:
      "AI-assisted analysis, pricing suggestions, and risk detection — suggest only, never approve.",
    status: "Future",
    plannedFeatures: [
      "AI report summaries",
      "Pricing suggestions",
      "Risk detection flags",
      "Receipt extraction assistance",
    ],
  },
  {
    slug: "flashaudit",
    title: "FlashAudit Center",
    arabicTitle: "مركز التدقيق فلاش",
    description:
      "Audit and risk monitoring for transactions, edits, and suspicious activity.",
    status: "Planned",
    plannedFeatures: [
      "Large transaction alerts",
      "Edited transaction monitoring",
      "Missing attachment detection",
      "Risk dashboard",
    ],
  },
  {
    slug: "incidents-disputes",
    title: "Incidents & Disputes",
    arabicTitle: "الحوادث والنزاعات",
    description:
      "Track transaction errors, client objections, and office disputes.",
    status: "Planned",
    plannedFeatures: [
      "Incident reporting",
      "Dispute workflow",
      "Resolution tracking",
      "Manager decisions",
    ],
  },
  {
    slug: "data-quality",
    title: "Data Quality Center",
    arabicTitle: "مركز جودة البيانات",
    description:
      "Monitor missing data, incomplete records, and overall data quality score.",
    status: "Planned",
    plannedFeatures: [
      "Missing attachment alerts",
      "Incomplete client records",
      "Unlinked invoices",
      "Data quality score",
    ],
  },
  {
    slug: "compliance-verification",
    title: "Compliance & Verification",
    arabicTitle: "الامتثال والتحقق",
    description:
      "Document expiry, transaction limits, and compliance review workflows.",
    status: "Planned",
    plannedFeatures: [
      "Document expiry tracking",
      "Transaction limit enforcement",
      "Compliance review queue",
      "Risk classification",
    ],
  },
  {
    slug: "subscriptions-billing",
    title: "Subscriptions & Billing",
    arabicTitle: "الاشتراكات والفوترة",
    description:
      "SaaS plan management: Basic, Pro, Enterprise with feature limits.",
    status: "Future",
    plannedFeatures: [
      "Subscription plans",
      "Usage limits",
      "Billing integration (Stripe)",
      "Plan upgrade workflow",
    ],
  },
  {
    slug: "settings",
    title: "Settings Center",
    arabicTitle: "مركز الإعدادات",
    description:
      "No-code office configuration for currencies, rules, templates, and visibility.",
    status: "MVP",
    plannedFeatures: [
      "Currency and country config",
      "Cut, fee, and approval rules",
      "Public profile visibility",
      "Language and branding",
    ],
  },
  {
    slug: "system-operations",
    title: "System Operations & Release Management",
    arabicTitle: "عمليات النظام وإدارة الإصدارات",
    description:
      "Super Admin module for deployments, migrations, feature flags, and backups.",
    status: "Planned",
    plannedFeatures: [
      "Deployment version visibility",
      "Feature flag management",
      "Migration tracking",
      "Backup and rollback status",
    ],
  },
];

export function getModuleBySlug(slug: string): ModuleDefinition | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getModuleHref(slug: string): string {
  return `/${slug}`;
}
