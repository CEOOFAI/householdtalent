-- Three-step introduction flow per Heinz feedback (2026-04-29):
-- 1. Employer requests intro      → status=pending, candidate_consent=null
-- 2. Admin approves               → status=approved, candidate_consent=pending, candidate notified
-- 3. Candidate accepts/declines   → status=introduced or declined, employer notified
--
-- Admin can also decline at step 2 → status=declined, candidate never sees it.

ALTER TABLE contact_requests
  ADD COLUMN IF NOT EXISTS candidate_consent TEXT
    CHECK (candidate_consent IN ('pending', 'accepted', 'declined'));

ALTER TABLE contact_requests
  ADD COLUMN IF NOT EXISTS candidate_consent_at TIMESTAMPTZ;

ALTER TABLE contact_requests
  ADD COLUMN IF NOT EXISTS admin_approved_at TIMESTAMPTZ;

-- Track who declined for graceful messaging downstream
ALTER TABLE contact_requests
  ADD COLUMN IF NOT EXISTS declined_by TEXT
    CHECK (declined_by IN ('admin', 'candidate'));

CREATE INDEX IF NOT EXISTS idx_contact_requests_candidate_consent
  ON contact_requests(candidate_id, candidate_consent)
  WHERE candidate_consent = 'pending';
