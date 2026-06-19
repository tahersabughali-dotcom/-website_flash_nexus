"use client";

import { Bell, Search, User } from "lucide-react";

import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useMessages } from "@/components/i18n/LocaleProvider";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { brand } from "@/lib/constants/brand";

export function Topbar() {
  const t = useMessages();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-white px-4 lg:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative hidden max-w-md flex-1 sm:block">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder={t.common.searchPlaceholder}
            disabled
            className="w-full rounded-lg border border-border bg-gray-50 py-2 pe-4 ps-10 text-sm text-muted"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher compact />
        <StatusBadge variant="info">{brand.phaseLabel}</StatusBadge>

        <button
          type="button"
          className="relative rounded-lg p-2 text-muted hover:bg-brand-subtle hover:text-brand"
          aria-label={t.common.notifications}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>

        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-subtle text-brand">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden text-start sm:block">
            <p className="text-sm font-medium text-foreground">
              {t.common.demoUser}
            </p>
            <p className="text-xs text-muted">{t.common.officeOwner}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
