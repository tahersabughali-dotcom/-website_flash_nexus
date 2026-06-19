-- Synced from database/migrations/001_extensions_and_triggers.sql
-- Source of truth: database/migrations (do not edit supabase/migrations directly)

-- Flash Nexus — Migration 001
-- Extensions, updated_at trigger, and current_profile_id helper
-- Phase 2B-1: SaaS foundation (no financial tables)

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- updated_at trigger function
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_updated_at() IS
  'Sets updated_at to now() on row update. Applied to SaaS foundation tables.';

-- -----------------------------------------------------------------------------
-- Auth helper: current application profile id (= auth.users.id)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT auth.uid();
$$;

COMMENT ON FUNCTION public.current_profile_id() IS
  'Returns the authenticated user UUID from Supabase Auth (profiles.id).';

-- Grant execute to authenticated role
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_profile_id() TO authenticated, anon;
