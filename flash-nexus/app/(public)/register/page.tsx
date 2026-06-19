import Link from "next/link";
import { Building2, Users } from "lucide-react";

import { BrandLogoCenter } from "@/components/brand/BrandWordmark";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/StatCard";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <BrandLogoCenter variant="full" className="mb-8" />
      <PageHeader
        title="Create your account"
        subtitle="Choose how you want to use Flash Nexus"
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <SectionCard
          title="Register as Client"
          description="للعملاء — Find offices and request services"
        >
          <Users className="mb-4 h-10 w-10 text-brand-light" />
          <p className="mb-6 text-sm text-muted">
            Search for trusted exchange offices, request quotes, track service
            requests, and view your invoices and receipts.
          </p>
          <Link
            href="/register/client"
            className="inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light"
          >
            Continue as Client
          </Link>
        </SectionCard>

        <SectionCard
          title="Register as Office"
          description="لمكاتب الصرافة — Manage your business operations"
        >
          <Building2 className="mb-4 h-10 w-10 text-brand-light" />
          <p className="mb-6 text-sm text-muted">
            Set up your exchange office, manage transactions, pricing, accounting,
            employees, and partner network.
          </p>
          <Link
            href="/register/office"
            className="inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light"
          >
            Continue as Office
          </Link>
        </SectionCard>
      </div>
    </div>
  );
}
