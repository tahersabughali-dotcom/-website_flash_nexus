# Flash Nexus — Brand Assets

**Document Version:** 1.0  
**Last Updated:** June 2026  

---

## 1. Logo Direction

Flash Nexus uses a **premium white/blue financial SaaS** identity:

| Element | Description |
|---------|-------------|
| **Monogram** | Blue **FN** mark — geometric **F** with speed lines + geometric **N** |
| **Wordmark** | **Flash Nexus** — clean, bold sans-serif |
| **Subtitle** | **FINANCIAL NETWORKS** — small caps, letter-spaced, blue accent |
| **Style** | Professional, minimal, trustworthy — suitable for exchange offices and financial networks |

Current assets are **temporary SVG** files created for development. A designer can refine with transparent PNG, refined typography, and brand guidelines later.

---

## 2. Asset Paths

All assets live under `flash-nexus/public/brand/`:

| File | Purpose | Public URL |
|------|---------|------------|
| `flash-nexus-icon.svg` | FN monogram only (square) | `/brand/flash-nexus-icon.svg` |
| `flash-nexus-logo-no-subtitle.svg` | Icon + wordmark | `/brand/flash-nexus-logo-no-subtitle.svg` |
| `flash-nexus-logo-full.svg` | Icon + wordmark + FINANCIAL NETWORKS | `/brand/flash-nexus-logo-full.svg` |
| `favicon.svg` | Browser tab icon (simplified FN) | `/brand/favicon.svg` |

Constants: `lib/constants/brand.ts` → `brandAssets`

---

## 3. Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#1E40AF` | Wordmark, headers, buttons |
| Primary Light | `#3B82F6` | Subtitle, accents, gradients |
| Primary Subtle | `#EFF6FF` | Backgrounds, cards |
| Accent | `#60A5FA` | Speed lines, highlights |
| White | `#FFFFFF` | Monogram letters on blue |
| Text | `#374151` | Body copy |
| Muted | `#6B7280` | Secondary text |

Defined in: `lib/constants/brand.ts` → `brandColors`

---

## 4. Where the Logo Is Used

| Location | Component | Variant |
|----------|-----------|---------|
| Public header | `PublicHeader` | compact (no subtitle) |
| Landing hero | `(public)/page.tsx` | full |
| Login | `login/page.tsx` | full (centered) |
| Register hub | `register/page.tsx` | full (centered) |
| Client register | `register/client/page.tsx` | compact |
| Office register | `register/office/page.tsx` | compact |
| Dashboard sidebar | `AppSidebar` | compact |
| Public footer | `PublicFooter` | full + Arabic name |
| Favicon | `app/layout.tsx` metadata | favicon.svg |
| Reusable | `LogoMark` | icon only |
| Reusable | `BrandWordmark` | icon / compact / full |
| Auth pages | `BrandLogoCenter` | compact or full |

---

## 5. Component Usage

```tsx
import { LogoMark } from "@/components/brand/LogoMark";
import { BrandWordmark, BrandLogoCenter } from "@/components/brand/BrandWordmark";

// Icon only
<LogoMark size="md" />

// Header wordmark
<BrandWordmark href="/" variant="compact" />

// Hero / footer full logo
<BrandWordmark variant="full" />

// Auth page centered
<BrandLogoCenter variant="full" />
```

**Rules:**
- Use `object-contain` — never stretch
- Prefer SVG assets via `next/image`
- Do not hardcode paths — use `brandAssets` from `lib/constants/brand.ts`

---

## 6. Assets Still Missing (Future Designer Deliverables)

| Asset | Status |
|-------|--------|
| Final transparent PNG (full logo) | Not yet — SVG placeholder |
| Final transparent PNG (icon) | Not yet — SVG placeholder |
| `favicon.ico` (legacy browsers) | Optional — SVG favicon used |
| `apple-touch-icon.png` (180×180) | Not yet |
| Open Graph / social share image | Not yet |
| Arabic wordmark lockup | Not yet |
| Brand guidelines PDF | Not yet |
| Dark-mode logo variant | Not yet |

---

## 7. Replacement Process

When final designer assets arrive:

1. Add files to `public/brand/` (keep same filenames or update `brandAssets` in `brand.ts`)
2. Prefer SVG or high-res PNG with transparency
3. Run `npm run build` to verify layout
4. Update this document with final asset list

---

*Internal code name `flash95` is never shown in public brand assets.*
