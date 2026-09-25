-- HouseHoldTalent V2 Schema Changes
-- AI Role Brief, AI CV Builder, Introduction Flow, Annualised Salaries

-- ============================================================
-- 1. Candidate profile: AI CV fields + rate limiting
-- ============================================================
ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS generated_cv JSONB,
  ADD COLUMN IF NOT EXISTS cv_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ai_generations_today INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_generations_reset_at TIMESTAMPTZ DEFAULT now();

-- ============================================================
-- 2. Roles table: replace role_brief TEXT with generated_brief JSONB
-- ============================================================
UPDATE roles SET role_brief = NULL WHERE role_brief IS NOT NULL;

ALTER TABLE roles DROP COLUMN IF EXISTS role_brief;

ALTER TABLE roles
  ADD COLUMN IF NOT EXISTS generated_brief JSONB,
  ADD COLUMN IF NOT EXISTS brief_generated_at TIMESTAMPTZ;

-- ============================================================
-- 3. Contact requests -> Introduction requests
-- ============================================================
ALTER TABLE contact_requests
  ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS introduced_at TIMESTAMPTZ;

UPDATE contact_requests SET status = 'pending' WHERE status = 'accepted';

ALTER TYPE contact_request_status RENAME TO contact_request_status_old;
CREATE TYPE contact_request_status AS ENUM ('pending', 'approved', 'introduced', 'declined');
ALTER TABLE contact_requests
  ALTER COLUMN status TYPE contact_request_status
  USING status::text::contact_request_status;
DROP TYPE contact_request_status_old;

ALTER TABLE contact_requests
  DROP CONSTRAINT IF EXISTS contact_requests_employer_id_candidate_id_key;

ALTER TABLE contact_requests
  ADD CONSTRAINT contact_requests_employer_candidate_role_unique
  UNIQUE (employer_id, candidate_id, role_id);

CREATE INDEX IF NOT EXISTS idx_contact_requests_role_id ON contact_requests(role_id);

-- ============================================================
-- 4. Make message column nullable
-- ============================================================
ALTER TABLE contact_requests ALTER COLUMN message DROP NOT NULL;

-- ============================================================
-- 5. Salary fields: monthly -> annual conversion
-- ============================================================
UPDATE candidate_profiles
  SET salary_expectation_min = salary_expectation_min * 12
  WHERE salary_expectation_min IS NOT NULL;

UPDATE candidate_profiles
  SET salary_expectation_max = salary_expectation_max * 12
  WHERE salary_expectation_max IS NOT NULL;

ALTER TABLE candidate_profiles
  ADD CONSTRAINT chk_candidate_salary_min CHECK (salary_expectation_min IS NULL OR (salary_expectation_min >= 10000 AND salary_expectation_min <= 500000)),
  ADD CONSTRAINT chk_candidate_salary_max CHECK (salary_expectation_max IS NULL OR (salary_expectation_max >= 10000 AND salary_expectation_max <= 500000));

ALTER TABLE roles
  ADD CONSTRAINT chk_role_salary_min CHECK (salary_min IS NULL OR (salary_min >= 10000 AND salary_min <= 500000)),
  ADD CONSTRAINT chk_role_salary_max CHECK (salary_max IS NULL OR (salary_max >= 10000 AND salary_max <= 500000));

-- ============================================================
-- 6. Drop role_applications + shortlists tables
-- ============================================================
DROP POLICY IF EXISTS "Candidates can apply" ON role_applications;
DROP POLICY IF EXISTS "Candidates can read own applications" ON role_applications;
DROP POLICY IF EXISTS "Employer can read applications for their roles" ON role_applications;
DROP POLICY IF EXISTS "Employer can update application status" ON role_applications;
DROP POLICY IF EXISTS "Candidates can withdraw own application" ON role_applications;
DROP POLICY IF EXISTS "Employer can manage own shortlists" ON shortlists;
DROP POLICY IF EXISTS "Candidate can see if shortlisted" ON shortlists;

DROP TABLE IF EXISTS role_applications CASCADE;
DROP TABLE IF EXISTS shortlists CASCADE;
DROP TYPE IF EXISTS application_status;

ALTER TABLE employer_profiles DROP COLUMN IF EXISTS contacts_remaining;
ALTER TABLE employer_profiles DROP COLUMN IF EXISTS contacts_reset_at;

-- ============================================================
-- 7. RLS policy updates
-- ============================================================
DROP POLICY IF EXISTS "Candidate can update contact request status" ON contact_requests;

CREATE POLICY "Admin can update introduction requests"
  ON contact_requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "Candidate can read own contact requests" ON contact_requests;

CREATE POLICY "Candidates can read own introduction requests"
  ON contact_requests FOR SELECT
  USING (candidate_id IN (
    SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Employer can create contact request" ON contact_requests;

CREATE POLICY "Employers can create introduction requests"
  ON contact_requests FOR INSERT
  WITH CHECK (employer_id IN (
    SELECT id FROM employer_profiles WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Employer can read own contact requests" ON contact_requests;

CREATE POLICY "Employers can read own introduction requests"
  ON contact_requests FOR SELECT
  USING (employer_id IN (
    SELECT id FROM employer_profiles WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Public can read active roles" ON roles;

CREATE POLICY "Active candidates can view active roles"
  ON roles FOR SELECT
  USING (
    status = 'active'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'candidate' OR profiles.role = 'admin')
    )
  );

DROP POLICY IF EXISTS "Owner can read own roles" ON roles;

CREATE POLICY "Employers can view own roles"
  ON roles FOR SELECT
  USING (employer_id IN (
    SELECT id FROM employer_profiles WHERE user_id = auth.uid()
  ));
