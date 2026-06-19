/**
 * Tenant isolation guards — Phase 2A placeholders.
 * Phase 2C/3: Enforce office_id on all tenant-scoped operations.
 */

import type { OfficeId, TenantScoped } from "./tenant-types";
import { getActiveOfficeId, requireTenantContext } from "./tenant-context";

export class TenantGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TenantGuardError";
  }
}

/**
 * Ensure a resource belongs to the active tenant office.
 *
 * TODO Phase 2C: Compare resource.officeId with active office from session.
 * TODO Phase 3: Call from services before any financial mutation.
 */
export function assertSameTenant(
  resourceOfficeId: OfficeId,
  activeOfficeId: OfficeId,
): void {
  if (resourceOfficeId !== activeOfficeId) {
    throw new TenantGuardError(
      "Cross-tenant access denied. Resource does not belong to the active office.",
    );
  }
}

/**
 * Validate that an entity is tenant-scoped to the current office.
 *
 * TODO Phase 2C: Wire to getActiveOfficeId().
 */
export async function assertTenantScoped(
  entity: TenantScoped,
): Promise<void> {
  const activeOfficeId = await getActiveOfficeId();
  if (!activeOfficeId) {
    throw new TenantGuardError(
      "No active office. Tenant enforcement not available in Phase 2A.",
    );
  }
  assertSameTenant(entity.officeId, activeOfficeId);
}

/**
 * Require tenant context before executing tenant-scoped logic.
 *
 * TODO Phase 2C: Use at start of all office-scoped server actions.
 */
export async function requireTenantAccess(): Promise<OfficeId> {
  const ctx = await requireTenantContext();
  return ctx.officeId;
}

/**
 * Add office_id filter hint for query builders (documentation helper).
 * RLS is the primary enforcement layer; this is a server-side double-check.
 */
export function withOfficeScope<T extends Record<string, unknown>>(
  query: T,
  officeId: OfficeId,
): T & { office_id: OfficeId } {
  return { ...query, office_id: officeId };
}
