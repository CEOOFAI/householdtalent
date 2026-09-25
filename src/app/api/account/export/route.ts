import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Returns a JSON dump of every row we hold on the signed-in user plus signed
// download URLs for any uploaded files (photo, CV). Right to data portability
// (GDPR Art. 20).
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  const admin = createAdminClient()

  const [{ data: candidateProfile }, { data: employerProfile }] = await Promise.all([
    admin.from('candidate_profiles').select('*').eq('user_id', user.id).maybeSingle(),
    admin.from('employer_profiles').select('*').eq('user_id', user.id).maybeSingle(),
  ])
  const candidateId = candidateProfile?.id ?? null
  const employerId = employerProfile?.id ?? null
  const none = Promise.resolve({ data: [] as unknown[] })

  const [
    { data: profile },
    { data: introsAsCandidate },
    { data: introsAsEmployer },
    { data: experience },
    { data: certifications },
    { data: references },
    { data: roles },
    { data: notifications },
    { data: subscriptions },
    { data: photoObjs },
    { data: cvObjs },
    { data: docObjs },
    { data: policeObjs },
  ] = await Promise.all([
    admin.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    candidateId ? admin.from('contact_requests').select('id, role_id, message, status, candidate_consent, created_at, introduced_at').eq('candidate_id', candidateId) : none,
    employerId ? admin.from('contact_requests').select('id, role_id, candidate_id, message, status, created_at, introduced_at').eq('employer_id', employerId) : none,
    candidateId ? admin.from('experience_entries').select('*').eq('candidate_id', candidateId) : none,
    candidateId ? admin.from('certifications').select('*').eq('candidate_id', candidateId) : none,
    candidateId ? admin.from('references').select('*').eq('candidate_id', candidateId) : none,
    employerId ? admin.from('roles').select('*').eq('employer_id', employerId) : none,
    admin.from('notifications').select('*').eq('user_id', user.id),
    admin.from('subscriptions').select('*').eq('user_id', user.id),
    admin.storage.from('candidate-photos').list(user.id),
    admin.storage.from('resumes').list(user.id),
    admin.storage.from('candidate-documents').list(user.id),
    admin.storage.from('police-checks').list(user.id),
  ])

  // Generate signed URLs (1 hour) for the user's own files
  async function signed(bucket: string, list: { name: string }[] | null) {
    if (!list || list.length === 0) return []
    const paths = list.map((o) => `${user!.id}/${o.name}`)
    const { data } = await admin.storage.from(bucket).createSignedUrls(paths, 3600)
    return (data || []).map((d) => ({ name: d.path, url: d.signedUrl }))
  }

  const [photoUrls, cvUrls, docUrls, policeUrls] = await Promise.all([
    signed('candidate-photos', photoObjs),
    signed('resumes', cvObjs),
    signed('candidate-documents', docObjs),
    signed('police-checks', policeObjs),
  ])

  const dump = {
    exportedAt: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
    },
    profile,
    candidateProfile,
    employerProfile,
    introductions: {
      asCandidate: introsAsCandidate || [],
      asEmployer: introsAsEmployer || [],
    },
    experience: experience || [],
    certifications: certifications || [],
    references: references || [],
    roles: roles || [],
    notifications: notifications || [],
    subscriptions: subscriptions || [],
    files: {
      photos: photoUrls,
      cvs: cvUrls,
      documents: docUrls,
      policeChecks: policeUrls,
    },
    note: 'Signed file URLs expire one hour after this export was generated.',
  }

  const body = JSON.stringify(dump, null, 2)
  const filename = `householdtalent-data-${user.id}-${new Date()
    .toISOString()
    .slice(0, 10)}.json`

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
