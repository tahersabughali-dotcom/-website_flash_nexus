"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { useLocale, useMessages } from "@/components/i18n/LocaleProvider";
import type { ModuleStatus } from "@/types/module";
import { pickLabel } from "@/lib/i18n/localize";
import { cn } from "@/lib/utils";

import { ModuleBadge } from "./ModuleBadge";
import { PageHeader } from "./PageHeader";

interface PlaceholderPageProps {
  title: string;
  arabicTitle: string;
  description: string;
  status: ModuleStatus;
  plannedFeatures: string[];
  className?: string;
}

export function PlaceholderPage({
  title,
  arabicTitle,
  description,
  status,
  plannedFeatures,
  className,
}: PlaceholderPageProps) {
  const { locale } = useLocale();
  const t = useMessages();
  const displayTitle = pickLabel({ title, arabicTitle }, locale);

  return (
    <div className={cn("space-y-6", className)}>
      <PageHeader
        title={displayTitle}
        subtitle={description}
        badge={<ModuleBadge status={status} />}
      />

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{t.placeholder.phase1}</p>
        </div>
      </div>

      {locale === "en" && (
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold text-brand">{arabicTitle}</p>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          {t.placeholder.plannedFeatures}
        </h2>
        <ul className="space-y-2">
          {plannedFeatures.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-muted">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
