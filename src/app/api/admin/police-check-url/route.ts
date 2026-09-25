import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/admin/police-check-url?candidate_id=...
// Admin-only. Returns a short-lived signed URL to view the candidate's police
// check file from the private 'police-checks' bucket.
export async function GET(req: NextRequest) {
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

  const candidateId = req.nextUrl.searchParams.get('candidate_id')
  if (!candidateId) {
    return NextResponse.json({ error: 'candidate_id required' }, { status: 400 })
  }

  const { data: candidate } = await admin
    .from('candidate_profiles')
    .select('police_check_url')
    .eq('id', candidateId)
    .single()

  if (!candidate?.police_check_url) {
    return NextResponse.json({ error: 'No police check on file' }, { status: 404 })
  }

  const { data: signed, error } = await admin.storage
    .from('police-checks')
    .createSignedUrl(candidate.police_check_url, 60 * 5)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ url: signed.signedUrl })
}
