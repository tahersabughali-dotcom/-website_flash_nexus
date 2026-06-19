# Vercel Deployment — Flash Nexus

## Correct setup (required)

**Vercel → Project → Settings**

| Setting | Value |
|---------|--------|
| **Root Directory** | `flash-nexus` |
| **Framework Preset** | Next.js |
| **Install Command** | *(empty — use default `npm install`)* |
| **Build Command** | *(empty — use default `npm run build`)* |
| **Output Directory** | *(empty — do NOT use `public`)* |

Config file: `flash-nexus/vercel.json` (framework: Next.js only).

---

## Error: `flash-nexus/flash-nexus/package.json` not found

**Cause:** Root Directory is already `flash-nexus`, but Install Command still runs:

```bash
npm install --prefix flash-nexus
```

That looks for `flash-nexus/flash-nexus/` — wrong path.

**Fix:**

1. Settings → Build & Development → **Install Command** → clear / leave default
2. Settings → Build & Development → **Build Command** → clear / leave default
3. Redeploy

Do **not** use `--prefix flash-nexus` when Root Directory is `flash-nexus`.

---

## Error: `next: command not found`

**Cause:** Root Directory was repo root and dependencies were not installed in `flash-nexus/`.

**Fix:** Set Root Directory to `flash-nexus` (see table above).

---

## Environment variables

Never commit secrets. Add in Vercel → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Local development (from repo root)

```bash
npm install
npm run dev
npm run build
```

Root `package.json` uses `--prefix flash-nexus` for local scripts only — not for Vercel when Root Directory is `flash-nexus`.
