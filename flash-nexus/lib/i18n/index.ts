import { ar } from "./messages/ar";
import { en } from "./messages/en";
import type { Messages } from "./messages/en";
import type { Locale } from "./types";

const dictionaries: Record<Locale, Messages> = { ar, en };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries.ar;
}

export function isLocale(value: string | undefined): value is Locale {
  return value === "ar" || value === "en";
}

export type { Locale, Messages };
export { defaultLocale, locales, LOCALE_COOKIE } from "./types";
