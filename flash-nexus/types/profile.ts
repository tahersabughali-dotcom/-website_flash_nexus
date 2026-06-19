/**
 * Profile types — conceptual mirror of public.profiles (Phase 2B-1).
 * Not generated Supabase types. Replace/enhance after `supabase gen types` in Phase 2B-2.
 */

export type AccountType = "client" | "office_owner" | "platform_admin";

export type OnboardingStatus = "pending" | "in_progress" | "completed";

export type PreferredLocale = "ar" | "en";

export interface Profile {
  id: string;
  accountType: AccountType;
  fullName: string | null;
  displayName: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  preferredLocale: PreferredLocale;
  avatarUrl: string | null;
  onboardingStatus: OnboardingStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfile {
  id: string;
  profileId: string;
  defaultCountry: string | null;
  defaultCity: string | null;
  defaultCurrency: string | null;
  verificationStatus: ClientVerificationStatus;
  publicSearchEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ClientVerificationStatus =
  | "unverified"
  | "under_review"
  | "verified"
  | "suspended";
