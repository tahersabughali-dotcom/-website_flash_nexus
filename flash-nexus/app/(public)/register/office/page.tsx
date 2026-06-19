import Link from "next/link";

import { BrandLogoCenter } from "@/components/brand/BrandWordmark";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const metadata = {
  title: "Office Registration",
};

export default function OfficeRegisterPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <BrandLogoCenter variant="compact" className="mb-8" />
      <PageHeader
        title="Office Registration"
        subtitle="تسجيل مكتب صرافة"
        badge={<StatusBadge variant="warning">Form placeholder</StatusBadge>}
      />

      <form className="mt-8 space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Commercial name
          </label>
          <input
            type="text"
            placeholder="Your exchange office name"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            type="email"
            placeholder="office@example.com"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Country
            </label>
            <select className="w-full rounded-lg border border-border px-3 py-2 text-sm">
              <option>Qatar</option>
              <option>UAE</option>
              <option>Saudi Arabia</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              City
            </label>
            <input
              type="text"
              placeholder="Doha"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Services offered
          </label>
          <select className="w-full rounded-lg border border-border px-3 py-2 text-sm">
            <option>Remittance</option>
            <option>Currency exchange</option>
            <option>Cash delivery</option>
            <option>Multiple services</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" className="rounded border-border" />
          Show my office in the public directory (when verified)
        </label>
        <button
          type="button"
          disabled
          className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white opacity-60"
        >
          Create office account (Phase 2)
        </button>
        <p className="text-center text-xs text-muted">
          Already registered?{" "}
          <Link href="/login" className="text-brand hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
