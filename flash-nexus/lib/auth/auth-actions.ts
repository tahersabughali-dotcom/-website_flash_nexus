"use server";

/**
 * Auth Server Actions — Phase 2A placeholders.
 * Phase 2C: Implement sign-in, sign-up, sign-out with Supabase Auth.
 */

import type {
  AuthResult,
  SignInCredentials,
  SignUpClientInput,
  SignUpOfficeInput,
} from "./auth-types";

/**
 * Sign in with email and password.
 *
 * TODO Phase 2C:
 * - createClient() from @/lib/supabase/server
 * - supabase.auth.signInWithPassword(credentials)
 * - redirect to /dashboard or role-appropriate home
 */
export async function signInAction(
  credentials: SignInCredentials,
): Promise<AuthResult> {
  void credentials;
  return {
    success: false,
    error: "Sign in not implemented yet. Planned for Phase 2C.",
  };
}

/**
 * Sign out current session.
 *
 * TODO Phase 2C:
 * - supabase.auth.signOut()
 * - redirect to /
 */
export async function signOutAction(): Promise<AuthResult> {
  return {
    success: false,
    error: "Sign out not implemented yet. Planned for Phase 2C.",
  };
}

/**
 * Register a new client account.
 *
 * TODO Phase 2C:
 * - supabase.auth.signUp()
 * - Create profiles row (account_type: client)
 * - Create client_profiles row (Phase 2B/2C)
 */
export async function signUpClientAction(
  input: SignUpClientInput,
): Promise<AuthResult> {
  void input;
  return {
    success: false,
    error: "Client registration not implemented yet. Planned for Phase 2C.",
  };
}

/**
 * Register a new office and owner account.
 *
 * TODO Phase 2C:
 * - supabase.auth.signUp()
 * - Create profiles row (account_type: office_owner)
 * - Create offices row + office_members (role: owner)
 * - Start office setup wizard
 */
export async function signUpOfficeAction(
  input: SignUpOfficeInput,
): Promise<AuthResult> {
  void input;
  return {
    success: false,
    error: "Office registration not implemented yet. Planned for Phase 2C.",
  };
}

/**
 * Send password reset email.
 *
 * TODO Phase 2C: supabase.auth.resetPasswordForEmail()
 */
export async function resetPasswordAction(email: string): Promise<AuthResult> {
  void email;
  return {
    success: false,
    error: "Password reset not implemented yet. Planned for Phase 2C.",
  };
}
