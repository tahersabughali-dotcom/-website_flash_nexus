import Link from "next/link";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";

const placeholderOffices = [
  {
    name: "Al-Noor Exchange",
    city: "Doha",
    country: "Qatar",
    route: "QAT → GZA",
    verified: true,
    services: ["Remittance", "Cash delivery"],
  },
  {
    name: "Quick Transfer Office",
    city: "Doha",
    country: "Qatar",
    route: "QAT → GZA",
    verified: false,
    services: ["Remittance"],
  },
  {
    name: "Gulf Remittance Hub",
    city: "Dubai",
    country: "UAE",
    route: "UAE → EGY",
    verified: true,
    services: ["Remittance", "Bank transfer"],
  },
];

export const metadata = {
  title: "Find Offices",
};

export default function OfficesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PageHeader
        title="Public Office Directory"
        subtitle="Search for exchange offices by route, service, and verification level."
        badge={<StatusBadge variant="warning">Placeholder — no real search</StatusBadge>}
      />

      {/* Search filters placeholder */}
      <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Search filters (UI only)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Country",
            "City",
            "Origin country",
            "Destination",
            "Service type",
            "Route / corridor",
            "Verification level",
          ].map((label) => (
            <div key={label}>
              <label className="mb-1 block text-xs font-medium text-muted">
                {label}
              </label>
              <select
                disabled
                className="w-full rounded-lg border border-border bg-gray-50 px-3 py-2 text-sm text-muted"
              >
                <option>Select...</option>
              </select>
            </div>
          ))}
        </div>
        <button
          type="button"
          disabled
          className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white opacity-60"
        >
          Search (coming soon)
        </button>
      </div>

      {/* Placeholder results */}
      <div className="mt-8 space-y-4">
        {placeholderOffices.map((office) => (
          <div
            key={office.name}
            className="rounded-xl border border-border bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {office.name}
                </h3>
                <p className="text-sm text-muted">
                  {office.city}, {office.country}
                </p>
                <p className="mt-1 text-sm text-brand">Route: {office.route}</p>
                <p className="mt-2 text-sm text-muted">
                  Services: {office.services.join(", ")}
                </p>
              </div>
              <StatusBadge variant={office.verified ? "success" : "warning"}>
                {office.verified ? "Verified" : "Unverified"}
              </StatusBadge>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled
                className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white opacity-60"
              >
                Request Quote
              </button>
              <Link
                href="/register/client"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-brand-subtle"
              >
                Contact
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
