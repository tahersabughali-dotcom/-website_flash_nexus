-- Flash Nexus — Migration 010
-- Enhanced RLS policies using security helper functions

-- =============================================================================
-- offices
-- =============================================================================
CREATE POLICY offices_select_members
  ON public.offices
  FOR SELECT
  TO authenticated
  USING (public.is_office_member(id));

CREATE POLICY offices_update_owner
  ON public.offices
  FOR UPDATE
  TO authenticated
  USING (public.is_office_owner(id))
  WITH CHECK (public.is_office_owner(id));

-- =============================================================================
-- office_members
-- =============================================================================
CREATE POLICY office_members_select_same_office
  ON public.office_members
  FOR SELECT
  TO authenticated
  USING (public.is_office_member(office_id));

CREATE POLICY office_members_insert_manage
  ON public.office_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_office_owner(office_id)
    OR public.has_office_permission(office_id, 'administration.manage_members')
  );

CREATE POLICY office_members_update_manage
  ON public.office_members
  FOR UPDATE
  TO authenticated
  USING (
    public.is_office_owner(office_id)
    OR public.has_office_permission(office_id, 'administration.manage_members')
  )
  WITH CHECK (
    public.is_office_owner(office_id)
    OR public.has_office_permission(office_id, 'administration.manage_members')
  );

-- Prevent self role escalation: members cannot change their own role_id unless owner/admin
-- Enforced by WITH CHECK above on update; application layer must also validate in Phase 2C.

CREATE POLICY office_members_delete_manage
  ON public.office_members
  FOR DELETE
  TO authenticated
  USING (
    public.is_office_owner(office_id)
    OR public.has_office_permission(office_id, 'administration.manage_members')
  );

-- =============================================================================
-- office_public_profiles
-- =============================================================================
CREATE POLICY office_public_profiles_select_public
  ON public.office_public_profiles
  FOR SELECT
  TO anon, authenticated
  USING (
    is_public = true
    AND EXISTS (
      SELECT 1
      FROM public.offices o
      WHERE o.id = office_public_profiles.office_id
        AND o.status = 'active'
        AND o.verification_status <> 'suspended'
    )
  );

CREATE POLICY office_public_profiles_select_members
  ON public.office_public_profiles
  FOR SELECT
  TO authenticated
  USING (public.is_office_member(office_id));

CREATE POLICY office_public_profiles_insert_owner
  ON public.office_public_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_office_owner(office_id)
    OR public.has_office_permission(office_id, 'public_profile.manage')
  );

CREATE POLICY office_public_profiles_update_manage
  ON public.office_public_profiles
  FOR UPDATE
  TO authenticated
  USING (
    public.is_office_owner(office_id)
    OR public.has_office_permission(office_id, 'public_profile.manage')
  )
  WITH CHECK (
    public.is_office_owner(office_id)
    OR public.has_office_permission(office_id, 'public_profile.manage')
  );

-- =============================================================================
-- audit_log_system
-- =============================================================================
CREATE POLICY audit_log_system_select_office
  ON public.audit_log_system
  FOR SELECT
  TO authenticated
  USING (
    office_id IS NOT NULL
    AND public.has_office_permission(office_id, 'audit_logs.view')
  );

-- No INSERT/UPDATE/DELETE policies for authenticated — append via server actions only.
-- TODO Phase 2C: Server actions insert using authenticated client after permission check,
-- or service role for system events. Document in auth implementation.

COMMENT ON POLICY audit_log_system_select_office ON public.audit_log_system IS
  'Members with audit_logs.view can read office audit entries. Inserts are server-controlled.';
