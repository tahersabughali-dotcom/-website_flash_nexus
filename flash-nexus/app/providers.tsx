"use client";

import type { ReactNode } from "react";

import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n";

interface AppProvidersProps {
  children: ReactNode;
  initialLocale: Locale;
}

export function AppProviders({ children, initialLocale }: AppProvidersProps) {
  return <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>;
}
