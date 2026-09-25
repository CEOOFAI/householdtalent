-- SECURITY FIX: candidate-photos bucket was public, leaking raw un-blurred originals.
-- Public /candidates page now requests short-lived signed URLs server-side.

UPDATE storage.buckets SET public = false WHERE id = 'candidate-photos';

DROP POLICY IF EXISTS "Anyone can view candidate photos" ON storage.objects;

CREATE POLICY "Authenticated can view candidate photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'candidate-photos'
    AND auth.uid() IS NOT NULL
  );
