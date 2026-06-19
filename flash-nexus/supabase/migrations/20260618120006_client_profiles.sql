-- Synced from database/migrations/006_client_profiles.sql
-- Source of truth: database/migrations (do not edit supabase/migrations directly)

-- Flash Nexus — Migration 006
-- client_profiles: platform client identity (not office CRM clients)

CREATE TABLE public.client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles (id) ON DELETE CASCADE,
  default_country text,
  default_city text,
  default_currency text,
  verification_status text NOT NULL DEFAULT 'unverified',
  public_search_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT client_profiles_verification_status_check CHECK (
    verification_status IN (
      'unverified',
      'under_review',
      'verified',
      'suspended'
    )
  )
);

COMMENT ON TABLE public.client_profiles IS
  'Marketplace client profile. Office-scoped CRM clients table is Phase 3.';

CREATE INDEX idx_client_profiles_profile_id ON public.client_profiles (profile_id);

CREATE TRIGGER client_profiles_set_updated_at
  BEFORE UPDATE ON public.client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY client_profiles_select_own
  ON public.client_profiles
  FOR SELECT
  TO authenticated
  USING (profile_id = public.current_profile_id());

CREATE POLICY client_profiles_insert_own
  ON public.client_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = public.current_profile_id());

CREATE POLICY client_profiles_update_own
  ON public.client_profiles
  FOR UPDATE
  TO authenticated
  USING (profile_id = public.current_profile_id())
  WITH CHECK (profile_id = public.current_profile_id());
