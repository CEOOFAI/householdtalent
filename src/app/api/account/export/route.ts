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

  const [
    { data: profile },
    { data: candidateProfile },
    { data: employerProfile },
    { data: introsAsCandidate },
    { data: introsAsEmployer },
    { data: notifications },
    { data: subscriptions },
    { data: photoObjs },
    { data: cvObjs },
  ] = await Promise.all([
    admin.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    admin.from('candidate_profiles').select('*').eq('user_id', user.id).maybeSingle(),
    admin.from('employer_profiles').select('*').eq('user_id', user.id).maybeSingle(),
    admin.from('contact_requests').select('*').eq('candidate_id', user.id),
    admin.from('contact_requests').select('*').eq('employer_id', user.id),
    admin.from('notifications').select('*').eq('user_id', user.id),
    admin.from('subscriptions').select('*').eq('user_id', user.id),
    admin.storage.from('candidate-photos').list(user.id),
    admin.storage.from('resumes').list(user.id),
  ])

  // Generate signed URLs (1 hour) for the user's own files
  async function signed(bucket: string, list: { name: string }[] | null) {
    if (!list || list.length === 0) return []
    const paths = list.map((o) => `${user!.id}/${o.name}`)
    const { data } = await admin.storage.from(bucket).createSignedUrls(paths, 3600)
    return (data || []).map((d) => ({ name: d.path, url: d.signedUrl }))
  }

  const [photoUrls, cvUrls] = await Promise.all([
    signed('candidate-photos', photoObjs),
    signed('resumes', cvObjs),
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
    notifications: notifications || [],
    subscriptions: subscriptions || [],
    files: {
      photos: photoUrls,
      cvs: cvUrls,
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
