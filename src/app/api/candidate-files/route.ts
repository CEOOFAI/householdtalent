import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { storagePathFrom } from '@/lib/storage-path'

// GET /api/candidate-files?kind=photo|cv[&candidate_id=...]
// Returns a short-lived signed URL for a candidate's photo or CV.
// Candidates can fetch their own files; admins can fetch any candidate's.
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const kind = req.nextUrl.searchParams.get('kind')
  if (kind !== 'photo' && kind !== 'cv') {
    return NextResponse.json({ error: 'kind must be photo or cv' }, { status: 400 })
  }
  const candidateId = req.nextUrl.searchParams.get('candidate_id')

  const admin = createAdminClient()
  const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = me?.role === 'admin'

  let query = admin.from('candidate_profiles').select('user_id, photos, cv_url')
  if (candidateId) {
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    query = query.eq('id', candidateId)
  } else {
    query = query.eq('user_id', user.id)
  }
  const { data: candidate } = await query.maybeSingle()
  if (!candidate) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const bucket = kind === 'photo' ? 'candidate-photos' : 'resumes'
  const raw = kind === 'photo' ? (candidate.photos ?? [])[0] : candidate.cv_url
  const path = storagePathFrom(raw, bucket)
  // Files must sit in the owner's folder
  if (!path || !path.startsWith(`${candidate.user_id}/`)) {
    return NextResponse.json({ error: 'No file on record' }, { status: 404 })
  }

  const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, 60 * 10)
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'File not available' }, { status: 404 })
  }
  return NextResponse.json({ url: data.signedUrl })
}
