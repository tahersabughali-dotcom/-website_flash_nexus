"use client";

import Link from "next/link";

import { BrandLogoCenter } from "@/components/brand/BrandWordmark";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useMessages } from "@/components/i18n/LocaleProvider";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function LoginPageContent() {
  const messages = useMessages();
  const t = messages.auth;

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="mb-6 flex justify-center">
        <LanguageSwitcher />
      </div>
      <BrandLogoCenter variant="full" className="mb-8" />
      <PageHeader
        title={t.loginTitle}
        subtitle={t.loginSubtitle}
        badge={<StatusBadge variant="warning">{t.authPlaceholder}</StatusBadge>}
      />

      <form className="mt-8 space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            {t.email}
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            {t.password}
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          disabled
          className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white opacity-60"
        >
          {t.signInPhase2}
        </button>
        <p className="text-center text-sm text-muted">
          {t.noAccount}{" "}
          <Link href="/register" className="text-brand hover:underline">
            {messages.common.register}
          </Link>
        </p>
        <p className="text-center">
          <Link
            href="/dashboard"
            className="text-sm text-brand-light hover:underline"
          >
            {t.continueDashboard}
          </Link>
        </p>
      </form>
    </div>
  );
}
