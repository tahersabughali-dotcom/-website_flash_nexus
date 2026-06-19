import Link from "next/link";

import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionCard, StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="لوحة التحكم — Command center for your exchange office"
        badge={<StatusBadge variant="warning">Demo UI only</StatusBadge>}
        actions={
          <Link
            href="/remittance-pricing"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light"
          >
            Calculate Quote
          </Link>
        }
      />

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Demo UI only — no real financial data yet.</strong> Sample
        values below are static placeholders for layout demonstration.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Today Incoming"
          value="45,200 QAR"
          description="الوارد اليوم"
          trend="Sample data"
        />
        <StatCard
          title="Today Outgoing"
          value="32,100 QAR"
          description="الصادر اليوم"
        />
        <StatCard
          title="Expected Profit"
          value="+8,450 QAR"
          description="الربح المتوقع"
          trend="Sample — not calculated"
        />
        <StatCard
          title="Pending Approvals"
          value="3"
          description="بانتظار الموافقة"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Alerts"
          description="Important items requiring attention"
        >
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-amber-900">
              <span>⚠️</span> 2 quotes expiring in 10 minutes (placeholder)
            </li>
            <li className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-red-900">
              <span>📎</span> 1 transaction missing attachment (placeholder)
            </li>
            <li className="flex items-center gap-2 rounded-lg bg-brand-subtle px-3 py-2 text-brand">
              <span>✓</span> Daily closing not completed (placeholder)
            </li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Latest Transactions"
          description="Most recent activity (placeholder)"
        >
          <EmptyState
            title="No real transactions yet"
            description="Transaction data will appear here once Phase 3 Core Financial Engine is implemented."
            actionLabel="Go to Transactions"
            actionHref="/transactions"
          />
        </SectionCard>
      </div>

      <SectionCard title="Quick actions" description="Common manager tasks">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "New Transaction", href: "/transactions" },
            { label: "Calculate Quote", href: "/remittance-pricing" },
            { label: "Add Client", href: "/clients" },
            { label: "View Reports", href: "/reports" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-brand-subtle hover:text-brand"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
