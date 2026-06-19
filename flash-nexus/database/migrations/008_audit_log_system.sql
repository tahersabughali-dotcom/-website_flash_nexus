-- Flash Nexus — Migration 008
-- audit_log_system: non-financial SaaS audit foundation

CREATE TABLE public.audit_log_system (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  office_id uuid REFERENCES public.offices (id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  metadata jsonb NOT NULL DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.audit_log_system IS
  'Append-only SaaS audit log. Financial audit logs are a separate Phase 3 table. Inserts via server actions; users cannot modify audit rows.';

CREATE INDEX idx_audit_log_system_office_id ON public.audit_log_system (office_id);
CREATE INDEX idx_audit_log_system_actor_profile_id ON public.audit_log_system (actor_profile_id);
CREATE INDEX idx_audit_log_system_entity ON public.audit_log_system (entity_type, entity_id);
CREATE INDEX idx_audit_log_system_created_at ON public.audit_log_system (created_at DESC);

ALTER TABLE public.audit_log_system ENABLE ROW LEVEL SECURITY;

-- SELECT policy in 010 (requires has_office_permission)
-- No INSERT/UPDATE/DELETE for authenticated via RLS — server/service role only in Phase 2C
