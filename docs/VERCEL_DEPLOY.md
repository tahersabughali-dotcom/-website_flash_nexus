# Vercel Deployment — Flash Nexus

## Build succeeded but deploy failed?

If you see:

```text
Error: No Output Directory named "public" found after the Build completed.
```

**Cause:** Vercel is treating the project as a **static site** (Output Directory = `public`) instead of **Next.js**.

The Next.js build **did succeed** — only the deploy step failed.

---

## Required Vercel project settings

Open **Vercel → Project → Settings**:

### 1. Root Directory (General)

Set to:

```text
flash-nexus
```

### 2. Framework Preset (Build & Development)

Set to: **Next.js** (not "Other")

### 3. Output Directory (Build & Development)

**Leave empty** — delete `public` if it is set there.

Next.js uses `.next` internally; you must not set Output Directory to `public`.

### 4. Install / Build commands

When Root Directory is `flash-nexus`, use defaults:

- Install: `npm install`
- Build: `npm run build`

Or leave blank — Vercel auto-detects from `flash-nexus/package.json`.

---

## Environment variables

**Project → Settings → Environment Variables** (never commit):

| Variable | Environments |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview (server only) |

---

## Repo layout

| Path | Role |
|------|------|
| `flash-nexus/` | Next.js app (Vercel Root Directory) |
| `flash-nexus/vercel.json` | Framework: Next.js |
| Root `vercel.json` | Fallback if Root Directory is repo root |
| Root `package.json` | Local dev proxy scripts + `postinstall` |

---

## Local build

From repo root:

```bash
npm install
npm run build
```

---

## After changing settings

1. Save Vercel settings
2. **Redeploy** (Deployments → … → Redeploy)

Expected log ending:

```text
✓ Generating static pages (45/45)
Build Completed
Deployment Ready
```
