"use client";

import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

import { useLocale } from "./LocaleProvider";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function LanguageSwitcher({
  className,
  compact = false,
}: LanguageSwitcherProps) {
  const { locale, setLocale, messages } = useLocale();

  const options: { value: Locale; label: string }[] = [
    { value: "ar", label: messages.common.arabic },
    { value: "en", label: messages.common.english },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-white p-0.5",
        className,
      )}
      role="group"
      aria-label={messages.common.language}
    >
      {options.map((option) => {
        const active = locale === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLocale(option.value)}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors",
              compact && "px-2 py-1",
              active
                ? "bg-brand text-white"
                : "text-muted hover:bg-brand-subtle hover:text-brand",
            )}
            aria-pressed={active}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
