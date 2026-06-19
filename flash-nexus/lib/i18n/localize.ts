import type { Locale } from "./types";

interface Localizable {
  title: string;
  arabicTitle?: string;
}

export function pickLabel(item: Localizable, locale: Locale): string {
  if (locale === "ar" && item.arabicTitle) {
    return item.arabicTitle;
  }
  return item.title;
}
