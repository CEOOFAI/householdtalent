-- GDPR consent tracking on profiles.
-- gdpr_consent_at: when the user accepted T&Cs + Privacy Policy (required to sign up).
-- marketing_consent / _at: optional opt-in for marketing emails (default off).

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gdpr_consent_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marketing_consent_at TIMESTAMPTZ;

-- Lightweight contact-form lead capture for non-account submissions
CREATE TABLE IF NOT EXISTS contact_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT,
  gdpr_consent_at TIMESTAMPTZ NOT NULL,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent_at TIMESTAMPTZ,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert contact leads" ON contact_leads;
CREATE POLICY "Public can insert contact leads"
  ON contact_leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can read contact leads" ON contact_leads;
CREATE POLICY "Admin can read contact leads"
  ON contact_leads FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
