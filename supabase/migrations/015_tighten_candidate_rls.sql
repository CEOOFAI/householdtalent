-- SECURITY FIX: tighten candidate_profiles read policy.
--
-- The original "Public can read active candidates" policy let ANY anon visitor
-- read every column on every active candidate (including full_name, email,
-- phone, nationality, salary expectations, bio with personal context, previous
-- roles with employer names) via the PostgREST endpoint using the public anon
-- key shipped in the JS bundle. The site's "anonymised" public view was a UI
-- veneer only.
--
-- New policy: only authenticated users (signed-in candidates / employers /
-- admins) can read active candidates. Public unauthenticated pages already
-- proxy through the server using the service role key with column filtering,
-- so the change is invisible to end users.

DROP POLICY IF EXISTS "Public can read active candidates" ON candidate_profiles;

CREATE POLICY "Authenticated can read active candidates"
  ON candidate_profiles FOR SELECT
  USING (
    status = 'active'
    AND auth.uid() IS NOT NULL
  );

-- Same hardening for downstream tables that key off candidate_profiles
DROP POLICY IF EXISTS "Public can read experience of active candidates" ON experience_entries;
CREATE POLICY "Authenticated can read experience of active candidates"
  ON experience_entries FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND candidate_id IN (SELECT id FROM candidate_profiles WHERE status = 'active')
  );

DROP POLICY IF EXISTS "Public can read certifications of active candidates" ON certifications;
CREATE POLICY "Authenticated can read certifications of active candidates"
  ON certifications FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND candidate_id IN (SELECT id FROM candidate_profiles WHERE status = 'active')
  );
