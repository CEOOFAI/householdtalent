import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listActiveCandidatesForEmployers } from '@/lib/candidates/employer-view'

// GET /api/employer/candidates
// Anonymised candidate cards for the employer search page. Employers and admins only.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'employer' && profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const candidates = await listActiveCandidatesForEmployers()
    return NextResponse.json({ candidates })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Could not load candidates' }, { status: 500 })
  }
}
