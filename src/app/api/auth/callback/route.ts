import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const role = searchParams.get('role') // 'candidate' or 'employer'
  const next = searchParams.get('next') ?? '/dashboard'

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
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!existingProfile && role) {
          // New OAuth user - create profile + role-specific profile
          const meta = user.user_metadata
          const firstName = meta?.full_name?.split(' ')[0] || meta?.name?.split(' ')[0] || ''
          const lastName = meta?.full_name?.split(' ').slice(1).join(' ') || meta?.name?.split(' ').slice(1).join(' ') || ''

          // Create main profile
          await supabase.from('profiles').insert({
            id: user.id,
            role: role,
            first_name: firstName,
            last_name: lastName,
            email: user.email || '',
            avatar_url: meta?.avatar_url || meta?.picture || null,
            email_verified: true,
          })

          // Create role-specific profile
          if (role === 'candidate') {
            const slug = `${firstName}-${lastName}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '-')
            await supabase.from('candidate_profiles').insert({
              user_id: user.id,
              slug,
              tier: 'free',
              status: 'draft',
            })
          } else if (role === 'employer') {
            await supabase.from('employer_profiles').insert({
              user_id: user.id,
              tier: 'standard',
            })
          }

          // Redirect to the right dashboard
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
