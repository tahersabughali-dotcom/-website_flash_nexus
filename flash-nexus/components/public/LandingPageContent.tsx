"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  Building2,
  Calculator,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

import { BrandWordmark } from "@/components/brand/BrandWordmark";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale, useMessages } from "@/components/i18n/LocaleProvider";
import { brand } from "@/lib/constants/brand";
import { SectionCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

const moduleKeys = [
  { name: "FlashCount Engine", desc: "Accounting & balance engine" },
  { name: "Remittance Pricing", desc: "Instant corridor quotes" },
  { name: "FlashAudit Center", desc: "Audit-ready financial records" },
  { name: "FlashNetwork", desc: "Office & partner marketplace" },
] as const;

export function LandingPageContent() {
  const { locale } = useLocale();
  const t = useMessages();
  const l = t.landing;

  const audiences = [
    {
      icon: Building2,
      title: l.officesTitle,
      arabic: "لمكاتب الصرافة",
      description: l.officesDesc,
    },
    {
      icon: Users,
      title: l.clientsTitle,
      arabic: "للعملاء",
      description: l.clientsDesc,
    },
    {
      icon: ArrowLeftRight,
      title: l.partnersTitle,
      arabic: "لمكاتب الشركاء",
      description: l.partnersDesc,
    },
  ];

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="mb-6 flex justify-center sm:hidden">
            <LanguageSwitcher />
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <StatusBadge variant="info" className="mb-6">
              {brand.phaseLabel}
            </StatusBadge>
            <div className="flex justify-center">
              <BrandWordmark href="/" variant="full" priority />
            </div>
            <p className="mt-4 text-xl font-medium text-foreground">
              {locale === "ar" ? brand.arabicBrandName : brand.brandName}
            </p>
            <p className="mt-4 text-lg text-muted">
              {locale === "ar" ? brand.arabicTagline : brand.tagline}
            </p>
            {locale === "ar" && (
              <p className="mt-2 text-base text-muted">{brand.tagline}</p>
            )}
            {locale === "en" && (
              <p className="mt-2 text-base text-muted">{brand.arabicTagline}</p>
            )}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register/office"
                className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-light sm:w-auto"
              >
                {l.registerAsOffice}
              </Link>
              <Link
                href="/register/client"
                className="inline-flex w-full items-center justify-center rounded-lg border border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand-subtle sm:w-auto"
              >
                {l.registerAsClient}
              </Link>
            </div>
            <Link
              href="/dashboard"
              className="mt-4 inline-block text-sm text-brand-light hover:underline"
            >
              {l.viewDashboardDemo}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-foreground">
          {l.audiencesTitle}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {audiences.map((item) => (
            <SectionCard
              key={item.title}
              title={item.title}
              description={locale === "ar" ? item.arabic : item.arabic}
            >
              <item.icon className="mb-3 h-8 w-8 text-brand-light" />
              <p className="text-sm text-muted">{item.description}</p>
            </SectionCard>
          ))}
        </div>
      </section>

      <section className="border-y border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-brand" />
            <h2 className="text-2xl font-bold text-foreground">{l.modulesTitle}</h2>
          </div>
          <p className="mt-2 text-muted">{l.modulesSubtitle}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {moduleKeys.map((mod) => (
              <div
                key={mod.name}
                className="rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <Calculator className="mb-2 h-5 w-5 text-brand-light" />
                <h3 className="font-semibold text-foreground">{mod.name}</h3>
                <p className="mt-1 text-sm text-muted">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm lg:p-12">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-10 w-10 shrink-0 text-brand" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">{l.trustTitle}</h2>
              <p className="mt-2 text-muted">{l.trustDesc}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {l.trustItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white">{l.ctaTitle}</h2>
          <p className="mt-3 text-brand-subtle">{l.ctaSubtitle}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register/office"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand hover:bg-brand-subtle"
            >
              {l.registerYourOffice}
            </Link>
            <Link
              href="/offices"
              className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {l.findOffice}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
