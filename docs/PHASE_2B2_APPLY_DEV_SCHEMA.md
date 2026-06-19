# Flash Nexus — Phase 2B-2: Apply Dev Schema

**Phase:** 2B-2  
**Status:** ⚠️ **BLOCKED** — Pre-flight failed (empty environment file)  
**Last Updated:** June 2026  

---

## 1. Pre-Flight Results

| Check | Result |
|-------|--------|
| `.env.local` exists | ⚠️ Workspace root file exists but is **empty** |
| `flash-nexus/.env.local` | ❌ **Missing** (Next.js reads env from `flash-nexus/`) |
| `NEXT_PUBLIC_SUPABASE_URL` | ❌ Not set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ❌ Not set |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ Not set |
| Git ignores `.env.local` | ✅ `flash-nexus/.gitignore` has `.env*` + `!.env.example` |
| Secrets printed | ✅ None printed in logs or committed files |

**Action required before apply:** Copy `flash-nexus/.env.example` → `flash-nexus/.env.local` and add development Supabase credentials from Dashboard → Project Settings → API.

The file `flash-nexus-dev` at workspace root is a placeholder (labels only) — use **`flash-nexus/.env.local`** for the Next.js app.

---

## 2. What Was Completed (Infrastructure Only)

Because credentials were missing, migrations were **not applied** to Supabase. The following was prepared:

| Item | Status |
|------|--------|
| Supabase CLI (`supabase` devDependency) | ✅ Installed v2.107.0 |
| `supabase init` | ✅ `supabase/config.toml` created |
| Migration sync script | ✅ `scripts/sync-db-migrations.cjs` |
| CLI migrations copy | ✅ 10 files in `supabase/migrations/` |
| npm scripts | ✅ `db:sync-migrations`, `db:push`, `db:types` |
| Apply guide | ✅ `database/APPLY_MIGRATIONS.md` |
| Smoke test doc | ✅ `database/SMOKE_TEST_PHASE_2B.md` |

### Migration sync strategy (Option C)

- **`database/migrations/`** = source of truth (edit here)
- **`supabase/migrations/`** = CLI-compatible copy (run `npm run db:sync-migrations`)
- Original files unchanged; sync adds header comment only

---

## 3. Migrations Applied to Dev Supabase

| Status | Detail |
|--------|--------|
| **NOT APPLIED** | Blocked — no Supabase credentials configured |

When unblocked, apply in order:

1. `001_extensions_and_triggers.sql`
2. `002_profiles.sql`
3. `003_roles_and_permissions.sql`
4. `004_offices.sql`
5. `005_office_members.sql`
6. `006_client_profiles.sql`
7. `007_office_public_profiles.sql`
8. `008_audit_log_system.sql`
9. `009_security_functions.sql`
10. `010_rls_policies_enhanced.sql`

**Command (after link + env):**

```bash
cd flash-nexus
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npm run db:push
```

---

## 4. Seed Applied

| Status | Detail |
|--------|--------|
| **NOT APPLIED** | Run after migrations in SQL Editor or via psql |

File: `database/seeds/001_seed_roles_permissions.sql`

---

## 5. RLS Smoke Test

| Status | Detail |
|--------|--------|
| Document created | ✅ `database/SMOKE_TEST_PHASE_2B.md` |
| Executed | ❌ Pending migration apply |

---

## 6. TypeScript Types Generated

| Status | Detail |
|--------|--------|
| **NOT GENERATED** | Requires linked project + applied schema |

**Command (after apply):**

```bash
cd flash-nexus
npm run db:types
```

---

## 7. Files Created / Modified

| File | Change |
|------|--------|
| `supabase/config.toml` | Created by `supabase init` |
| `supabase/migrations/*.sql` | 10 synced copies |
| `scripts/sync-db-migrations.cjs` | New |
| `database/APPLY_MIGRATIONS.md` | New |
| `database/SMOKE_TEST_PHASE_2B.md` | New |
| `database/README.md` | Updated apply status |
| `package.json` | supabase devDep + db scripts |
| `docs/PHASE_2B2_APPLY_DEV_SCHEMA.md` | This file |

---

## 8. Build / Lint

Run after infrastructure changes — app must build without Supabase env vars.

---

## 9. What Was NOT Implemented

- Migrations not applied to any Supabase project
- Seed not run
- Types not regenerated
- No auth UI, registration, route protection, middleware
- No financial tables
- No test users created

---

## 10. Next Steps

### Immediate (user)

1. Create **`flash-nexus/.env.local`** with dev Supabase URL, anon key, service role key.
2. Run `npx supabase login` and `npx supabase link --project-ref YOUR_PROJECT_REF`.
3. Run `npm run db:push`.
4. Run seed SQL in Dashboard SQL Editor.
5. Complete `database/SMOKE_TEST_PHASE_2B.md` checklist.
6. Run `npm run db:types`.
7. Update this doc status to ✅ Complete.

### Then: Phase 2C — Auth Flows

- Profile creation on signup (server actions)
- Login / logout / register wiring
- Root middleware with `updateSession`
- Dashboard route guards
- No financial logic yet

---

*Development Supabase only. Never apply untested migrations to production.*
