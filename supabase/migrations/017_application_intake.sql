-- Application intake (May 2026 brief)
-- 1. Add 'waitlisted' to candidate_status so the admin queue can hold promising but not-yet-ready applicants
-- 2. Add columns to capture the application form intake (role specialism, location text, statement, referral source, applied_at)

ALTER TYPE candidate_status ADD VALUE IF NOT EXISTS 'waitlisted';

ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS application_source TEXT;

ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS location_text TEXT;

ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS personal_statement TEXT;

ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS applied_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_candidate_applied_at ON candidate_profiles (applied_at DESC);
