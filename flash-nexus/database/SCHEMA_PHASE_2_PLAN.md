# Flash Nexus — Schema Phase 2 Plan

**Document Version:** 1.0  
**Status:** Planning only — no SQL migrations in Phase 2A  
**Next Step:** Phase 2B — write and apply initial migrations  

This document plans MVP SaaS foundation tables. Financial tables (clients, transactions, accounts) are **Phase 3** and are not listed here.

---

## Overview

Phase 2 establishes:

- User identity linked to Supabase Auth (`auth.users`)
- Multi-tenant offices
- Office membership and application roles
- Permission matrix (reference data)
- Optional invitations for staff onboarding

All tenant-scoped tables use **RLS** enforced by `office_id` + `office_members` membership.

---

## Table: `profiles`

| Attribute | Value |
|-----------|-------|
| **Purpose** | Extend `auth.users` with platform profile data |
| **Phase** | **2B** (schema) + **2C** (auth wiring) |

### Key Fields

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | FK → `auth.users.id`, ON DELETE CASCADE |
| `full_name` | TEXT | Display name |
| `phone` | TEXT | Optional |
| `avatar_url` | TEXT | Optional |
| `preferred_language` | TEXT | `ar` \| `en`, default `ar` |
| `account_type` | TEXT | `client` \| `office_staff` \| `super_admin` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

### Tenant Isolation

- **Not tenant-scoped** — global per user (one profile per auth user).
- RLS: users can read/update **own** row only; Super Admin read via service role or dedicated policy.

### RLS Notes

```sql
-- Conceptual
SELECT/UPDATE: auth.uid() = id
INSERT: auth.uid() = id (on signup trigger or server action)
```

### Audit Notes

- `created_at`, `updated_at` on row.
- Profile changes by admin logged in Phase 3+ audit system.

---

## Table: `offices`

| Attribute | Value |
|-----------|-------|
| **Purpose** | Core tenant entity — exchange office / business |
| **Phase** | **2B** |

### Key Fields

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | Default gen_random_uuid() |
| `commercial_name` | TEXT NOT NULL | |
| `legal_name` | TEXT | Optional |
| `slug` | TEXT UNIQUE | URL-friendly |
| `country` | TEXT NOT NULL | |
| `city` | TEXT NOT NULL | |
| `contact_email` | TEXT | |
| `contact_phone` | TEXT | |
| `description` | TEXT | |
| `logo_url` | TEXT | |
| `verification_status` | TEXT | Default `unverified` |
| `public_visibility` | TEXT | Default `hidden` |
| `partner_search_enabled` | BOOLEAN | Default false |
| `subscription_plan` | TEXT | Default `basic` |
| `settings` | JSONB | Default `{}` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

### Tenant Isolation

- **Is the tenant root** — `id` is used as `office_id` elsewhere.
- No `office_id` on this table.

### RLS Notes

- SELECT: members of office via `office_members`, or public fields via `office_public_profiles` view (later).
- INSERT: authenticated users creating new office (registration flow).
- UPDATE: office `owner` role only (via membership check).

### Audit Notes

- Verification status changes audited (Phase 2C+ / Super Admin).

---

## Table: `office_members`

| Attribute | Value |
|-----------|-------|
| **Purpose** | Links users to offices with application roles |
| **Phase** | **2B** |

