/**
 * Tenant context resolution — Phase 2A placeholders.
 * Phase 2C: Resolve from auth session + office_members + optional cookie/header for active office.
 */

import type { TenantContext, TenantId } from "./tenant-types";

/**
 * Get tenant context for the current request.
 *
 * TODO Phase 2C:
 * - Load user from getSession()
 * - Load office_members for user
 * - Resolve active office_id (default to first membership or header)
 */
export async function getTenantContext(): Promise<TenantContext | null> {
  // Phase 2A: No tenant context without auth
  return null;
}

/**
 * Get active office ID for current session.
 *
 * TODO Phase 2C: Return from getTenantContext() or throw if missing.
 */
export async function getActiveOfficeId(): Promise<TenantId | null> {
  const ctx = await getTenantContext();
  return ctx?.officeId ?? null;
}

/**
 * Assert tenant context exists — for future server actions.
 *
 * TODO Phase 2C: Throw TenantGuardError if no context.
 */
export async function requireTenantContext(): Promise<TenantContext> {
  const ctx = await getTenantContext();
  if (!ctx) {
    throw new Error(
      "Tenant context not available. Auth and office membership required — Phase 2C.",
    );
  }
  return ctx;
}
