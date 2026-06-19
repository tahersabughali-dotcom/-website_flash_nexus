-- Flash Nexus — Seed 001
-- Roles, permissions, and role_permissions (idempotent)
-- Run AFTER migrations 001–010 on development Supabase only.

-- =============================================================================
-- ROLES
-- =============================================================================
INSERT INTO public.roles (key, name_en, name_ar, description, is_system)
VALUES
  ('office_owner', 'Office Owner', 'مالك المكتب', 'Full control of the exchange office', true),
  ('financial_manager', 'Financial Manager', 'المدير المالي', 'Reports, approvals, capital and liquidity', true),
  ('accountant', 'Accountant', 'محاسب', 'Transaction entry and client management', true),
  ('cashier', 'Cashier', 'أمين الصندوق', 'Cash operations and basic transactions', true),
  ('auditor', 'Auditor', 'مدقق', 'Read-only audit and compliance review', true),
  ('partner_office', 'Partner Office', 'مكتب شريك', 'Partner network discovery and requests', true)
ON CONFLICT (key) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  is_system = EXCLUDED.is_system;

-- Platform super admin: profiles.account_type = 'platform_admin' (not an office role).
-- Super Admin bypasses office RBAC via server-side service role — document in Phase 2C.

-- =============================================================================
-- PERMISSIONS (MVP set)
-- =============================================================================
INSERT INTO public.permissions (key, module, action, name_en, name_ar, description)
VALUES
  ('dashboard.view', 'dashboard', 'view', 'View Dashboard', 'عرض لوحة التحكم', 'Access office dashboard'),
  ('administration.view', 'administration', 'view', 'View Administration', 'عرض الإدارة', 'View admin settings'),
  ('administration.manage_members', 'administration', 'manage_members', 'Manage Members', 'إدارة الأعضاء', 'Invite and manage office staff'),
  ('clients.view', 'clients', 'view', 'View Clients', 'عرض العملاء', 'View client list and profiles'),
  ('clients.create', 'clients', 'create', 'Create Clients', 'إنشاء عملاء', 'Add new clients'),
  ('clients.update', 'clients', 'update', 'Update Clients', 'تحديث العملاء', 'Edit client records'),
  ('transactions.view', 'transactions', 'view', 'View Transactions', 'عرض المعاملات', 'View transactions'),
  ('transactions.create', 'transactions', 'create', 'Create Transactions', 'إنشاء معاملات', 'Enter transactions'),
  ('transactions.update', 'transactions', 'update', 'Update Transactions', 'تحديث المعاملات', 'Edit transactions'),
  ('transactions.approve', 'transactions', 'approve', 'Approve Transactions', 'اعتماد المعاملات', 'Approve sensitive transactions'),
  ('remittance_pricing.view', 'remittance_pricing', 'view', 'View Remittance Pricing', 'عرض تسعير الحوالات', 'Use pricing calculator'),
  ('remittance_pricing.manage_rules', 'remittance_pricing', 'manage_rules', 'Manage Pricing Rules', 'إدارة قواعد التسعير', 'Configure corridors and rules'),
  ('quotes.view', 'quotes', 'view', 'View Quotes', 'عرض عروض الأسعار', 'View quotes'),
  ('quotes.create', 'quotes', 'create', 'Create Quotes', 'إنشاء عروض أسعار', 'Create customer quotes'),
  ('quotes.approve', 'quotes', 'approve', 'Approve Quotes', 'اعتماد عروض الأسعار', 'Approve quotes'),
  ('accounting.view', 'accounting', 'view', 'View Accounting', 'عرض المحاسبة', 'View accounts and ledger'),
  ('reports.view', 'reports', 'view', 'View Reports', 'عرض التقارير', 'Generate and view reports'),
  ('settings.view', 'settings', 'view', 'View Settings', 'عرض الإعدادات', 'View office settings'),
  ('settings.manage', 'settings', 'manage', 'Manage Settings', 'إدارة الإعدادات', 'Change office configuration'),
  ('public_profile.manage', 'public_profile', 'manage', 'Manage Public Profile', 'إدارة الملف العام', 'Edit public directory profile'),
  ('partner_discovery.view', 'partner_discovery', 'view', 'View Partner Discovery', 'عرض اكتشاف الشركاء', 'Search partner offices'),
  ('partner_requests.manage', 'partner_requests', 'manage', 'Manage Partner Requests', 'إدارة طلبات الشراكة', 'Send and manage partnership requests'),
  ('audit_logs.view', 'audit_logs', 'view', 'View Audit Logs', 'عرض سجل التدقيق', 'View office audit history')
ON CONFLICT (key) DO UPDATE SET
  module = EXCLUDED.module,
  action = EXCLUDED.action,
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description;

-- =============================================================================
-- ROLE → PERMISSION MAPPINGS
-- =============================================================================

-- office_owner: all MVP permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.key = 'office_owner'
ON CONFLICT DO NOTHING;

-- financial_manager
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.key = 'financial_manager'
  AND p.key IN (
    'dashboard.view',
    'clients.view',
    'transactions.view',
    'transactions.approve',
    'remittance_pricing.view',
    'quotes.view',
    'quotes.approve',
    'accounting.view',
    'reports.view',
    'audit_logs.view'
  )
ON CONFLICT DO NOTHING;

-- accountant
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.key = 'accountant'
  AND p.key IN (
    'dashboard.view',
    'clients.view',
    'clients.create',
    'clients.update',
    'transactions.view',
    'transactions.create',
    'remittance_pricing.view',
    'quotes.view',
    'quotes.create',
    'reports.view'
  )
ON CONFLICT DO NOTHING;

-- cashier
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.key = 'cashier'
  AND p.key IN (
    'dashboard.view',
    'transactions.view',
    'transactions.create',
    'quotes.view'
  )
ON CONFLICT DO NOTHING;

-- auditor
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.key = 'auditor'
  AND p.key IN (
    'dashboard.view',
    'clients.view',
    'transactions.view',
    'accounting.view',
    'reports.view',
    'audit_logs.view'
  )
ON CONFLICT DO NOTHING;

-- partner_office
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.key = 'partner_office'
  AND p.key IN (
    'partner_discovery.view',
    'partner_requests.manage'
  )
ON CONFLICT DO NOTHING;
