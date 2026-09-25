import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Public-by-design: anyone can request a signed URL because the candidates
// page is unauthenticated and renders the photo behind a CSS blur. The URL is
// short-lived (10 min) and the storage path is unguessable.
export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path')

  if (!path || path.includes('..')) {
    return NextResponse.json({ error: 'invalid path' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin.storage
    .from('candidate-photos')
    .createSignedUrl(path, 600)

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error?.message ?? 'sign failed' }, { status: 404 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
