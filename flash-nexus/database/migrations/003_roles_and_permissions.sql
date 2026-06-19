-- Flash Nexus — Migration 003
-- roles, permissions, role_permissions (global reference data)

CREATE TABLE public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  description text,
  is_system boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.roles IS
  'Office-scoped application roles. Platform super admin is profiles.account_type = platform_admin.';

CREATE TABLE public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  module text NOT NULL,
  action text NOT NULL,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.permissions IS
  'Atomic permissions (module.action). Expanded in future migrations.';

CREATE TABLE public.role_permissions (
  role_id uuid NOT NULL REFERENCES public.roles (id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES public.permissions (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);

COMMENT ON TABLE public.role_permissions IS
  'Default permission grants per role. Seeded in database/seeds/001_seed_roles_permissions.sql';

CREATE INDEX idx_permissions_module ON public.permissions (module);
CREATE INDEX idx_role_permissions_role_id ON public.role_permissions (role_id);
CREATE INDEX idx_role_permissions_permission_id ON public.role_permissions (permission_id);

-- -----------------------------------------------------------------------------
-- RLS: read-only for authenticated users
-- -----------------------------------------------------------------------------
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY roles_select_authenticated
  ON public.roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY permissions_select_authenticated
  ON public.permissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY role_permissions_select_authenticated
  ON public.role_permissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Mutations: service role / migrations / seeds only (no INSERT/UPDATE/DELETE policies for authenticated)
