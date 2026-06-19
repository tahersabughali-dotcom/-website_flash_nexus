# Flash Nexus — Phase 2A: Supabase & SaaS Foundation Preparation

**Phase:** 2A  
**Version:** v0.2.0-prep (internal)  
**Status:** ✅ Complete  
**Last Updated:** June 2026  

---

## 1. Phase 2A Objective

Prepare the Flash Nexus codebase for Supabase authentication and multi-tenant SaaS — **without** implementing login, migrations, financial tables, or breaking Phase 1 UI.

---

## 2. What Was Added

### NPM Packages

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Supabase client (admin client) |
| `@supabase/ssr` | Cookie-based auth for Next.js App Router |

### Environment

| File | Purpose |
|------|---------|
| `.env.example` | Template for Supabase URL, anon key, service role key |
| `.gitignore` | Updated to allow committing `.env.example` (`!.env.example`) |

### Supabase Utilities (`lib/supabase/`)

| File | Purpose |
|------|---------|
| `env.ts` | Env validation, `isSupabaseConfigured()`, server-only service role guard |
| `client.ts` | Browser/client component Supabase client (anon key, RLS) |
| `server.ts` | Server Component / Server Action client (cookies, RLS) |
| `middleware.ts` | `updateSession()` helper for future root middleware |
| `admin.ts` | Service role client — server-only, not used yet |
| `types.ts` | Placeholder `Database` type until Phase 2B migrations |

### Auth Placeholders (`lib/auth/`)

| File | Purpose |
|------|---------|
| `auth-types.ts` | TypeScript types for auth, profiles, registration |
| `session.ts` | `getCurrentUser()`, `getSession()` stubs (return null) |
| `auth-guards.ts` | `requireAuth()`, role guard stubs with TODO Phase 2C |
| `auth-actions.ts` | Server action stubs for sign in/up/out (not implemented) |

### Tenant Placeholders (`lib/tenant/`)

| File | Purpose |
|------|---------|
| `tenant-types.ts` | `OfficeId`, `TenantContext`, office types |
| `tenant-context.ts` | `getTenantContext()` stub |
| `tenant-guards.ts` | `assertSameTenant()`, `requireTenantAccess()` stubs |

### Database Planning (`database/`)

| File | Purpose |
|------|---------|
| `README.md` | Migration rules, RLS requirements |
| `SCHEMA_PHASE_2_PLAN.md` | Planned Phase 2B tables (no SQL yet) |
| `migrations/.gitkeep` | Empty migrations folder |
| `seeds/.gitkeep` | Empty seeds folder |

---

## 3. How Supabase Will Be Used

```
┌─────────────────────────────────────────────────────────┐
│  Browser (Client Components)                            │
│  lib/supabase/client.ts  →  anon key  →  RLS enforced   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Server (RSC, Server Actions, Route Handlers)           │
│  lib/supabase/server.ts  →  anon key + cookies  →  RLS  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Middleware (Phase 2C)                                  │
│  lib/supabase/middleware.ts  →  refresh session         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Platform Admin ONLY (server, rare)                     │
│  lib/supabase/admin.ts  →  service role  →  bypasses RLS│
└─────────────────────────────────────────────────────────┘
```

Normal office and user operations **always** use `client.ts` or `server.ts` — never the admin client.

---

## 4. Environment Variable Setup

1. Create a Supabase project (development environment).
2. Copy `.env.example` to `.env.local` in `flash-nexus/`:

```bash
cp .env.example .env.local
```

3. Fill in values from **Supabase Dashboard → Project Settings → API**:

| Variable | Where used |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + server |
| `SUPABASE_SERVICE_ROLE_KEY` | Server admin only — never in browser |

4. Restart dev server after changing env vars.

**Note:** The app builds without these variables. Supabase utilities throw clear errors only when **invoked** at runtime without configuration.

---

## 5. Security Notes

1. **Service role key** must never appear in `NEXT_PUBLIC_*` variables or client bundles.
2. `getSupabaseServiceRoleKey()` throws if called in browser code.
3. **RLS is mandatory** on all tenant tables (Phase 2B migrations).
4. **Admin client** bypasses RLS — reserved for Super Admin platform tasks only.
5. Phase 1 dashboard remains **unprotected** until Phase 2C route guards.
6. No real API keys are committed to the repository.

---

## 6. What Is NOT Implemented Yet

| Feature | Planned Phase |
|---------|---------------|
| SQL migrations | **2B** |
| RLS policies | **2B** |
| Generated Database types | **2B** (after migrations) |
| Login / logout / register | **2C** |
| Root `middleware.ts` session refresh | **2C** |
| Dashboard route protection | **2C** |
| Office registration workflow | **2C** |
| Tenant context from real session | **2C** |
| Financial tables | **3** |
| FlashCount, pricing, transactions | **3–4** |

---

## 7. Phase 1 UI Impact

- **No changes** to existing routes, layouts, or components.
- Dashboard still accessible without login.
- No Supabase imports added to Phase 1 pages (build-safe without env vars).

---

## 8. Next Step: Phase 2B — Database Schema & Migrations

1. Initialize Supabase CLI / link dev project.
2. Write migrations per `database/SCHEMA_PHASE_2_PLAN.md`:
   - `profiles`
   - `offices`
   - `office_members`
   - `roles`, `permissions`, `role_permissions` (+ seeds)
   - Optional: `invitations`
3. Enable RLS on all tables with policies.
4. Create `is_office_member()` helper function.
5. Regenerate `lib/supabase/types.ts`.
6. Apply migrations to **development** Supabase project only.
7. Document migration filenames in CHANGELOG.

Then proceed to **Phase 2C** for auth flows and route protection.

---

## 9. File Index (Quick Reference)

```
flash-nexus/
├── .env.example
├── lib/
│   ├── supabase/
│   │   ├── env.ts
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── middleware.ts
│   │   ├── admin.ts
│   │   └── types.ts
│   ├── auth/
│   │   ├── auth-types.ts
│   │   ├── session.ts
│   │   ├── auth-guards.ts
│   │   └── auth-actions.ts
│   └── tenant/
│       ├── tenant-types.ts
│       ├── tenant-context.ts
│       └── tenant-guards.ts
└── database/
    ├── README.md
    ├── SCHEMA_PHASE_2_PLAN.md
    ├── migrations/
    └── seeds/
```

---

*Phase 2A prepares the foundation. Phase 2B builds the database. Phase 2C connects auth.*
