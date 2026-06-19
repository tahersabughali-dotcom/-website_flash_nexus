import Image from "next/image";
import Link from "next/link";

import { brand, brandAssets } from "@/lib/constants/brand";
import { cn } from "@/lib/utils";

import { LogoMark } from "./LogoMark";

export type BrandWordmarkVariant = "icon" | "compact" | "full" | "nav";

interface BrandWordmarkProps {
  className?: string;
  variant?: BrandWordmarkVariant;
  showArabic?: boolean;
  showTagline?: boolean;
  href?: string;
  compact?: boolean;
  priority?: boolean;
}

const wordmarkSizes = {
  compact: { width: 200, height: 40, src: brandAssets.logoNoSubtitle },
  full: { width: 260, height: 58, src: brandAssets.logoFull },
  nav: { width: 320, height: 64, src: brandAssets.logoPng },
} as const;

export function BrandWordmark({
  className,
  variant,
  showArabic = false,
  showTagline = false,
  href = "/",
  compact = false,
  priority = false,
}: BrandWordmarkProps) {
  const resolvedVariant: BrandWordmarkVariant =
    variant ?? (showTagline ? "full" : compact ? "compact" : "compact");

  const content =
    resolvedVariant === "icon" ? (
      <LogoMark size={compact ? "sm" : "md"} priority={priority} />
    ) : (
      <div className={cn("flex min-w-0 flex-col gap-1", className)}>
        <Image
          src={
            resolvedVariant === "full"
              ? wordmarkSizes.full.src
              : resolvedVariant === "nav"
                ? wordmarkSizes.nav.src
                : wordmarkSizes.compact.src
          }
          alt={brand.brandName}
          width={
            resolvedVariant === "full"
              ? wordmarkSizes.full.width
              : resolvedVariant === "nav"
                ? wordmarkSizes.nav.width
                : wordmarkSizes.compact.width
          }
          height={
            resolvedVariant === "full"
              ? wordmarkSizes.full.height
              : resolvedVariant === "nav"
                ? wordmarkSizes.nav.height
                : wordmarkSizes.compact.height
          }
          priority={priority}
          className={cn(
            "h-auto w-auto object-contain object-start",
            resolvedVariant === "nav"
              ? "max-h-12 max-w-[220px] sm:max-h-16 sm:max-w-[320px]"
              : "max-w-[200px] sm:max-w-[240px]",
          )}
        />
        {showArabic && (
          <span className="truncate text-sm text-muted">{brand.arabicBrandName}</span>
        )}
        {showTagline && resolvedVariant !== "full" && (
          <p className="line-clamp-2 text-xs text-muted">{brand.tagline}</p>
        )}
      </div>
    );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex transition-opacity hover:opacity-90"
        aria-label={brand.brandName}
      >
        {content}
      </Link>
    );
  }

  return content;
}

/** Centered logo block for auth pages */
export function BrandLogoCenter({
  variant = "full",
  className,
}: {
  variant?: "compact" | "full";
  className?: string;
}) {
  const size = variant === "full" ? wordmarkSizes.full : wordmarkSizes.compact;

  return (
    <div className={cn("flex justify-center", className)}>
      <Image
        src={size.src}
        alt={brand.brandName}
        width={size.width}
        height={size.height}
        className="h-auto w-auto max-w-[280px] object-contain"
      />
    </div>
  );
}
