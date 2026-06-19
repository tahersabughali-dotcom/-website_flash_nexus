-- Synced from database/migrations/009_security_functions.sql
-- Source of truth: database/migrations (do not edit supabase/migrations directly)

-- Flash Nexus — Migration 009
-- Security helper functions for RLS (SECURITY DEFINER with fixed search_path)

-- -----------------------------------------------------------------------------
-- is_office_member: active membership check
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_office_member(target_office_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.office_members om
    WHERE om.office_id = target_office_id
      AND om.profile_id = auth.uid()
      AND om.status = 'active'
  );
$$;

COMMENT ON FUNCTION public.is_office_member(uuid) IS
  'True if auth.uid() is an active member of the office. Used in RLS policies.';

-- -----------------------------------------------------------------------------
-- has_office_permission: role-based permission check
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_office_permission(
  target_office_id uuid,
  permission_key text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.office_members om
    INNER JOIN public.roles r ON r.id = om.role_id
    INNER JOIN public.role_permissions rp ON rp.role_id = r.id
    INNER JOIN public.permissions p ON p.id = rp.permission_id
    WHERE om.office_id = target_office_id
      AND om.profile_id = auth.uid()
      AND om.status = 'active'
      AND p.key = permission_key
  );
$$;

COMMENT ON FUNCTION public.has_office_permission(uuid, text) IS
  'True if active member role includes permission_key. SECURITY DEFINER for RLS subqueries.';

-- -----------------------------------------------------------------------------
-- is_office_owner: owner_profile_id or office_owner role
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_office_owner(target_office_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.offices o
    WHERE o.id = target_office_id
      AND o.owner_profile_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.office_members om
    INNER JOIN public.roles r ON r.id = om.role_id
    WHERE om.office_id = target_office_id
      AND om.profile_id = auth.uid()
      AND om.status = 'active'
      AND r.key = 'office_owner'
  );
$$;

COMMENT ON FUNCTION public.is_office_owner(uuid) IS
  'True if user is offices.owner_profile_id or active member with office_owner role.';

GRANT EXECUTE ON FUNCTION public.is_office_member(uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_office_permission(uuid, text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_office_owner(uuid) TO authenticated, anon;
