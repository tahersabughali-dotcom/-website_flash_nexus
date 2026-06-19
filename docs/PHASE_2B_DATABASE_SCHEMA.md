# Flash Nexus — Phase 2B-1 Database Schema

**Phase:** 2B-1 — Core SaaS Database Schema Draft  
**Status:** ✅ SQL files written — **not applied** to any Supabase project  
**Last Updated:** June 2026  

---

## 1. Objective

Create the first SQL migration and seed files for Flash Nexus SaaS identity, tenant isolation, RBAC, client profiles, office public profiles, and system audit logging — **without** financial tables, auth UI, or live database application.

---

## 2. Migration Files Created

Apply in numeric order on **development Supabase only** (Phase 2B-2):

| File | Purpose |
|------|---------|
| `001_extensions_and_triggers.sql` | `pgcrypto`, `set_updated_at()`, `current_profile_id()` |
| `002_profiles.sql` | Application profiles linked to `auth.users` |
| `003_roles_and_permissions.sql` | Roles, permissions, role_permissions |
| `004_offices.sql` | Tenant root table |
| `005_office_members.sql` | Profile ↔ office membership |
| `006_client_profiles.sql` | Marketplace client identity |
| `007_office_public_profiles.sql` | Public directory profile data |
| `008_audit_log_system.sql` | Non-financial audit log foundation |
| `009_security_functions.sql` | `is_office_member`, `has_office_permission`, `is_office_owner` |
| `010_rls_policies_enhanced.sql` | Office, member, public profile, audit RLS |

---

## 3. Seed Files Created

| File | Purpose |
|------|---------|
| `seeds/001_seed_roles_permissions.sql` | 6 roles, 23 MVP permissions, role mappings |

Seed is **idempotent** (`ON CONFLICT DO NOTHING` / `DO UPDATE` where safe).

---

## 4. Tables

| Table | Tenant-scoped | RLS |
|-------|---------------|-----|
| `profiles` | No (global user) | Own row only |
| `offices` | Root tenant | Members + owner update |
| `roles` | Global reference | Read authenticated |
| `permissions` | Global reference | Read authenticated |
| `role_permissions` | Global reference | Read authenticated |
| `office_members` | Yes (`office_id`) | Same office / manage by owner |
| `client_profiles` | No (client identity) | Own row only |
| `office_public_profiles` | Yes (`office_id`) | Public read + owner manage |
| `audit_log_system` | Optional `office_id` | Select with `audit_logs.view` |

---

## 5. Helper Functions

| Function | Returns | SECURITY DEFINER | Purpose |
|----------|---------|------------------|---------|
| `current_profile_id()` | uuid | No | `auth.uid()` alias |
| `set_updated_at()` | trigger | No | Auto-update timestamps |
| `is_office_member(office_id)` | boolean | Yes | Active membership check |
| `has_office_permission(office_id, key)` | boolean | Yes | RBAC permission check |
| `is_office_owner(office_id)` | boolean | Yes | Owner profile or `office_owner` role |

All `SECURITY DEFINER` functions use `SET search_path = public` to avoid search_path attacks.

---

## 6. RLS Strategy

1. **Deny by default** — RLS enabled on all app tables.
2. **Own profile** — users read/update only their `profiles` and `client_profiles`.
3. **Tenant isolation** — office data via `office_members` + helper functions.
4. **Reference data** — roles/permissions read-only for authenticated users.
5. **Public directory** — `office_public_profiles` readable when `is_public = true` and office not suspended.
6. **Audit log** — select only with permission; no user INSERT/UPDATE/DELETE policies (server-controlled in Phase 2C).
7. **Platform admin** — `profiles.account_type = 'platform_admin'`; bypass via server service role, not browser RLS.

### Profile creation (Phase 2C — not automated in 2B-1)

No automatic `auth.users` → `profiles` trigger in this phase. Phase 2C will create profiles via server actions after signup to control `account_type` and validation.

---

## 7. TypeScript Types Added

| File | Purpose |
|------|---------|
| `types/profile.ts` | Profile, ClientProfile |
| `types/office.ts` | Office, OfficeMember, OfficePublicProfile |
| `types/permissions.ts` | Role, Permission, PermissionKey, RoleKey |
| `types/saas.ts` | AuditLogSystemEntry, TenantContext |

`lib/supabase/types.ts` remains a placeholder until Phase 2B-2 code generation.

`lib/auth/auth-types.ts` updated: `AccountType` = `client` | `office_owner` | `platform_admin`.

---

## 8. What Is NOT Implemented

- Migrations **not applied** to any Supabase project
- No auth triggers on signup
- No login/register UI wiring
- No financial tables (transactions, accounts, quotes, etc.)
- No invitations table (optional — can add in 2B-2)
- No audit log INSERT policies for authenticated users
- SQL **not verified** against live Postgres until Phase 2B-2

---

## 9. How to Apply Migrations Later (Phase 2B-2)

### Option A: Supabase SQL Editor (development project)

1. Create a **development** Supabase project (not production).
2. Run each migration file in order (`001` → `010`).
3. Run `seeds/001_seed_roles_permissions.sql`.
4. Verify tables and RLS in Dashboard → Database.

### Option B: Supabase CLI

```bash
cd flash-nexus
supabase init          # if not done
supabase link --project-ref <dev-project-ref>

# Copy migrations to supabase/migrations/ or run manually
supabase db push       # staging/dev only after review
```

### Generate types

```bash
npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
```

### Verify seed

```sql
SELECT r.key, count(rp.permission_id) AS permission_count
FROM roles r
LEFT JOIN role_permissions rp ON rp.role_id = r.id
GROUP BY r.key;
```

---

## 10. Next Steps

| Phase | Task |
|-------|------|
| **2B-2** | Link dev Supabase, apply migrations, run seed, generate types, smoke-test RLS |
| **2C** | Auth flows, profile creation on signup, middleware session, route guards |
| **2D** | Registration UI wired to server actions |
| **3** | Financial engine tables (clients CRM, transactions, audit_logs financial) |

---

## 11. Platform Super Admin Note

Office roles do not include platform super admin. Use:

- `profiles.account_type = 'platform_admin'`
- Server-side admin client (`lib/supabase/admin.ts`) for platform operations only
- Never expose service role to browser

---

*SQL must be tested on development Supabase during Phase 2B-2 before any staging deployment.*
