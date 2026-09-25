-- SECURITY FIX: users could edit fields that only HHT (admin) or Stripe should set.
--
-- The "owner can update own ..." policies on candidate_profiles, employer_profiles
-- and roles have no column restrictions, so over the REST API a user could:
--   * candidates: approve themselves (status='active'), mark themselves
--     Gold Verified / references verified, upgrade their tier, reset AI quota
--   * employers: upgrade their tier
--   * employers: publish a role (status='active') without HHT review
--
-- These triggers silently keep the protected fields at their previous value
-- (or a safe default on insert) unless the change comes from the service role,
-- a direct database session, or an admin. Silently keeping the old value (instead
-- of raising) means existing forms that send these fields keep working.

CREATE OR REPLACE FUNCTION public.is_privileged_writer()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(auth.role(), '') = 'service_role'
         OR auth.uid() IS NULL
         OR public.is_admin();
$$;

-- ── candidate_profiles ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.guard_candidate_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_privileged_writer() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.status := CASE WHEN NEW.status = 'draft' THEN 'draft'::candidate_status
                       ELSE 'pending_review'::candidate_status END;
    NEW.tier := 'free';
    NEW.gold_verified := false;
    NEW.gold_verified_at := NULL;
    NEW.reference_status := 'pending';
    NEW.references_verified := false;
    NEW.verification_notes := NULL;
    NEW.featured := false;
    NEW.featured_paid_at := NULL;
    NEW.featured_expires_at := NULL;
    NEW.ai_generations_today := 0;
    NEW.ai_generations_reset_at := NULL;
    RETURN NEW;
  END IF;

  -- UPDATE: candidates may only move between draft and pending_review.
  -- An approved (active), waitlisted or suspended candidate keeps that status
  -- when they edit their profile.
  IF NOT (OLD.status IN ('draft', 'pending_review') AND NEW.status IN ('draft', 'pending_review')) THEN
    NEW.status := OLD.status;
  END IF;

  NEW.user_id := OLD.user_id;
  NEW.tier := OLD.tier;
  NEW.gold_verified := OLD.gold_verified;
  NEW.gold_verified_at := OLD.gold_verified_at;
  NEW.reference_status := OLD.reference_status;
  NEW.references_verified := OLD.references_verified;
  NEW.verification_notes := OLD.verification_notes;
  NEW.featured := OLD.featured;
  NEW.featured_paid_at := OLD.featured_paid_at;
  NEW.featured_expires_at := OLD.featured_expires_at;
  NEW.ai_generations_today := OLD.ai_generations_today;
  NEW.ai_generations_reset_at := OLD.ai_generations_reset_at;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_candidate_profile ON public.candidate_profiles;
CREATE TRIGGER guard_candidate_profile
  BEFORE INSERT OR UPDATE ON public.candidate_profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_candidate_profile();

-- ── employer_profiles ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.guard_employer_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_privileged_writer() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.tier := 'basic';
  ELSE
    NEW.user_id := OLD.user_id;
    NEW.tier := OLD.tier;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_employer_profile ON public.employer_profiles;
CREATE TRIGGER guard_employer_profile
  BEFORE INSERT OR UPDATE ON public.employer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_employer_profile();

-- ── roles ───────────────────────────────────────────────────────────
-- Employers can save drafts, submit for review and close their own roles.
-- Only HHT can make a role live or set its listing tier / payment / expiry.
CREATE OR REPLACE FUNCTION public.guard_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_privileged_writer() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.status IS NULL OR NEW.status NOT IN ('draft', 'pending_review') THEN
      NEW.status := 'pending_review';
    END IF;
    NEW.listing_tier := 'standard';
    NEW.stripe_payment_id := NULL;
    NEW.expires_at := NULL;
    NEW.brief_generated_at := NULL;
    RETURN NEW;
  END IF;

  NEW.employer_id := OLD.employer_id;
  NEW.listing_tier := OLD.listing_tier;
  NEW.stripe_payment_id := OLD.stripe_payment_id;
  NEW.expires_at := OLD.expires_at;
  IF NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status NOT IN ('draft', 'pending_review', 'closed') THEN
    NEW.status := OLD.status;
  END IF;
  -- Editing a live role sends it back for review so HHT sees the new wording.
  IF OLD.status = 'active' AND NEW.status = 'active'
     AND (NEW.title IS DISTINCT FROM OLD.title OR NEW.description IS DISTINCT FROM OLD.description) THEN
    NEW.status := 'pending_review';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_role ON public.roles;
CREATE TRIGGER guard_role
  BEFORE INSERT OR UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.guard_role();

-- ── AI usage ledger ─────────────────────────────────────────────────
-- Server-only record of AI generations, used for daily rate limits. No RLS
-- policies, so only the service role can read or write it.
CREATE TABLE IF NOT EXISTS public.ai_usage (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ai_usage_user_created_idx ON public.ai_usage (user_id, created_at DESC);
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
