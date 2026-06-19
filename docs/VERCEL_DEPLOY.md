# Vercel Deployment — Flash Nexus

## Problem

If the Vercel **Root Directory** is the repo root, `npm install` only runs at root.  
The Next.js app lives in `flash-nexus/` with its own `package.json`, so `next` is not found:

```text
sh: line 1: next: command not found
```

## Fix (in repo)

- Root `vercel.json` — installs and builds inside `flash-nexus/`
- Root `package.json` — `postinstall` runs `npm install --prefix flash-nexus`
- `flash-nexus/package-lock.json` — committed for reproducible installs

## Recommended Vercel project settings

In **Vercel → Project → Settings → General → Root Directory**:

Set to: **`flash-nexus`**

Then Vercel uses native Next.js detection and you can remove custom install/build overrides later if desired.

## Environment variables (Vercel dashboard)

Add in **Project → Settings → Environment Variables** (never commit):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Production/Preview server only)

## Local build (same as CI)

From repo root:

```bash
npm install
npm run build
```
