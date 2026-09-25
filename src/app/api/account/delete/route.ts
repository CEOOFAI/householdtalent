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
    // 1. Wipe storage objects in every bucket that holds user files,
    //    including police checks. Bucket convention is <bucket>/<userId>/<filename>
    for (const bucket of ['candidate-photos', 'resumes', 'candidate-documents', 'police-checks']) {
      const { data: objs } = await admin.storage.from(bucket).list(user.id)
      if (objs && objs.length > 0) {
        await admin.storage.from(bucket).remove(objs.map((o) => `${user.id}/${o.name}`))
      }
    }

    // Contact-form enquiries are keyed by email, not user id.
    if (user.email) {
      await admin.from('contact_leads').delete().eq('email', user.email)
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
