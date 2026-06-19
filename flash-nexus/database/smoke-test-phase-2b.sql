# Phase 2B — Post-Apply Smoke Test (SQL)

Run in **Supabase Dashboard → SQL Editor** (development project only) after migrations 001–010 and seed.

See checklist in `database/SMOKE_TEST_PHASE_2B.md`.

```sql
-- 1) Tables exist (expect 9 rows)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles', 'offices', 'roles', 'permissions', 'role_permissions',
    'office_members', 'client_profiles', 'office_public_profiles', 'audit_log_system'
  )
ORDER BY table_name;

-- 2) RLS enabled (expect rls_enabled = true for all)
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'profiles', 'offices', 'roles', 'permissions', 'role_permissions',
    'office_members', 'client_profiles', 'office_public_profiles', 'audit_log_system'
  )
ORDER BY c.relname;

-- 3) Roles seeded (expect 6 rows)
SELECT count(*) AS role_count FROM public.roles;

-- 4) Permissions seeded (expect 23)
SELECT count(*) AS permission_count FROM public.permissions;

-- 5) Helper functions (expect 5)
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'current_profile_id', 'set_updated_at', 'is_office_member',
    'has_office_permission', 'is_office_owner'
  )
ORDER BY routine_name;

-- 6) audit_log policies — SELECT only for authenticated (no user INSERT)
SELECT polname, polcmd
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname = 'audit_log_system';
```

Or via CLI after link:

```bash
cd flash-nexus
npx supabase db execute --file database/smoke-test-phase-2b.sql
```
