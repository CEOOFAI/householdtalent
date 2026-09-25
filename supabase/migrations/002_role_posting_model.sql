-- HouseHoldTalent: Role-Posting Model
-- Employers post roles, candidates apply to them

-- ============================================================
-- NEW ENUMS
-- ============================================================

CREATE TYPE position_type AS ENUM ('live_in', 'live_out', 'full_time', 'part_time');
CREATE TYPE experience_preferred AS ENUM ('private_household', 'luxury_hospitality', 'open_to_both');
CREATE TYPE listing_tier AS ENUM ('standard', 'priority', 'ultra');
CREATE TYPE role_status AS ENUM ('draft', 'pending_review', 'active', 'closed', 'expired');
CREATE TYPE application_status AS ENUM ('applied', 'shortlisted', 'rejected', 'withdrawn');

-- ============================================================
-- NEW TABLES
-- ============================================================

-- Roles (employer posts a role listing)
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  role_type TEXT NOT NULL,
  position_type position_type NOT NULL,
  location location_enum NOT NULL,
  location_region location_region NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  experience_preferred experience_preferred DEFAULT 'open_to_both',
  salary_min INTEGER,
  salary_max INTEGER,
  additional_notes TEXT,
  listing_tier listing_tier DEFAULT 'standard',
  status role_status DEFAULT 'draft',
  start_date TEXT DEFAULT 'ASAP',
  role_brief TEXT,
  stripe_payment_id TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Role applications (candidate applies to a role)
CREATE TABLE role_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  cover_message TEXT,
  resume_url TEXT,
  status application_status DEFAULT 'applied',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role_id, candidate_id)
);

-- Shortlists (employer shortlists a candidate for a role)
CREATE TABLE shortlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role_id, candidate_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_roles_employer ON roles (employer_id);
CREATE INDEX idx_roles_status ON roles (status);
CREATE INDEX idx_roles_location ON roles (location);
CREATE INDEX idx_roles_role_type ON roles (role_type);
CREATE INDEX idx_roles_listing_tier ON roles (listing_tier);
CREATE INDEX idx_roles_expires ON roles (expires_at);

CREATE INDEX idx_applications_role ON role_applications (role_id);
CREATE INDEX idx_applications_candidate ON role_applications (candidate_id);
CREATE INDEX idx_applications_status ON role_applications (status);

CREATE INDEX idx_shortlists_role ON shortlists (role_id);
CREATE INDEX idx_shortlists_employer ON shortlists (employer_id);
CREATE INDEX idx_shortlists_candidate ON shortlists (candidate_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- roles
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active roles"
  ON roles FOR SELECT USING (status = 'active');

CREATE POLICY "Owner can read own roles"
  ON roles FOR SELECT USING (
    employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can insert roles"
  ON roles FOR INSERT WITH CHECK (
    employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can update own roles"
  ON roles FOR UPDATE USING (
    employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin can read all roles"
  ON roles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update all roles"
  ON roles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- role_applications
ALTER TABLE role_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can apply"
  ON role_applications FOR INSERT WITH CHECK (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Candidates can read own applications"
  ON role_applications FOR SELECT USING (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Employer can read applications for their roles"
  ON role_applications FOR SELECT USING (
    role_id IN (SELECT id FROM roles WHERE employer_id IN (
      SELECT id FROM employer_profiles WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Employer can update application status"
  ON role_applications FOR UPDATE USING (
    role_id IN (SELECT id FROM roles WHERE employer_id IN (
      SELECT id FROM employer_profiles WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Candidates can withdraw own application"
  ON role_applications FOR UPDATE USING (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid())
  );

-- shortlists
ALTER TABLE shortlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employer can manage own shortlists"
  ON shortlists FOR ALL USING (
    employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Candidate can see if shortlisted"
  ON shortlists FOR SELECT USING (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid())
  );

-- Storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Candidates can upload resumes"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Candidates can read own resumes"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Employers can read applicant resumes"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'resumes' AND auth.uid() IS NOT NULL
  );
