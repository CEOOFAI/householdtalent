import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { safeRedirectPath } from '@/lib/utils'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const role = searchParams.get('role') // 'candidate' or 'employer'
  const next = safeRedirectPath(searchParams.get('next'))

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if profile exists - if not, this is a new OAuth user
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // The on_auth_user_created trigger always creates a profile (as a
        // candidate, since OAuth sign-ups carry no role metadata). If this is a
        // brand-new Google sign-up from the employer form, switch it over.
        const admin = createAdminClient()
        const isNewUser = Date.now() - new Date(user.created_at).getTime() < 10 * 60 * 1000
        const meta = user.user_metadata
        const firstName = meta?.full_name?.split(' ')[0] || meta?.name?.split(' ')[0] || ''
        const lastName = meta?.full_name?.split(' ').slice(1).join(' ') || meta?.name?.split(' ').slice(1).join(' ') || ''

        if (isNewUser && (role === 'employer' || role === 'candidate')) {
          const { data: existingProfile } = await admin
            .from('profiles')
            .select('id, role')
            .eq('id', user.id)
            .maybeSingle()

          if (!existingProfile) {
            await admin.from('profiles').insert({
              id: user.id,
              role,
              first_name: firstName,
              last_name: lastName,
              email: user.email || '',
            })
          } else {
            await admin
              .from('profiles')
              .update({ first_name: firstName, last_name: lastName })
              .eq('id', user.id)
          }

          if (role === 'employer' && existingProfile?.role !== 'employer') {
            await admin.from('profiles').update({ role: 'employer' }).eq('id', user.id)
            await admin.from('candidate_profiles').delete().eq('user_id', user.id).eq('status', 'draft')
            const { data: emp } = await admin.from('employer_profiles').select('id').eq('user_id', user.id).maybeSingle()
            if (!emp) await admin.from('employer_profiles').insert({ user_id: user.id })
          } else if (role === 'candidate') {
            const { data: cand } = await admin.from('candidate_profiles').select('id').eq('user_id', user.id).maybeSingle()
            if (!cand) {
              const slug = `${firstName}-${lastName}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '-')
              await admin.from('candidate_profiles').insert({ user_id: user.id, slug, status: 'draft' })
            }
          }

          const dashboardPath = role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate'
          return NextResponse.redirect(`${origin}${dashboardPath}`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth error - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
