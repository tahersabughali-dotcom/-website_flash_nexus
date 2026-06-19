import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicEnv } from "@/lib/supabase/env";

import type { Database } from "./types";

/**
 * Supabase client for Client Components and browser usage.
 * Uses the anon key — subject to Row Level Security (RLS).
 *
 * Throws a clear error at runtime if env vars are missing (build is unaffected).
 */
export function createClient() {
  const { url, anonKey } = getSupabasePublicEnv();
  return createBrowserClient<Database>(url, anonKey);
}
