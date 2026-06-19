/**
 * RBAC types — conceptual mirror of roles, permissions, role_permissions.
 */

export type RoleKey =
  | "office_owner"
  | "financial_manager"
  | "accountant"
  | "cashier"
  | "auditor"
  | "partner_office";

export type PermissionKey =
  | "dashboard.view"
  | "administration.view"
  | "administration.manage_members"
  | "clients.view"
  | "clients.create"
  | "clients.update"
  | "transactions.view"
  | "transactions.create"
  | "transactions.update"
  | "transactions.approve"
  | "remittance_pricing.view"
  | "remittance_pricing.manage_rules"
  | "quotes.view"
  | "quotes.create"
  | "quotes.approve"
  | "accounting.view"
  | "reports.view"
  | "settings.view"
  | "settings.manage"
  | "public_profile.manage"
  | "partner_discovery.view"
  | "partner_requests.manage"
  | "audit_logs.view";

export interface Role {
  id: string;
  key: RoleKey;
  nameEn: string;
  nameAr: string;
  description: string | null;
  isSystem: boolean;
  createdAt: string;
}

export interface Permission {
  id: string;
  key: PermissionKey;
  module: string;
  action: string;
  nameEn: string;
  nameAr: string;
  description: string | null;
  createdAt: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  createdAt: string;
}

/** Platform admin uses profiles.account_type — not office role keys */
export const PLATFORM_ADMIN_ACCOUNT_TYPE = "platform_admin" as const;
