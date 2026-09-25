// User roles
export type UserRole = "candidate" | "employer" | "admin";

// Candidate types
export type CandidateTier = "free" | "recommended" | "complete";
export type CandidateStatus = "draft" | "pending_review" | "active" | "suspended";
export type AvailabilityStatus = "immediate" | "1_month" | "3_months" | "not_available";

// Employer types
export type EmployerTier = "basic" | "priority" | "ultra";
export type PropertyType = "villa" | "apartment" | "estate" | "yacht" | "other";

// Shared types
export type ContactRequestStatus = "pending" | "approved" | "introduced" | "declined";
export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "expired";

// Location enums
export type LocationEnum =
  | "gibraltar"
  | "marbella"
  | "estepona"
  | "sotogrande"
  | "san_roque"
  | "la_linea"
  | "manilva"
  | "casares"
  | "benahavis"
  | "fuengirola"
  | "mijas"
  | "other";

export type LocationRegion = "gibraltar" | "costa_del_sol_west" | "costa_del_sol_east";

// Database row types
export interface Profile {
  id: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CandidateProfile {
  id: string;
  user_id: string;
  slug: string;
  headline: string | null;
  bio: string | null;
  experience_years: number | null;
  roles: string[];
  skills: string[];
  languages: string[];
  location: LocationEnum | null;
  location_region: LocationRegion | null;
  availability: AvailabilityStatus | null;
  salary_expectation_min: number | null;
  salary_expectation_max: number | null;
  references_verified: boolean;
  featured: boolean;
  status: CandidateStatus;
  tier: CandidateTier;
  cv_url: string | null;
  photos: string[];
  generated_cv: GeneratedCV | null;
  cv_generated_at: string | null;
  ai_generations_today: number;
  ai_generations_reset_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmployerProfile {
  id: string;
  user_id: string;
  company_name: string | null;
  property_type: PropertyType | null;
  location: LocationEnum | null;
  location_region: LocationRegion | null;
  staff_count: number | null;
  bio: string | null;
  tier: EmployerTier;
  created_at: string;
  updated_at: string;
}

export interface ContactRequest {
  id: string;
  employer_id: string;
  candidate_id: string;
  role_id: string | null;
  message: string;
  status: ContactRequestStatus;
  candidate_consent: "pending" | "accepted" | "declined" | null;
  admin_approved_at: string | null;
  candidate_consent_at: string | null;
  declined_by: "admin" | "candidate" | null;
  admin_notes: string | null;
  introduced_at: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  tier: string;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
}

export interface SavedCandidate {
  employer_id: string;
  candidate_id: string;
  created_at: string;
}

export interface ExperienceEntry {
  id: string;
  candidate_id: string;
  title: string;
  employer_name: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  current: boolean;
}

export interface Reference {
  id: string;
  candidate_id: string;
  name: string;
  relationship: string;
  phone: string | null;
  email: string | null;
  verified: boolean;
  verified_at: string | null;
}

export interface Certification {
  id: string;
  candidate_id: string;
  name: string;
  issuer: string | null;
  date_obtained: string | null;
  expiry_date: string | null;
  document_url: string | null;
  verified: boolean;
}

export interface ProfileView {
  id: string;
  candidate_id: string;
  viewer_id: string | null;
  viewed_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

// Field visibility - what different viewers can see on candidate profiles
export const CANDIDATE_PUBLIC_FIELDS = [
  "headline",
  "roles",
  "experience_years",
  "location",
  "location_region",
  "availability",
  "languages",
] as const;

export const CANDIDATE_SUBSCRIBER_FIELDS = [
  ...CANDIDATE_PUBLIC_FIELDS,
  "bio",
  "skills",
  "salary_expectation_min",
  "salary_expectation_max",
  "photos",
] as const;

// Admin can see all fields

// Role-posting model types
export type PositionType = "live_in" | "live_out" | "full_time" | "part_time";
export type ExperiencePreferred = "private_household" | "luxury_hospitality" | "open_to_both";
export type ListingTier = "standard" | "priority" | "ultra";
export type RoleStatus = "draft" | "pending_review" | "active" | "closed" | "expired";
export interface Role {
  id: string;
  employer_id: string;
  title: string;
  role_type: string;
  position_type: PositionType;
  location: LocationEnum;
  location_region: LocationRegion;
  responsibilities: string[];
  experience_preferred: ExperiencePreferred;
  salary_min: number | null;
  salary_max: number | null;
  additional_notes: string | null;
  listing_tier: ListingTier;
  status: RoleStatus;
  start_date: string;
  generated_brief: GeneratedBrief | null;
  brief_generated_at: string | null;
  stripe_payment_id: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// AI-generated structures
export interface GeneratedBrief {
  role_overview: string;
  key_responsibilities: string[];
  candidate_requirements: string[];
  schedule_compensation: string;
  about_household: string;
}

export interface GeneratedCV {
  professional_summary: string;
  skills_competencies: {
    category: string;
    skills: string[];
  }[];
  professional_experience: {
    role: string;
    years: string;
    description: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  availability: string;
  location_preferences: string[];
  salary_expectation: string;
}

