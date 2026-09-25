import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/notify-employers/new-candidate
// Body: { candidate_id: string }
// Caller must be an admin. Fans out a "new candidate" notification to every
// active employer profile so they know fresh talent is in the network.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { candidate_id } = (await req.json()) as { candidate_id?: string }
  if (!candidate_id) {
    return NextResponse.json({ error: 'candidate_id required' }, { status: 400 })
  }

  // Pull a minimal anonymous summary for the notification body
  const { data: candidate } = await admin
    .from('candidate_profiles')
    .select('id, slug, headline, roles, location_region, experience_years')
    .eq('id', candidate_id)
    .single()

  if (!candidate) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
  }

  const roleLabel =
    candidate.headline ||
    (Array.isArray(candidate.roles) && candidate.roles.length > 0
      ? candidate.roles[0]
      : 'a new candidate')

  const yearsBit = candidate.experience_years
    ? `${candidate.experience_years}+ yrs experience`
    : null
  const regionBit = candidate.location_region || null
  const tail = [yearsBit, regionBit].filter(Boolean).join(', ')

  const body = tail
    ? `${roleLabel} (${tail}) has just joined our network. Browse anonymised profiles and request an introduction.`
    : `${roleLabel} has just joined our network. Browse anonymised profiles and request an introduction.`

  // Fetch every employer user_id
  const { data: employers } = await admin
    .from('employer_profiles')
    .select('user_id')

  const rows = (employers || [])
    .filter((e) => !!e.user_id)
    .map((e) => ({
      user_id: e.user_id,
      type: 'new_candidate',
      title: 'New Candidate Available',
      body,
      action_url: `/dashboard/employer/search?new=${candidate.slug || candidate.id}`,
    }))

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, notified: 0 })
  }

  const { error: insertErr } = await admin.from('notifications').insert(rows)
  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, notified: rows.length })
}
