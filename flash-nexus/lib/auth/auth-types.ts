/**
 * Auth architecture types — Phase 2A placeholders.
 * Full implementation in Phase 2C (login, logout, register, session guards).
 */

/** Matches Supabase auth.users.id */
export type AuthUserId = string;

/** Platform account classification from profiles.account_type */
export type AccountType = "client" | "office_owner" | "platform_admin";

/** Office-scoped application roles (roles.key via office_members) */
export type OfficeRole =
  | "office_owner"
  | "financial_manager"
  | "accountant"
  | "cashier"
  | "auditor"
  | "partner_office";

export interface AuthUser {
  id: AuthUserId;
  email: string;
  emailVerified: boolean;
}

export interface UserProfile {
  id: AuthUserId;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  preferredLanguage: "ar" | "en";
  accountType: AccountType;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: AuthUser;
  profile: UserProfile | null;
}

export type RegistrationPath = "client" | "office";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpClientInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  country: string;
}

export interface SignUpOfficeInput {
  email: string;
  password: string;
  commercialName: string;
  country: string;
  city: string;
  contactPhone?: string;
  publicVisibility?: boolean;
}

export interface AuthResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
