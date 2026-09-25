-- Fix infinite recursion in admin RLS policies
-- The old policies queried the profiles table from within policies ON profiles

-- Step 1: Create a SECURITY DEFINER function (bypasses RLS, no recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Step 2: Drop the recursive policies
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can read all candidate profiles" ON candidate_profiles;
DROP POLICY IF EXISTS "Admin can update all candidate profiles" ON candidate_profiles;
DROP POLICY IF EXISTS "Admin can read all employer profiles" ON employer_profiles;
DROP POLICY IF EXISTS "Admin can read all contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Admin can read all references" ON "references";
DROP POLICY IF EXISTS "Admin can read all subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admin can manage blog posts" ON blog_posts;

-- Step 3: Recreate using the safe function
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can read all candidate profiles"
  ON candidate_profiles FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can update all candidate profiles"
  ON candidate_profiles FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can read all employer profiles"
  ON employer_profiles FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can read all contact requests"
  ON contact_requests FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can read all references"
  ON "references" FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can read all subscriptions"
  ON subscriptions FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can manage blog posts"
  ON blog_posts FOR ALL USING (public.is_admin());
