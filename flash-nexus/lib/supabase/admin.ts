import { createClient } from "@supabase/supabase-js";

import {
  getSupabasePublicEnv,
  getSupabaseServiceRoleKey,
} from "@/lib/supabase/env";

import type { Database } from "./types";

/**
 * Supabase admin client — SERVICE ROLE — server-only.
 *
 * Bypasses RLS. Use only for controlled platform-level server tasks
 * (e.g. Super Admin operations, migrations, system jobs).
 *
 * NOT wired into any feature in Phase 2A.
 * Do NOT use for normal user or office operations.
 *
 * Throws if called in the browser or if env vars are missing.
 */
export function createAdminClient() {
  const { url } = getSupabasePublicEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
