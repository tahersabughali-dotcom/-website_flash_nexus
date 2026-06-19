/**
 * Supabase environment helpers.
 * Throws only when utilities are invoked — not at import time — so static builds succeed without env vars.
 */

const MISSING_PUBLIC_ENV_MESSAGE =
  "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and configure your Supabase project.";

const MISSING_SERVICE_ROLE_MESSAGE =
  "Missing SUPABASE_SERVICE_ROLE_KEY. Required for server-only admin operations. Never expose this key to the browser.";

const SERVICE_ROLE_BROWSER_MESSAGE =
  "SUPABASE_SERVICE_ROLE_KEY must never be accessed in browser code.";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getSupabasePublicEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    throw new Error(MISSING_PUBLIC_ENV_MESSAGE);
  }

  return { url, anonKey };
}

/**
 * Service role key — server-only. Throws if called in the browser.
 */
export function getSupabaseServiceRoleKey(): string {
  if (typeof window !== "undefined") {
    throw new Error(SERVICE_ROLE_BROWSER_MESSAGE);
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(MISSING_SERVICE_ROLE_MESSAGE);
  }

  return serviceRoleKey;
}
