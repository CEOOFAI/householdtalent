-- SECURITY FIX: stop users from granting themselves the admin role.
--
-- Before this migration there were three ways to become admin:
--   1. Sign up with user_metadata.role = 'admin' (handle_new_user_profile cast it
--      straight into profiles.role).
--   2. PATCH your own profiles row ("Users can update own profile" has no column
--      restriction), e.g. { "role": "admin" }.
--   3. INSERT your own profiles row with role 'admin' (OAuth callback path).
--
-- Fix: signup only accepts 'candidate' or 'employer', and a trigger on profiles
-- blocks any role change or admin insert unless it comes from the service role,
-- a direct database session, or an existing admin.

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  requested_role text := NEW.raw_user_meta_data->>'role';
  safe_role user_role := CASE WHEN requested_role = 'employer' THEN 'employer'::user_role
                              ELSE 'candidate'::user_role END;
BEGIN
  INSERT INTO profiles (id, role, first_name, last_name, email)
  VALUES (
    NEW.id,
    safe_role,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email
  );

  IF safe_role = 'employer' THEN
    INSERT INTO employer_profiles (user_id, company_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'company_name');
  ELSE
    INSERT INTO candidate_profiles (user_id, slug)
    VALUES (
      NEW.id,
      LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'first_name', '') || '-' || COALESCE(NEW.raw_user_meta_data->>'last_name', '') || '-' || SUBSTR(NEW.id::text, 1, 8), ' ', '-'))
    );
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.guard_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  privileged boolean := COALESCE(auth.role(), '') = 'service_role'
                        OR auth.uid() IS NULL
                        OR public.is_admin();
BEGIN
  IF privileged THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' AND NEW.role = 'admin' THEN
    RAISE EXCEPTION 'Not allowed to create an admin profile' USING ERRCODE = '42501';
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Not allowed to change profile role' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS guard_profile_role ON public.profiles;
CREATE TRIGGER guard_profile_role
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_role();
