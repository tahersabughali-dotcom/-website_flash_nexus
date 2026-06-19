import Link from "next/link";

import { BrandLogoCenter } from "@/components/brand/BrandWordmark";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const metadata = {
  title: "Client Registration",
};

export default function ClientRegisterPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <BrandLogoCenter variant="compact" className="mb-8" />
      <PageHeader
        title="Client Registration"
        subtitle="التسجيل كعميل"
        badge={<StatusBadge variant="warning">Form placeholder</StatusBadge>}
      />

      <form className="mt-8 space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Full name
          </label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Phone
          </label>
          <input
            type="tel"
            placeholder="+974 ..."
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Country
          </label>
          <select className="w-full rounded-lg border border-border px-3 py-2 text-sm">
            <option>Qatar</option>
            <option>UAE</option>
            <option>Saudi Arabia</option>
            <option>Other</option>
          </select>
        </div>
        <button
          type="button"
          disabled
          className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white opacity-60"
        >
          Create account (Phase 2)
        </button>
        <p className="text-center text-xs text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-brand hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
