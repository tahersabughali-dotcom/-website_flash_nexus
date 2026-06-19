# Flash Nexus — Database

This folder contains all database schema changes, seeds, and planning documents for Flash Nexus (PostgreSQL via Supabase).

---

## Rules (Mandatory)

1. **All schema changes must go through migrations** in `migrations/` — never alter production manually.
2. **Never modify the production database by hand** — use Supabase CLI or dashboard migration workflow only after staging validation.
3. **Row Level Security (RLS) is mandatory** on all tenant-scoped and user-facing tables.
4. **Every tenant table must include `office_id`** where the data belongs to an exchange office (see `SCHEMA_PHASE_2_PLAN.md`).
5. **Financial records must never be permanently deleted** — use void, reversal, or status fields (Phase 3+).
6. **Audit logs are append-only** — no UPDATE or DELETE on audit tables (Phase 3+).
7. **Backward-compatible migrations** — add columns before using them; deprecate over two releases before dropping.
8. **Test on development → staging → production** — see `docs/DEPLOYMENT_AND_VERSIONING.md`.

---

## Folder Structure

```
database/
├── README.md                 ← This file
├── SCHEMA_PHASE_2_PLAN.md    ← Planned tables for Phase 2B (no SQL yet)
├── migrations/               ← Timestamped SQL migration files (Phase 2B+)
└── seeds/                    ← Development seed data (Phase 2B+)
```

---

## Phase Status

| Phase | Status | Contents |
|-------|--------|----------|
| **2A** | ✅ Complete | Supabase utilities, auth/tenant placeholders |
| **2B-1** | ✅ Complete | SQL migrations 001–010 + seed 001 (not applied) |
| **2B-2** | Next | Apply to dev Supabase, generate types |
| **2C** | Planned | Auth wiring, profile creation on signup |
| **3+** | Future | Financial tables (clients CRM, transactions, etc.) |

---

## Migration Files (Phase 2B-1)

Run in order on **development Supabase only**:

```
migrations/001_extensions_and_triggers.sql
migrations/002_profiles.sql
migrations/003_roles_and_permissions.sql
migrations/004_offices.sql
migrations/005_office_members.sql
migrations/006_client_profiles.sql
migrations/007_office_public_profiles.sql
migrations/008_audit_log_system.sql
migrations/009_security_functions.sql
migrations/010_rls_policies_enhanced.sql
```

Then seed:

```
seeds/001_seed_roles_permissions.sql
```

See `docs/PHASE_2B_DATABASE_SCHEMA.md` for full documentation.

---

## Apply Status (Phase 2B-2)

| Step | Status |
|------|--------|
| Migrations written (2B-1) | ✅ |
| Synced to `supabase/migrations/` | ✅ |
| Applied to dev Supabase | ⚠️ **Pending** — configure `flash-nexus/.env.local` + `supabase link` |
| Seed applied | ⚠️ Pending |
| Types generated | ⚠️ Pending |

**How to apply:** See `database/APPLY_MIGRATIONS.md`  
**Smoke tests:** See `database/SMOKE_TEST_PHASE_2B.md`  
**Status doc:** See `docs/PHASE_2B2_APPLY_DEV_SCHEMA.md`

### Production warning

Never run `npm run db:push` against production. Development and staging only until fully validated.

---

## Running Migrations (Phase 2B+)

When Supabase CLI is configured:

```bash
# Local development
supabase db reset

# Push to linked project (staging first)
supabase db push
```

Generate TypeScript types after migrations:

```bash
npx supabase gen types typescript --local > lib/supabase/types.ts
```

---

## Related Documentation

- `docs/DATA_MODEL_CONCEPT.md` — Conceptual entities
- `docs/FINANCIAL_RULES.md` — Financial immutability rules
- `docs/SECURITY_AND_PERMISSIONS.md` — RLS and tenant isolation
- `docs/DEPLOYMENT_AND_VERSIONING.md` — Migration safety
- `database/SCHEMA_PHASE_2_PLAN.md` — Phase 2 table plan
