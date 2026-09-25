-- Add columns needed by the candidate profile wizard
-- Without these, profile creation fails with "column does not exist" errors

ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS nationality TEXT;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS right_to_work TEXT;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS previous_roles TEXT;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS live_preference TEXT;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS schedule_preference TEXT;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS salary_min INTEGER;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS salary_max INTEGER;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS available_from TEXT;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
