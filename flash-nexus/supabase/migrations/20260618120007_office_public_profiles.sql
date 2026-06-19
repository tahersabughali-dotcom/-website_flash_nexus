-- Synced from database/migrations/007_office_public_profiles.sql
-- Source of truth: database/migrations (do not edit supabase/migrations directly)

-- Flash Nexus — Migration 007
-- office_public_profiles: public directory visibility for offices

CREATE TABLE public.office_public_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id uuid NOT NULL UNIQUE REFERENCES public.offices (id) ON DELETE CASCADE,
  headline text,
  public_description text,
  services_summary text,
  countries_served text[] NOT NULL DEFAULT '{}',
  currencies_supported text[] NOT NULL DEFAULT '{}',
  delivery_methods text[] NOT NULL DEFAULT '{}',
  is_public boolean NOT NULL DEFAULT false,
  is_accepting_clients boolean NOT NULL DEFAULT false,
  is_accepting_partners boolean NOT NULL DEFAULT false,
  verification_badge text NOT NULL DEFAULT 'unverified',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT office_public_profiles_verification_badge_check CHECK (
    verification_badge IN (
      'unverified',
      'under_review',
      'partially_verified',
      'fully_verified',
      'approved_partner',
      'suspended'
    )
  )
);

COMMENT ON TABLE public.office_public_profiles IS
  'Public directory data. Private office fields remain on offices table.';

CREATE INDEX idx_office_public_profiles_is_public ON public.office_public_profiles (is_public)
  WHERE is_public = true;

CREATE TRIGGER office_public_profiles_set_updated_at
  BEFORE UPDATE ON public.office_public_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.office_public_profiles ENABLE ROW LEVEL SECURITY;

-- Public read policy added in 010 (depends on offices join + is_public)
-- INSERT for office owner added in 010
