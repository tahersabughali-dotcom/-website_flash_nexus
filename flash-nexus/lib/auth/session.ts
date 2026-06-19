/**
 * Session helpers — Phase 2A placeholders.
 * Phase 2C: Implement with lib/supabase/server.ts createClient().
 */

import type { AuthSession, AuthUser } from "./auth-types";

/**
 * Get the current authenticated user from Supabase session.
 *
 * TODO Phase 2C: Implement using createClient() from @/lib/supabase/server
 * and supabase.auth.getUser().
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // Phase 2A: No auth wired — returns null so Phase 1 UI remains accessible.
  return null;
}

/**
 * Get full session including profile.
 *
 * TODO Phase 2C: Join profiles table after Phase 2B migrations.
 */
export async function getSession(): Promise<AuthSession | null> {
  // Phase 2A: Placeholder
  return null;
}

/**
 * Check if Supabase auth session exists (without loading profile).
 *
 * TODO Phase 2C: Implement session check.
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
