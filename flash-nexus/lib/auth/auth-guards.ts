/**
 * Auth route guards — Phase 2A placeholders.
 * Phase 2C: Use in middleware and server layouts to protect dashboard routes.
 */

import type { AccountType, OfficeRole } from "./auth-types";
import { getCurrentUser, getSession } from "./session";

export class AuthGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthGuardError";
  }
}

/**
 * Require authenticated user. Redirect or throw in Phase 2C.
 *
 * TODO Phase 2C: redirect to /login when unauthenticated.
 */
export async function requireAuth(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthGuardError(
      "Authentication required. Not implemented in Phase 2A — see Phase 2C.",
    );
  }
}

/**
 * Require specific platform account type.
 *
 * TODO Phase 2C: Enforce after profiles table exists.
 */
export async function requireAccountType(
  allowed: AccountType[],
): Promise<void> {
  void allowed;
  await requireAuth();
  // Phase 2A: No enforcement
}

/**
 * Require office membership with optional role check.
 *
 * TODO Phase 2C: Query office_members with RLS.
 */
export async function requireOfficeMember(
  officeId: string,
  roles?: OfficeRole[],
): Promise<void> {
  void officeId;
  void roles;
  await requireAuth();
  // Phase 2A: No enforcement
}

/**
 * Require Super Admin platform role.
 *
 * TODO Phase 2C: Check profiles.account_type === 'platform_admin'.
 */
export async function requireSuperAdmin(): Promise<void> {
  await requireAccountType(["platform_admin"]);
}

/**
 * Optional auth — returns whether user is logged in without throwing.
 */
export async function optionalAuth(): Promise<boolean> {
  return (await getCurrentUser()) !== null;
}

/** @deprecated Phase 2A stub — use getSession in Phase 2C */
export async function getAuthContextForGuard() {
  return getSession();
}
