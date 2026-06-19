"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { BrandWordmark } from "@/components/brand/BrandWordmark";
import { useLocale, useMessages } from "@/components/i18n/LocaleProvider";
import { dashboardNavigation } from "@/lib/constants/navigation";
import { pickLabel } from "@/lib/i18n/localize";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale } = useLocale();
  const t = useMessages();

  const navContent = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {dashboardNavigation.map((group) => (
        <div key={group.id}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted">
            {pickLabel(group, locale)}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-brand text-white"
                        : "text-foreground hover:bg-brand-subtle hover:text-brand",
                    )}
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive ? "text-white" : "text-brand-light",
                        )}
                      />
                    )}
                    <span className="truncate">{pickLabel(item, locale)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 start-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label={t.common.openMenu}
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 w-72 flex-col border-e border-border bg-white lg:static lg:flex",
          mobileOpen ? "flex" : "hidden lg:flex",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <BrandWordmark href="/dashboard" variant="nav" />
          <button
            type="button"
            className="rounded-lg p-1 text-muted hover:bg-gray-100 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label={t.common.closeMenu}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {navContent}
      </aside>
    </>
  );
}
