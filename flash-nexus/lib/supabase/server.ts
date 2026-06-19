import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabasePublicEnv } from "@/lib/supabase/env";

import type { Database } from "./types";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 * Uses the anon key with cookie-based session — subject to RLS.
 *
 * Throws a clear error at runtime if env vars are missing (build is unaffected).
 */
export async function createClient() {
  const { url, anonKey } = getSupabasePublicEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll can fail in Server Components; middleware session refresh handles cookies.
        }
      },
    },
  });
}
