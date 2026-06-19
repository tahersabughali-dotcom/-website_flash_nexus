export const brand = {
  brandName: "Flash Nexus",
  arabicBrandName: "فلاش نِكسَس",
  tagline: "The Operating System for Exchange Offices & Financial Networks",
  subtitle: "FINANCIAL NETWORKS",
  arabicTagline:
    "نظام التشغيل المتكامل لمكاتب الصرافة والشبكات المالية",
  internalCodeName: "flash95",
  phaseLabel: "Phase 1 UI Shell",
} as const;

export const brandAssets = {
  logoPng: "/logo.png",
  icon: "/brand/flash-nexus-icon.svg",
  logoNoSubtitle: "/brand/flash-nexus-logo-no-subtitle.svg",
  logoFull: "/brand/flash-nexus-logo-full.svg",
  favicon: "/brand/favicon.svg",
} as const;

export const brandColors = {
  primary: "#1E40AF",
  primaryLight: "#3B82F6",
  primarySubtle: "#EFF6FF",
  accent: "#60A5FA",
  white: "#FFFFFF",
  text: "#374151",
  muted: "#6B7280",
} as const;

export type Brand = typeof brand;
export type BrandAssets = typeof brandAssets;
