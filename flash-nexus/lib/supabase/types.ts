/**
 * Placeholder Supabase Database types.
 *
 * Phase 2B-1: Conceptual app types live in types/profile.ts, types/office.ts, etc.
 * Phase 2B-2: Replace this file with generated types:
 *   npx supabase gen types typescript --local > lib/supabase/types.ts
 *
 * Tables in Phase 2B-1 migrations:
 *   profiles, offices, roles, permissions, role_permissions, office_members,
 *   client_profiles, office_public_profiles, audit_log_system
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/** Re-export for convenience — update when schema is migrated in Phase 2B */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
