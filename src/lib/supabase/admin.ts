import { createClient } from '@supabase/supabase-js'

// Service role client that bypasses RLS.
// ONLY use in server-side code (API routes / server components).
// NEVER expose this to the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
