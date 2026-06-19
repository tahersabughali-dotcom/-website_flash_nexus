-- Synced from database/migrations/002_profiles.sql
-- Source of truth: database/migrations (do not edit supabase/migrations directly)

-- Flash Nexus — Migration 002
-- profiles: application profile linked to auth.users

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  account_type text NOT NULL,
  full_name text,
  display_name text,
  phone text,
  country text,
  city text,
  preferred_locale text NOT NULL DEFAULT 'ar',
  avatar_url text,
  onboarding_status text NOT NULL DEFAULT 'pending',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT profiles_account_type_check CHECK (
    account_type IN ('client', 'office_owner', 'platform_admin')
  ),
  CONSTRAINT profiles_preferred_locale_check CHECK (
    preferred_locale IN ('ar', 'en')
  ),
  CONSTRAINT profiles_onboarding_status_check CHECK (
    onboarding_status IN ('pending', 'in_progress', 'completed')
  )
);

COMMENT ON TABLE public.profiles IS
  'Application profile for each Supabase auth user. Auth source is auth.users.';

CREATE INDEX idx_profiles_account_type ON public.profiles (account_type);
CREATE INDEX idx_profiles_is_active ON public.profiles (is_active);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = public.current_profile_id());

CREATE POLICY profiles_insert_own
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = public.current_profile_id());

CREATE POLICY profiles_update_own
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = public.current_profile_id())
  WITH CHECK (id = public.current_profile_id());

-- TODO Phase 2C: Restrict which columns users may self-update (e.g. not account_type).
-- Platform admin access uses service role / server actions — not browser RLS bypass.
