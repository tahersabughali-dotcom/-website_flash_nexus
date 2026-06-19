import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { cookies } from "next/headers";

import { AppProviders } from "@/app/providers";
import { LogoWatermark } from "@/components/brand/LogoWatermark";
import { brand, brandAssets } from "@/lib/constants/brand";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: brand.brandName,
    template: `%s | ${brand.brandName}`,
  },
  description: brand.tagline,
  icons: {
    icon: [{ url: brandAssets.favicon, type: "image/svg+xml" }],
    apple: [{ url: brandAssets.favicon, type: "image/svg+xml" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${notoArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-full bg-white">
        <LogoWatermark />
        <AppProviders initialLocale={locale}>
          <div className="relative z-[2] flex min-h-full flex-col">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
