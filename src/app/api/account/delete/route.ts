import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Deletes the currently authenticated user's account and all related data.
// Right to erasure (GDPR Art. 17).
//
// Order matters: storage objects → child tables → auth user (cascade handles
// the rest via ON DELETE CASCADE).
export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  const admin = createAdminClient()

  try {
    // 1. Wipe storage objects: candidate photos + CV files
    //    Bucket convention is <bucket>/<userId>/<filename>
    const { data: photoObjs } = await admin.storage
      .from('candidate-photos')
      .list(user.id)
    if (photoObjs && photoObjs.length > 0) {
      await admin.storage
        .from('candidate-photos')
        .remove(photoObjs.map((o) => `${user.id}/${o.name}`))
    }

    const { data: cvObjs } = await admin.storage.from('resumes').list(user.id)
    if (cvObjs && cvObjs.length > 0) {
      await admin.storage
        .from('resumes')
        .remove(cvObjs.map((o) => `${user.id}/${o.name}`))
    }

    const { data: docObjs } = await admin.storage
      .from('candidate-documents')
      .list(user.id)
    if (docObjs && docObjs.length > 0) {
      await admin.storage
        .from('candidate-documents')
        .remove(docObjs.map((o) => `${user.id}/${o.name}`))
    }

    // 2. Delete the auth user. Profiles + candidate_profiles + employer_profiles
    //    and downstream rows are wired with ON DELETE CASCADE via FK on
    //    auth.users(id), so this removes everything in one shot.
    const { error: deleteErr } = await admin.auth.admin.deleteUser(user.id)
    if (deleteErr) {
      console.error('account delete failed')
      return NextResponse.json(
        { error: 'Could not delete account. Please contact support.' },
        { status: 500 },
      )
    }

    // 3. Sign out the client session
    await supabase.auth.signOut()

    return NextResponse.json({ ok: true })
  } catch {
    console.error('account delete error')
    return NextResponse.json(
      { error: 'Unexpected error. Please contact support.' },
      { status: 500 },
    )
  }
}
