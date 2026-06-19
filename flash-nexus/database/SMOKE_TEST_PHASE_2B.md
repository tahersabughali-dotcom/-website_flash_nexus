# Flash Nexus — Phase 2B RLS & Schema Smoke Tests

**Purpose:** Manual verification after applying migrations to **development Supabase only**.  
**When to run:** After migrations 001–010 and seed `001_seed_roles_permissions.sql` succeed.  
**Do not run on production.**

---

## Prerequisites

- Development Supabase project with migrations applied
- Access to Supabase Dashboard → SQL Editor
- Optional: test users created in Phase 2C for live RLS tests

---

## 1. Tables Exist

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles',
    'offices',
    'roles',
    'permissions',
    'role_permissions',
    'office_members',
    'client_profiles',
    'office_public_profiles',
    'audit_log_system'
  )
ORDER BY table_name;
```

**Expected:** 9 rows.

---

## 2. RLS Enabled

```sql
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'profiles', 'offices', 'roles', 'permissions', 'role_permissions',
    'office_members', 'client_profiles', 'office_public_profiles', 'audit_log_system'
  )
ORDER BY c.relname;
```

**Expected:** `rls_enabled = true` for all 9 tables.

---

## 3. Roles Seeded

```sql
SELECT key, name_en, is_system
FROM public.roles
ORDER BY key;
```

**Expected:** 6 rows — `office_owner`, `financial_manager`, `accountant`, `cashier`, `auditor`, `partner_office`.

---

## 4. Permissions Seeded

```sql
SELECT count(*) AS permission_count FROM public.permissions;
```

**Expected:** `23` (MVP permission set).

```sql
SELECT key, module, action
FROM public.permissions
ORDER BY module, key;
```

---

## 5. role_permissions Seeded

```sql
SELECT r.key AS role_key, count(rp.permission_id) AS permission_count
FROM public.roles r
LEFT JOIN public.role_permissions rp ON rp.role_id = r.id
GROUP BY r.key
ORDER BY r.key;
```

**Expected (approximate):**

| role_key | permission_count |
|----------|------------------|
| office_owner | 23 |
| financial_manager | 10 |
| accountant | 10 |
| cashier | 4 |
| auditor | 6 |
| partner_office | 2 |

---

## 6. Helper Functions Exist

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'current_profile_id',
    'set_updated_at',
    'is_office_member',
    'has_office_permission',
    'is_office_owner'
  )
ORDER BY routine_name;
```

**Expected:** 5 functions.

---

## 7. Public Office Profile Read Policy

Verify policy exists:

```sql
SELECT polname, polcmd, polroles::regrole[]
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname = 'office_public_profiles';
```

**Expected:** Policies including public read when `is_public = true`.

**Behavior test (Phase 2C with test data):**

1. Create office with `status = 'active'`, not suspended.
2. Create `office_public_profiles` row with `is_public = false` → anonymous SELECT returns 0 rows.
3. Set `is_public = true` → anonymous SELECT returns 1 row (headline/description only via RLS).

---

## 8. Cross-Tenant Denial (Conceptual)

When test users exist (Phase 2C):

1. User A is member of Office 1 only.
2. Query `offices` where `id = Office 2` as User A → **0 rows** (RLS).
3. Query `office_members` for Office 2 → **0 rows**.

As **service role** (server-only, never in browser), cross-tenant data is visible — confirms RLS is doing the isolation for authenticated users.

```sql
-- Structure check only (run as postgres/service role in SQL Editor)
SELECT count(*) FROM public.offices;
```

---

## 9. audit_log_system — No User Mutations

Verify no INSERT/UPDATE/DELETE policies for `authenticated`:

```sql
SELECT polname, polcmd
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname = 'audit_log_system';
```

**Expected:** SELECT policy only (e.g. `audit_log_system_select_office`).  
**No** INSERT/UPDATE/DELETE for authenticated role.

As authenticated test user (Phase 2C):

```sql
INSERT INTO public.audit_log_system (action, entity_type)
VALUES ('test', 'test');
```

**Expected:** Permission denied / RLS violation.

---

## 10. Triggers (updated_at)

```sql
SELECT tgname, relname
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
WHERE tgname LIKE '%set_updated_at%'
  OR tgname IN (
    'profiles_set_updated_at',
    'offices_set_updated_at',
    'office_members_set_updated_at',
    'client_profiles_set_updated_at',
    'office_public_profiles_set_updated_at'
  );
```

**Expected:** 5 triggers on profiles, offices, office_members, client_profiles, office_public_profiles.

---

## Smoke Test Checklist

| # | Check | Pass |
|---|-------|------|
| 1 | 9 tables exist | ☐ |
| 2 | RLS enabled on all | ☐ |
| 3 | 6 roles seeded | ☐ |
| 4 | 23 permissions seeded | ☐ |
| 5 | role_permissions mapped | ☐ |
| 6 | 5 helper functions exist | ☐ |
| 7 | Public profile policies exist | ☐ |
| 8 | Cross-tenant denial (with test users) | ☐ Phase 2C |
| 9 | audit_log no user INSERT | ☐ |
| 10 | updated_at triggers | ☐ |

---

*Record results in `docs/PHASE_2B2_APPLY_DEV_SCHEMA.md` after applying to development Supabase.*
