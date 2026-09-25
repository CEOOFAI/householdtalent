-- Introductions: two-way consent + private admin notes.
--
-- 1. Candidate-initiated introductions previously went: candidate expresses
--    interest -> admin approves -> the *candidate* "consents" -> introduced,
--    so the employer never agreed. Now each request records who started it,
--    and the OTHER party is asked to confirm after HHT approves:
--      employer-initiated:  admin approves -> candidate confirms -> introduced
--      candidate-initiated: admin approves -> employer confirms  -> introduced
-- 2. admin_notes ("Internal notes") were readable by the candidate and employer
--    over the REST API. Column privileges now hide it from signed-in users;
--    the admin screens read it with the service role.
-- 3. Requests HHT declined (declined_by = 'admin') are hidden from the
--    candidate, and each party only sees a request once it is relevant to them.
-- 4. Candidate photo / CV columns stored non-working public URLs for private
--    buckets; convert them to object paths (views use signed URLs).
--
-- Apply at go-live together with the matching code.

ALTER TABLE public.contact_requests
  ADD COLUMN IF NOT EXISTS initiated_by text NOT NULL DEFAULT 'employer'
    CHECK (initiated_by IN ('employer', 'candidate')),
  ADD COLUMN IF NOT EXISTS employer_consent text
    CHECK (employer_consent IN ('pending', 'accepted', 'declined')),
  ADD COLUMN IF NOT EXISTS employer_consent_at timestamptz;

ALTER TABLE public.contact_requests DROP CONSTRAINT IF EXISTS contact_requests_declined_by_check;
ALTER TABLE public.contact_requests
  ADD CONSTRAINT contact_requests_declined_by_check
  CHECK (declined_by IS NULL OR declined_by IN ('admin', 'candidate', 'employer'));

-- ── hide admin_notes from signed-in users ───────────────────────────
REVOKE SELECT ON public.contact_requests FROM authenticated, anon;
GRANT SELECT (
  id, employer_id, candidate_id, role_id, message, status, created_at,
  introduced_at, candidate_consent, candidate_consent_at, admin_approved_at,
  declined_by, initiated_by, employer_consent, employer_consent_at
) ON public.contact_requests TO authenticated;

-- ── who sees what ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "Candidates can read own introduction requests" ON public.contact_requests;
CREATE POLICY "Candidates can read own introduction requests" ON public.contact_requests
  FOR SELECT USING (
    candidate_id IN (SELECT id FROM public.candidate_profiles WHERE user_id = auth.uid())
    AND (
      initiated_by = 'candidate'
      OR status IN ('approved', 'introduced')
      OR (status = 'declined' AND declined_by = 'candidate')
    )
    AND NOT (status = 'declined' AND declined_by = 'admin' AND initiated_by = 'employer')
  );

DROP POLICY IF EXISTS "Employers can read own introduction requests" ON public.contact_requests;
CREATE POLICY "Employers can read own introduction requests" ON public.contact_requests
  FOR SELECT USING (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    AND (
      initiated_by = 'employer'
      OR status IN ('approved', 'introduced')
      OR (status = 'declined' AND declined_by = 'employer')
    )
  );

-- ── photo / CV values -> storage paths ──────────────────────────────
UPDATE public.candidate_profiles
SET photos = ARRAY(
  SELECT regexp_replace(p, '^https?://[^/]+/storage/v1/object/(public|sign|authenticated)/candidate-photos/([^?]+).*$', '\2')
  FROM unnest(photos) AS p
)
WHERE photos IS NOT NULL
  AND EXISTS (SELECT 1 FROM unnest(photos) p WHERE p ~ '/storage/v1/object/(public|sign|authenticated)/candidate-photos/');

UPDATE public.candidate_profiles
SET cv_url = regexp_replace(cv_url, '^https?://[^/]+/storage/v1/object/(public|sign|authenticated)/resumes/([^?]+).*$', '\2')
WHERE cv_url ~ '/storage/v1/object/(public|sign|authenticated)/resumes/';
