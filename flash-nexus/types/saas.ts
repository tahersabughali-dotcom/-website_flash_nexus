/**
 * SaaS foundation types — audit log and cross-cutting SaaS concepts.
 */

import type { OfficeId } from "./office";

export interface AuditLogSystemEntry {
  id: string;
  actorProfileId: string | null;
  officeId: OfficeId | null;
  action: string;
  entityType: string;
  entityId: string | null;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface TenantContext {
  profileId: string;
  officeId: OfficeId;
  roleKey: string;
  permissionKeys: string[];
}

export type MigrationPhase = "2B-1" | "2B-2" | "2C" | "3";
