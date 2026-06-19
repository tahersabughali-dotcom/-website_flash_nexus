"use client";

import Link from "next/link";

import { BrandWordmark } from "@/components/brand/BrandWordmark";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale, useMessages } from "@/components/i18n/LocaleProvider";
import { publicNavigation } from "@/lib/constants/navigation";
import { pickLabel } from "@/lib/i18n/localize";
import { cn } from "@/lib/utils";

interface PublicHeaderProps {
  className?: string;
}

export function PublicHeader({ className }: PublicHeaderProps) {
  const { locale } = useLocale();
  const t = useMessages();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandWordmark href="/" variant="nav" priority />

        <nav className="hidden items-center gap-6 md:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-brand"
            >
              {pickLabel(item, locale)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher compact className="sm:ms-1" />
          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-brand hover:bg-brand-subtle sm:inline-flex"
          >
            {t.common.login}
          </Link>
          <Link
            href="/register/client"
            className="rounded-lg border border-brand px-3 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand-subtle"
          >
            {t.common.client}
          </Link>
          <Link
            href="/register/office"
            className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-light"
          >
            {t.common.registerOffice}
          </Link>
        </div>
      </div>
    </header>
  );
}
