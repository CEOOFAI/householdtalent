-- HouseHoldTalent MVP Schema
-- Two-sided marketplace: candidates (domestic staff) <-> employers (HNWI households)

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('candidate', 'employer', 'admin');
CREATE TYPE candidate_tier AS ENUM ('free', 'recommended', 'complete');
CREATE TYPE employer_tier AS ENUM ('basic', 'priority', 'ultra');
CREATE TYPE candidate_status AS ENUM ('draft', 'pending_review', 'active', 'suspended');
CREATE TYPE availability_status AS ENUM ('immediate', '1_month', '3_months', 'not_available');
CREATE TYPE property_type AS ENUM ('villa', 'apartment', 'estate', 'yacht', 'other');
CREATE TYPE contact_request_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'expired');
CREATE TYPE location_enum AS ENUM (
  'gibraltar', 'marbella', 'estepona', 'sotogrande', 'san_roque',
  'la_linea', 'manilva', 'casares', 'benahavis', 'fuengirola', 'mijas', 'other'
);
CREATE TYPE location_region AS ENUM ('gibraltar', 'costa_del_sol_west', 'costa_del_sol_east');

-- ============================================================
-- TABLES
-- ============================================================

-- Core user profile (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Candidate profiles
CREATE TABLE candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  headline TEXT,
  bio TEXT,
  experience_years INTEGER,
  roles TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  location location_enum,
  location_region location_region,
  availability availability_status,
  salary_expectation_min INTEGER, -- monthly GBP
  salary_expectation_max INTEGER, -- monthly GBP
  references_verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  status candidate_status DEFAULT 'draft',
  tier candidate_tier DEFAULT 'free',
  cv_url TEXT,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Employer profiles
CREATE TABLE employer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  property_type property_type,
  location location_enum,
  location_region location_region,
  staff_count INTEGER,
  bio TEXT,
  tier employer_tier DEFAULT 'basic',
  contacts_remaining INTEGER DEFAULT 5,
  contacts_reset_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contact requests from employers to candidates
CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status contact_request_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(employer_id, candidate_id)
);

-- Subscription tracking
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  tier TEXT NOT NULL,
  status subscription_status DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Saved/shortlisted candidates
CREATE TABLE saved_candidates (
  employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (employer_id, candidate_id)
);

-- Work experience entries
CREATE TABLE experience_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  employer_name TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  current BOOLEAN DEFAULT false
);

-- References
CREATE TABLE references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ
);

-- Certifications
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT,
  date_obtained DATE,
  expiry_date DATE,
  document_url TEXT,
  verified BOOLEAN DEFAULT false
);

-- Profile views tracking
CREATE TABLE profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- In-app notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blog posts (table only, no routes in MVP)
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  author TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Candidate search indexes
CREATE INDEX idx_candidate_status ON candidate_profiles (status);
CREATE INDEX idx_candidate_tier ON candidate_profiles (tier);
CREATE INDEX idx_candidate_location ON candidate_profiles (location);
CREATE INDEX idx_candidate_location_region ON candidate_profiles (location_region);
CREATE INDEX idx_candidate_availability ON candidate_profiles (availability);
CREATE INDEX idx_candidate_experience ON candidate_profiles (experience_years);
CREATE INDEX idx_candidate_featured ON candidate_profiles (featured) WHERE featured = true;
CREATE INDEX idx_candidate_slug ON candidate_profiles (slug);
CREATE INDEX idx_candidate_roles ON candidate_profiles USING GIN (roles);
CREATE INDEX idx_candidate_skills ON candidate_profiles USING GIN (skills);
CREATE INDEX idx_candidate_languages ON candidate_profiles USING GIN (languages);

-- Employer indexes
CREATE INDEX idx_employer_location ON employer_profiles (location);
CREATE INDEX idx_employer_tier ON employer_profiles (tier);

