import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/admin/candidate-verification
// Body: { candidate_id, reference_status, verification_notes, gold_verified }
// Admin-only. Updates reference verification fields on a candidate profile.
// Gold Verified requires reference_status = 'verified' AND a police_check_url present.
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

  const body = (await req.json()) as {
    candidate_id?: string
    reference_status?: 'pending' | 'in_progress' | 'verified'
    verification_notes?: string | null
    gold_verified?: boolean
  }

  if (!body.candidate_id) {
    return NextResponse.json({ error: 'candidate_id required' }, { status: 400 })
  }

  const VALID_REF_STATUS = ['pending', 'in_progress', 'verified']
  if (body.reference_status && !VALID_REF_STATUS.includes(body.reference_status)) {
    return NextResponse.json({ error: 'invalid reference_status' }, { status: 400 })
  }

  // Enforce gold-verified prerequisites server-side
  if (body.gold_verified) {
    const { data: current } = await admin
      .from('candidate_profiles')
      .select('police_check_url')
      .eq('id', body.candidate_id)
      .single()

    if (!current?.police_check_url) {
      return NextResponse.json(
        { error: 'Cannot set Gold Verified: candidate has no police check uploaded' },
        { status: 400 },
      )
    }
    if (body.reference_status !== 'verified') {
      return NextResponse.json(
        { error: 'Cannot set Gold Verified: reference status must be Verified first' },
        { status: 400 },
      )
    }
  }

  const update: Record<string, unknown> = {}
  if (body.reference_status !== undefined) update.reference_status = body.reference_status
  if (body.verification_notes !== undefined) {
    update.verification_notes = body.verification_notes?.trim() || null
  }
  if (body.gold_verified !== undefined) {
    update.gold_verified = body.gold_verified
    update.gold_verified_at = body.gold_verified ? new Date().toISOString() : null
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: true, updated: 0 })
  }

  const { error } = await admin
    .from('candidate_profiles')
    .update(update)
    .eq('id', body.candidate_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
