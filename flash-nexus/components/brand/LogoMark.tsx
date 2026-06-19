import Image from "next/image";

import { brand, brandAssets } from "@/lib/constants/brand";
import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

const sizeMap = {
  sm: { box: 32, px: 32 },
  md: { box: 40, px: 40 },
  lg: { box: 48, px: 48 },
} as const;

export function LogoMark({
  className,
  size = "md",
  priority = false,
}: LogoMarkProps) {
  const dimensions = sizeMap[size];

  return (
    <Image
      src={brandAssets.icon}
      alt={`${brand.brandName} icon`}
      width={dimensions.px}
      height={dimensions.px}
      priority={priority}
      className={cn("shrink-0 object-contain", className)}
      style={{ width: dimensions.box, height: dimensions.box }}
    />
  );
}
