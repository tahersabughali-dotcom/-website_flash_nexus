const fs = require("fs");
const path = require("path");

const slugs = [
  "administration",
  "clients",
  "transactions",
  "remittance-pricing",
  "country-price-lists",
  "cut-rules",
  "quotes",
  "accounting",
  "flashcount",
  "invoices-documents",
  "reports",
  "exchange-rates",
  "fees-pricing",
  "capital-liquidity",
  "cash-shifts",
  "daily-closing",
  "smart-import",
  "receipt-scanner",
  "integrations",
  "business-network",
  "office-services",
  "partner-discovery",
  "partner-requests",
  "deal-tickets",
  "settlements",
  "communication",
  "ai-center",
  "flashaudit",
  "incidents-disputes",
  "data-quality",
  "compliance-verification",
  "subscriptions-billing",
  "settings",
  "system-operations",
];

const titles = {
  administration: "Administration",
  clients: "Clients",
  transactions: "Transactions",
  "remittance-pricing": "Remittance Pricing",
  "country-price-lists": "Country Price Lists",
  "cut-rules": "Cut Rules",
  quotes: "Quotes",
  accounting: "Accounting",
  flashcount: "FlashCount",
  "invoices-documents": "Invoices & Documents",
  reports: "Reports",
  "exchange-rates": "Exchange Rates",
  "fees-pricing": "Fees & Pricing",
  "capital-liquidity": "Capital & Liquidity",
  "cash-shifts": "Cash & Shifts",
  "daily-closing": "Daily Closing",
  "smart-import": "Smart Import",
  "receipt-scanner": "Receipt Scanner",
  integrations: "Integrations",
  "business-network": "Business Network",
  "office-services": "Office Services",
  "partner-discovery": "Partner Discovery",
  "partner-requests": "Partner Requests",
  "deal-tickets": "Deal Tickets",
  settlements: "Settlements",
  communication: "Communication",
  "ai-center": "AI Center",
  flashaudit: "FlashAudit",
  "incidents-disputes": "Incidents & Disputes",
  "data-quality": "Data Quality",
  "compliance-verification": "Compliance",
  "subscriptions-billing": "Subscriptions",
  settings: "Settings",
  "system-operations": "System Operations",
};

function template(slug, title) {
  return `import { ModulePageContent } from "@/components/modules/ModulePageContent";

export const metadata = {
  title: "${title}",
};

export default function Page() {
  return <ModulePageContent slug="${slug}" />;
}
`;
}

slugs.forEach((slug) => {
  const dir = path.join("app", "(dashboard)", slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "page.tsx"),
    template(slug, titles[slug] || slug),
  );
});

console.log(`Created ${slugs.length} module pages`);