-- Contact request indexes
CREATE INDEX idx_contact_employer ON contact_requests (employer_id);
CREATE INDEX idx_contact_candidate ON contact_requests (candidate_id);
CREATE INDEX idx_contact_status ON contact_requests (status);

-- Profile views indexes
CREATE INDEX idx_profile_views_candidate ON profile_views (candidate_id);
CREATE INDEX idx_profile_views_date ON profile_views (viewed_at);

-- Notification indexes
CREATE INDEX idx_notifications_user ON notifications (user_id);
CREATE INDEX idx_notifications_unread ON notifications (user_id) WHERE is_read = false;

-- Related data indexes
CREATE INDEX idx_experience_candidate ON experience_entries (candidate_id);
CREATE INDEX idx_references_candidate ON references (candidate_id);
CREATE INDEX idx_certifications_candidate ON certifications (candidate_id);

-- Subscription indexes
CREATE INDEX idx_subscriptions_user ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions (stripe_subscription_id);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_candidate_profiles_updated_at
  BEFORE UPDATE ON candidate_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_employer_profiles_updated_at
  BEFORE UPDATE ON employer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile on signup"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- candidate_profiles
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active candidates"
  ON candidate_profiles FOR SELECT USING (status = 'active');

CREATE POLICY "Owner can read own candidate profile"
  ON candidate_profiles FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Owner can update own candidate profile"
  ON candidate_profiles FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Owner can insert own candidate profile"
  ON candidate_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can read all candidate profiles"
  ON candidate_profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update all candidate profiles"
  ON candidate_profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- employer_profiles
ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can read own employer profile"
  ON employer_profiles FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Owner can update own employer profile"
  ON employer_profiles FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Owner can insert own employer profile"
  ON employer_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can read all employer profiles"
  ON employer_profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- contact_requests
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employer can create contact request"
  ON contact_requests FOR INSERT WITH CHECK (
    employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Employer can read own contact requests"
  ON contact_requests FOR SELECT USING (
    employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Candidate can read own contact requests"
  ON contact_requests FOR SELECT USING (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Candidate can update contact request status"
  ON contact_requests FOR UPDATE USING (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin can read all contact requests"
  ON contact_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- saved_candidates
ALTER TABLE saved_candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employer can manage own saved candidates"
  ON saved_candidates FOR ALL USING (
    employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid())
  );

-- experience_entries
ALTER TABLE experience_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read experience of active candidates"
  ON experience_entries FOR SELECT USING (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE status = 'active')
  );

CREATE POLICY "Owner can manage own experience"
  ON experience_entries FOR ALL USING (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid())
  );

-- references (admin only for reading, owner for managing)
ALTER TABLE references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage own references"
  ON references FOR ALL USING (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin can read all references"
  ON references FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- certifications
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read certifications of active candidates"
  ON certifications FOR SELECT USING (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE status = 'active')
  );

CREATE POLICY "Owner can manage own certifications"
  ON certifications FOR ALL USING (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid())
  );

-- profile_views
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert profile views"
  ON profile_views FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Candidate can read own profile views"
  ON profile_views FOR SELECT USING (
    candidate_id IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid())
  );

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read own notifications"
  ON notifications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "User can update own notifications"
  ON notifications FOR UPDATE USING (user_id = auth.uid());

-- subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read own subscriptions"
  ON subscriptions FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can read all subscriptions"
  ON subscriptions FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- blog_posts (public read for published)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT USING (published = true);

CREATE POLICY "Admin can manage blog posts"
  ON blog_posts FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('candidate-photos', 'candidate-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('candidate-documents', 'candidate-documents', false);

-- Storage policies
CREATE POLICY "Candidates can upload own photos"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'candidate-photos' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Anyone can view candidate photos"
  ON storage.objects FOR SELECT USING (bucket_id = 'candidate-photos');

CREATE POLICY "Candidates can upload own documents"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'candidate-documents' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Candidates can read own documents"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'candidate-documents' AND auth.uid()::text = (storage.foldername(name))[1]
  );
