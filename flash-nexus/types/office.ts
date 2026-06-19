/**
 * Office and tenant types — conceptual mirror of public.offices (Phase 2B-1).
 */

export type OfficeId = string;

export type OfficeVerificationStatus =
  | "unverified"
  | "under_review"
  | "partially_verified"
  | "fully_verified"
  | "approved_partner"
  | "suspended";

export type OfficeStatus = "active" | "suspended" | "archived";

export interface Office {
  id: OfficeId;
  ownerProfileId: string | null;
  commercialName: string;
  legalName: string | null;
  slug: string | null;
  country: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  publicDescription: string | null;
  verificationStatus: OfficeVerificationStatus;
  publicVisibility: boolean;
  partnerDiscoveryVisibility: boolean;
  status: OfficeStatus;
  createdAt: string;
  updatedAt: string;
}

export type OfficeMemberStatus = "invited" | "active" | "suspended" | "removed";

export interface OfficeMember {
  id: string;
  officeId: OfficeId;
  profileId: string;
  roleId: string;
  status: OfficeMemberStatus;
  invitedBy: string | null;
  joinedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OfficePublicProfile {
  id: string;
  officeId: OfficeId;
  headline: string | null;
  publicDescription: string | null;
  servicesSummary: string | null;
  countriesServed: string[];
  currenciesSupported: string[];
  deliveryMethods: string[];
  isPublic: boolean;
  isAcceptingClients: boolean;
  isAcceptingPartners: boolean;
  verificationBadge: OfficeVerificationStatus;
  createdAt: string;
  updatedAt: string;
}
