-- Fix remaining recursive admin policies on roles table
DROP POLICY IF EXISTS "Admin can read all roles" ON roles;
DROP POLICY IF EXISTS "Admin can update all roles" ON roles;
CREATE POLICY "Admin can read all roles" ON roles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin can update all roles" ON roles FOR UPDATE USING (public.is_admin());

-- Fix "Active candidates can view active roles" - was querying profiles directly
DROP POLICY IF EXISTS "Active candidates can view active roles" ON roles;
CREATE POLICY "Active candidates can view active roles"
  ON roles FOR SELECT USING (
    status = 'active' AND (
      public.is_admin() OR
      EXISTS (SELECT 1 FROM candidate_profiles WHERE user_id = auth.uid())
    )
  );

-- Check ALL tables for remaining recursive policies that query profiles directly
-- and replace them with is_admin() function

-- experience_entries
DROP POLICY IF EXISTS "Admin can manage experience" ON experience_entries;

-- certifications
DROP POLICY IF EXISTS "Admin can manage certifications" ON certifications;

-- notifications
DROP POLICY IF EXISTS "Admin can manage notifications" ON notifications;
