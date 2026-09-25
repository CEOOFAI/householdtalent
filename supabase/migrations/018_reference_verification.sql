-- Reference verification + Gold Verified tier (Heinz Q6, May 2026)
-- Two-tier verification system:
--   Tier 1 (Verified)      = HHT contacts 2+ references directly
--   Tier 2 (Gold Verified) = Tier 1 + valid police check / DBS uploaded
--
-- Adds reference_status, verification_notes, police_check_url, gold_verified columns
-- + private storage bucket for police-check uploads.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reference_status') THEN
    CREATE TYPE reference_status AS ENUM ('pending', 'in_progress', 'verified');
  END IF;
END$$;

ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS reference_status reference_status NOT NULL DEFAULT 'pending';

ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS verification_notes TEXT;

ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS police_check_url TEXT;

ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS police_check_uploaded_at TIMESTAMPTZ;

ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS gold_verified BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS gold_verified_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_candidate_reference_status
  ON candidate_profiles (reference_status);

CREATE INDEX IF NOT EXISTS idx_candidate_gold_verified
  ON candidate_profiles (gold_verified) WHERE gold_verified = TRUE;

-- Private bucket for police-check / DBS uploads (admins + the owning candidate only)
INSERT INTO storage.buckets (id, name, public)
VALUES ('police-checks', 'police-checks', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Owning candidate can upload, read, replace, delete their own file
DROP POLICY IF EXISTS "Candidates manage own police check" ON storage.objects;
CREATE POLICY "Candidates manage own police check"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'police-checks'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'police-checks'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can read all police checks
DROP POLICY IF EXISTS "Admins read all police checks" ON storage.objects;
CREATE POLICY "Admins read all police checks"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'police-checks'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
