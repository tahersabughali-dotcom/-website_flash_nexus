"use client";

import Link from "next/link";

import { BrandWordmark } from "@/components/brand/BrandWordmark";
import { useLocale, useMessages } from "@/components/i18n/LocaleProvider";
import { brand } from "@/lib/constants/brand";

export function PublicFooter() {
  const { locale } = useLocale();
  const t = useMessages();

  return (
    <footer className="border-t border-border bg-brand-subtle/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <BrandWordmark href="/" variant="full" showArabic={locale === "ar"} />
            <p className="mt-4 text-sm text-muted">
              {locale === "ar" ? brand.arabicTagline : brand.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {t.footer.platform}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/about" className="hover:text-brand">
                  {t.footer.about}
                </Link>
              </li>
              <li>
                <Link href="/offices" className="hover:text-brand">
                  {t.footer.findOffices}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-brand">
                  {t.common.register}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {t.footer.account}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/login" className="hover:text-brand">
                  {t.common.login}
                </Link>
              </li>
              <li>
                <Link href="/register/client" className="hover:text-brand">
                  {t.footer.clientRegistration}
                </Link>
              </li>
              <li>
                <Link href="/register/office" className="hover:text-brand">
                  {t.footer.officeRegistration}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand">
                  {t.footer.dashboardDemo}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()}{" "}
          {locale === "ar" ? brand.arabicBrandName : brand.brandName}.{" "}
          {brand.phaseLabel}.
        </div>
      </div>
    </footer>
  );
}
