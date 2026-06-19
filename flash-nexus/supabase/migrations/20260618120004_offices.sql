-- Synced from database/migrations/004_offices.sql
-- Source of truth: database/migrations (do not edit supabase/migrations directly)

-- Flash Nexus — Migration 004
-- offices: tenant root for exchange/remittance businesses

CREATE TABLE public.offices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_profile_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  commercial_name text NOT NULL,
  legal_name text,
  slug text UNIQUE,
  country text,
  city text,
  phone text,
  email text,
  public_description text,
  verification_status text NOT NULL DEFAULT 'unverified',
  public_visibility boolean NOT NULL DEFAULT false,
  partner_discovery_visibility boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT offices_verification_status_check CHECK (
    verification_status IN (
      'unverified',
      'under_review',
      'partially_verified',
      'fully_verified',
      'approved_partner',
      'suspended'
    )
  ),
  CONSTRAINT offices_status_check CHECK (
    status IN ('active', 'suspended', 'archived')
  )
);

COMMENT ON TABLE public.offices IS
  'Tenant root. All office-scoped business data references offices.id as office_id.';

CREATE INDEX idx_offices_owner_profile_id ON public.offices (owner_profile_id);
CREATE INDEX idx_offices_slug ON public.offices (slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_offices_verification_status ON public.offices (verification_status);
CREATE INDEX idx_offices_status ON public.offices (status);

CREATE TRIGGER offices_set_updated_at
  BEFORE UPDATE ON public.offices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Basic RLS; enhanced policies in 010 after security helper functions exist
ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;

-- Placeholder deny-all until 010 (functions not yet available for member checks)
-- Temporary: allow authenticated insert for office registration (Phase 2C server validates)
CREATE POLICY offices_insert_authenticated
  ON public.offices
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_profile_id = public.current_profile_id());

COMMENT ON POLICY offices_insert_authenticated ON public.offices IS
  'Phase 2C: Office registration sets owner_profile_id to current user. Server action must validate.';
