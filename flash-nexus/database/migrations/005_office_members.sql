-- Flash Nexus — Migration 005
-- office_members: links profiles to offices with a role

CREATE TABLE public.office_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id uuid NOT NULL REFERENCES public.offices (id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES public.roles (id),
  status text NOT NULL DEFAULT 'active',
  invited_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  joined_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT office_members_status_check CHECK (
    status IN ('invited', 'active', 'suspended', 'removed')
  ),
  CONSTRAINT office_members_office_profile_unique UNIQUE (office_id, profile_id)
);

COMMENT ON TABLE public.office_members IS
  'Primary tenant access table. RLS uses this for office-scoped authorization.';

CREATE INDEX idx_office_members_office_id ON public.office_members (office_id);
CREATE INDEX idx_office_members_profile_id ON public.office_members (profile_id);
CREATE INDEX idx_office_members_role_id ON public.office_members (role_id);
CREATE INDEX idx_office_members_status ON public.office_members (status);

CREATE TRIGGER office_members_set_updated_at
  BEFORE UPDATE ON public.office_members
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.office_members ENABLE ROW LEVEL SECURITY;

-- Bootstrap: owner can insert self as first member (Phase 2C registration flow)
CREATE POLICY office_members_insert_bootstrap_owner
  ON public.office_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    profile_id = public.current_profile_id()
    AND EXISTS (
      SELECT 1
      FROM public.offices o
      WHERE o.id = office_id
        AND o.owner_profile_id = public.current_profile_id()
    )
  );

COMMENT ON POLICY office_members_insert_bootstrap_owner ON public.office_members IS
  'Allows office creator to add themselves as first member during registration.';

-- SELECT/UPDATE/DELETE policies added in 010 after helper functions
