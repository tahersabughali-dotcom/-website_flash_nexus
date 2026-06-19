import { brand } from "@/lib/constants/brand";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/StatCard";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <PageHeader
        title="About Flash Nexus"
        subtitle={brand.arabicBrandName}
      />

      <div className="mt-8 space-y-6">
        <SectionCard
          title="What is Flash Nexus?"
          description={brand.tagline}
        >
          <p className="text-sm leading-relaxed text-muted">
            Flash Nexus is a modular SaaS operating system designed for exchange
            offices, money transfer businesses, remittance operators, and financial
            service networks. It is not a simple website or a single-purpose tool —
            it is the command center that connects internal operations, remittance
            pricing, accounting, partner networks, and future AI-assisted workflows.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {brand.arabicTagline}
          </p>
        </SectionCard>

        <SectionCard title="Our philosophy" description="Simple UI. Powerful backend.">
          <ul className="space-y-2 text-sm text-muted">
            <li>• Managers get answers without depending on accountants for every quote</li>
            <li>• Every financial record is protected and audit-ready</li>
            <li>• Offices control their public visibility and verification status</li>
            <li>• The platform grows with your office — from single location to partner network</li>
          </ul>
        </SectionCard>

        <SectionCard title="Current status">
          <p className="text-sm text-muted">
            You are viewing the Phase 1 UI shell. Authentication, database, and
            business logic will be implemented in subsequent phases following
            the documented roadmap.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
