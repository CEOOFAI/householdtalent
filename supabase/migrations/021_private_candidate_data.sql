-- SECURITY FIX: candidate personal data was readable by any signed-in user.
--
-- Before: any logged-in account (including a brand-new, unpaid employer or a
-- candidate) could call the REST API and read every active candidate's full
-- name, email, phone, salary, previous employers and verification notes, plus
-- their raw photos and uploaded CVs.
--
-- After: candidate rows, experience, certifications, photos and CVs are
-- readable only by the candidate themselves and by HHT admins. Employers see
-- anonymised cards through server routes (src/lib/candidates/employer-view.ts)
-- that use the service role and return only safe fields.
--
-- DEPLOY ORDER: apply this migration together with (or right after) deploying
-- the code that ships employer-view.ts. Old code reads candidates directly and
-- its employer search would come back empty once this is applied.

-- ── candidate tables ────────────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated can read active candidates" ON public.candidate_profiles;
DROP POLICY IF EXISTS "Authenticated can read experience of active candidates" ON public.experience_entries;
DROP POLICY IF EXISTS "Authenticated can read certifications of active candidates" ON public.certifications;

-- Admin read access for the child tables (dropped in 006 and never recreated)
DROP POLICY IF EXISTS "Admin can read all experience" ON public.experience_entries;
CREATE POLICY "Admin can read all experience" ON public.experience_entries
  FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "Admin can read all certifications" ON public.certifications;
CREATE POLICY "Admin can read all certifications" ON public.certifications
  FOR SELECT USING (public.is_admin());

-- ── storage: candidate-photos ───────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated can view candidate photos" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can upload own photos" ON storage.objects;

CREATE POLICY "Candidates read own photos, admins read all" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'candidate-photos'
         AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin()));
CREATE POLICY "Candidates upload own photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'candidate-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Candidates update own photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'candidate-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Candidates delete own photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'candidate-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ── storage: resumes (CVs) ──────────────────────────────────────────
DROP POLICY IF EXISTS "Employers can read applicant resumes" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can read own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can upload resumes" ON storage.objects;

CREATE POLICY "Candidates read own CVs, admins read all" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'resumes'
         AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin()));
CREATE POLICY "Candidates upload own CVs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Candidates update own CVs" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ── storage: candidate-documents ────────────────────────────────────
DROP POLICY IF EXISTS "Candidates can upload own documents" ON storage.objects;
CREATE POLICY "Candidates upload own documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'candidate-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