### Key Fields

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `office_id` | UUID FK | → `offices.id` |
| `user_id` | UUID FK | → `profiles.id` / `auth.users.id` |
| `role` | TEXT | `owner`, `financial_manager`, `accountant`, `cashier`, `auditor` |
| `permissions` | JSONB | Optional overrides |
| `is_active` | BOOLEAN | Default true |
| `invited_by` | UUID FK | Optional → profiles |
| `joined_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

### Tenant Isolation

- **Scoped by `office_id`** — central table for RLS subqueries.
- UNIQUE (`office_id`, `user_id`).

### RLS Notes

- SELECT: user is member of same `office_id`, or is the row's `user_id`.
- INSERT: office `owner` inviting members, or system on office registration (owner bootstrap).
- UPDATE/DELETE: office `owner` only; soft-deactivate via `is_active`.

### Audit Notes

- Role changes should be audit-logged (Phase 3 audit table or interim log).

---

## Table: `roles`

| Attribute | Value |
|-----------|-------|
| **Purpose** | Reference table of named office roles |
| **Phase** | **2B** (seed data) |

### Key Fields

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | e.g. `owner`, `accountant` |
| `name` | TEXT | Display name |
| `description` | TEXT | |
| `is_system` | BOOLEAN | Cannot delete system roles |

### Tenant Isolation

- **Global reference** — not per office (same roles for all tenants).
- RLS: read-only for authenticated users.

### RLS Notes

- SELECT: all authenticated.
- INSERT/UPDATE/DELETE: service role / Super Admin only.

---

## Table: `permissions`

| Attribute | Value |
|-----------|-------|
| **Purpose** | Atomic permission strings (`transaction.create`, etc.) |
| **Phase** | **2B** (seed data) |

### Key Fields

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | e.g. `transaction.create` |
| `name` | TEXT | Human label |
| `category` | TEXT | e.g. `transactions`, `clients` |
| `description` | TEXT | |

### Tenant Isolation

- **Global reference** — not tenant-scoped.

### RLS Notes

- SELECT: authenticated users.
- Mutations: service role only.

---

## Table: `role_permissions`

| Attribute | Value |
|-----------|-------|
| **Purpose** | Many-to-many: which permissions each role has by default |
| **Phase** | **2B** (seed data) |

### Key Fields

| Column | Type | Notes |
|--------|------|-------|
| `role_id` | TEXT FK | → `roles.id` |
| `permission_id` | TEXT FK | → `permissions.id` |
| PK | (role_id, permission_id) | |

### Tenant Isolation

- **Global reference** — seeded from `SECURITY_AND_PERMISSIONS.md` matrix.

### RLS Notes

- SELECT: authenticated.
- Mutations: service role only.

---

## Table: `invitations` (Optional — Phase 2B or 2C)

| Attribute | Value |
|-----------|-------|
| **Purpose** | Pending staff invites to an office |
| **Phase** | **2B** (schema) or **2C** (if registration priority is higher) |

### Key Fields

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `office_id` | UUID FK | → offices |
| `email` | TEXT NOT NULL | |
| `role` | TEXT | Target office role |
| `token` | TEXT UNIQUE | Secure invite token |
| `invited_by` | UUID FK | → profiles |
| `expires_at` | TIMESTAMPTZ | |
| `accepted_at` | TIMESTAMPTZ | Null until accepted |
| `status` | TEXT | `pending`, `accepted`, `expired`, `revoked` |
| `created_at` | TIMESTAMPTZ | |

### Tenant Isolation

- **Scoped by `office_id`**.

### RLS Notes

- SELECT: office owners/managers of `office_id`; invitee via token (server action).
- INSERT: office owner.
- UPDATE: accept flow via server action with token validation.

---

## Table: `client_profiles` (Optional — Phase 2C or Marketplace phase)

| Attribute | Value |
|-----------|-------|
| **Purpose** | Marketplace client identity (separate from office-scoped `clients` in Phase 3) |
| **Phase** | **2C** or **Phase 7** (marketplace) |

### Key Fields

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `user_id` | UUID FK UNIQUE | → profiles |
| `full_name` | TEXT | |
| `country` | TEXT | |
| `phone` | TEXT | |
| `created_at` | TIMESTAMPTZ | |

### Tenant Isolation

- **Not office-scoped** — global client marketplace identity.
- Office-scoped CRM `clients` table is **Phase 3**.

### RLS Notes

- User owns own row; offices see limited fields only through service requests (later).

---

## Table: `office_public_profiles` (Optional — Phase 2C or Phase 7)

| Attribute | Value |
|-----------|-------|
| **Purpose** | Denormalized/public view of office for directory (can be a view instead of table) |
| **Phase** | **2C** or **Phase 7** |

### Key Fields

Could be a **VIEW** on `offices` + `office_services` filtering `public_visibility = 'public'`.

| Column | Type | Notes |
|--------|------|-------|
| `office_id` | UUID | → offices |
| `commercial_name` | TEXT | |
| `country`, `city` | TEXT | |
| `verification_status` | TEXT | |
| `description` | TEXT | |
| `services_summary` | JSONB | Optional |

### Tenant Isolation

- Public read for directory; write via office settings.

### RLS Notes

- SELECT: anonymous + authenticated for public offices only.
- Hidden/suspended offices excluded.

---

## Phase Summary

| Table | Phase 2B | Phase 2C | Later |
|-------|----------|----------|-------|
| profiles | ✅ Migrate | ✅ Auth trigger / signup | |
| offices | ✅ Migrate | ✅ Registration | |
| office_members | ✅ Migrate | ✅ Bootstrap owner | |
| roles | ✅ Seed | | |
| permissions | ✅ Seed | | |
| role_permissions | ✅ Seed | | |
| invitations | ⚙️ Optional | ✅ Accept flow | |
| client_profiles | | ⚙️ Optional | Marketplace |
| office_public_profiles | | ⚙️ View/table | Directory |

---

## Explicitly NOT in Phase 2

These tables are **Phase 3+** (Core Financial Engine):

- `clients` (office-scoped CRM)
- `accounts`
- `currencies`
- `transactions`
- `audit_logs`
- `quotes`, `corridors`, `cut_rules`, etc.

---

## RLS Helper Function (Planned — Phase 2B)

```sql
-- Conceptual: check if auth.uid() is active member of office_id
CREATE FUNCTION public.is_office_member(check_office_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM office_members
    WHERE office_id = check_office_id
      AND user_id = auth.uid()
      AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

---

*Phase 2B will convert this plan into timestamped migration files in `database/migrations/`.*
