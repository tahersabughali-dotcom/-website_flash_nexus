import Image from "next/image";

import { brandAssets } from "@/lib/constants/brand";
import { cn } from "@/lib/utils";

interface LogoWatermarkProps {
  className?: string;
}

/**
 * Site-wide fixed logo watermark.
 * Uses multiply blend so the white PNG background disappears on white pages.
 */
export function LogoWatermark({ className }: LogoWatermarkProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[1] overflow-hidden",
        className,
      )}
    >
      <div className="flex h-full w-full items-center justify-center">
        <Image
          src={brandAssets.logoPng}
          alt=""
          width={720}
          height={720}
          className="h-auto w-[min(85vw,50rem)] max-w-none select-none object-contain opacity-[0.18] mix-blend-multiply sm:w-[min(75vw,52rem)]"
          priority={false}
        />
      </div>
    </div>
  );
}
