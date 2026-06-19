/**
 * Multi-tenant type definitions — Phase 2A placeholders.
 * The tenant boundary for Flash Nexus is the office (office_id).
 */

export type OfficeId = string;
export type TenantId = OfficeId;

export type OfficeVerificationStatus =
  | "unverified"
  | "under_review"
  | "partially_verified"
  | "fully_verified"
  | "approved_partner"
  | "suspended";

export type PublicVisibility = "hidden" | "public" | "partners_only";

export interface TenantOffice {
  id: OfficeId;
  commercialName: string;
  slug: string;
  country: string;
  city: string;
  verificationStatus: OfficeVerificationStatus;
  publicVisibility: PublicVisibility;
  subscriptionPlan: "basic" | "pro" | "enterprise";
}

export interface TenantMembership {
  officeId: OfficeId;
  userId: string;
  role: string;
  isActive: boolean;
}

/**
 * Context passed to server actions and services for tenant-scoped operations.
 * Phase 2C: Populated from session + office_members.
 */
export interface TenantContext {
  /** Currently selected or sole office for this request */
  officeId: OfficeId;
  userId: string;
  role: string;
  /** All offices the user belongs to (for office switcher) */
  officeIds: OfficeId[];
}

/**
 * Minimal shape for queries that must be scoped by tenant.
 * All business tables in Phase 3+ should extend or include office_id.
 */
export interface TenantScoped {
  officeId: OfficeId;
}
