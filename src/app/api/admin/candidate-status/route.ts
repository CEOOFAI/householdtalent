import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  mapStatusToEmail,
  sendCandidateStatusEmail,
} from '@/lib/candidate-status-emails'

// POST /api/admin/candidate-status
// Body: { candidate_id: string, status: 'active' | 'waitlisted' | 'suspended' | 'draft' | 'pending_review' }
// - Verifies caller is admin
// - Updates candidate status via service-role
// - Fires the matching Accepted / Waitlisted / Declined email
// - Returns { ok, email_sent }
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { candidate_id, status } = (await req.json()) as {
    candidate_id?: string
    status?: string
  }
  if (!candidate_id || !status) {
    return NextResponse.json(
      { error: 'candidate_id and status required' },
      { status: 400 },
    )
  }

  const VALID = ['active', 'waitlisted', 'suspended', 'draft', 'pending_review']
  if (!VALID.includes(status)) {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 })
  }

  // Update status
  const { error: updateError } = await admin
    .from('candidate_profiles')
    .update({ status })
    .eq('id', candidate_id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Pull contact details for the email
  const { data: candidate } = await admin
    .from('candidate_profiles')
    .select('id, user_id, profiles:user_id(first_name, email)')
    .eq('id', candidate_id)
    .single()

  type ProfileRow = { first_name: string | null; email: string | null }
  const profileRow = Array.isArray(candidate?.profiles)
    ? (candidate?.profiles[0] as ProfileRow | undefined)
    : (candidate?.profiles as ProfileRow | undefined)

  let emailSent = false
  const emailKind = mapStatusToEmail(status)

  if (emailKind && profileRow?.email) {
    const result = await sendCandidateStatusEmail({
      to: profileRow.email,
      firstName: profileRow.first_name,
      status: emailKind,
    })
    emailSent = result.sent
  }

  return NextResponse.json({ ok: true, email_sent: emailSent })
}
