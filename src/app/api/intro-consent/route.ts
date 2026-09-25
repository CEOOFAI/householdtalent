import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// PATCH /api/intro-consent
// Body: { request_id: string, decision: 'accepted' | 'declined' }
//
// Final step of an introduction, after HHT has approved it. The party who did
// NOT start the request confirms or declines:
//   employer-initiated  -> the candidate confirms
//   candidate-initiated -> the employer confirms
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const body = await req.json();
  const { request_id, decision } = body as {
    request_id?: string;
    decision?: 'accepted' | 'declined';
  };

  if (!request_id || !decision) {
    return NextResponse.json({ error: 'Missing request_id or decision' }, { status: 400 });
  }
  if (decision !== 'accepted' && decision !== 'declined') {
    return NextResponse.json({ error: 'Invalid decision' }, { status: 400 });
  }

  const { data: request, error: fetchErr } = await admin
    .from('contact_requests')
    .select(`
      id,
      status,
      initiated_by,
      candidate_consent,
      employer_consent,
      employer_profiles!contact_requests_employer_id_fkey ( user_id ),
      candidate_profiles!contact_requests_candidate_id_fkey ( user_id ),
      roles ( title )
    `)
    .eq('id', request_id)
    .single();

  if (fetchErr || !request) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  const employerUserId = ((request.employer_profiles as unknown) as { user_id: string } | null)?.user_id || '';
  const candidateUserId = ((request.candidate_profiles as unknown) as { user_id: string } | null)?.user_id || '';
  const roleTitle = ((request.roles as unknown) as { title: string } | null)?.title || 'the role';

  // Who is allowed to answer this request?
  const responder: 'candidate' | 'employer' = request.initiated_by === 'candidate' ? 'employer' : 'candidate';
  const responderUserId = responder === 'candidate' ? candidateUserId : employerUserId;
  if (user.id !== responderUserId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const consentColumn = responder === 'candidate' ? 'candidate_consent' : 'employer_consent';
  const consentAtColumn = responder === 'candidate' ? 'candidate_consent_at' : 'employer_consent_at';
  if (request.status !== 'approved' || request[consentColumn] !== 'pending') {
    return NextResponse.json(
      { error: 'This introduction is not awaiting your confirmation' },
      { status: 409 },
    );
  }

  const now = new Date().toISOString();
  const update =
    decision === 'accepted'
      ? { status: 'introduced', [consentColumn]: 'accepted', [consentAtColumn]: now, introduced_at: now }
      : { status: 'declined', [consentColumn]: 'declined', [consentAtColumn]: now, declined_by: responder };

  // Guard on the current state so a double submit can't move it twice.
  const { data: updated, error: updateErr } = await admin
    .from('contact_requests')
    .update(update)
    .eq('id', request_id)
    .eq('status', 'approved')
    .eq(consentColumn, 'pending')
    .select('id');

  if (updateErr) {
    console.error('intro consent update failed', updateErr.code);
    return NextResponse.json({ error: 'Could not save your answer. Please try again.' }, { status: 500 });
  }
  if (!updated || updated.length === 0) {
    return NextResponse.json({ error: 'This introduction has already been answered' }, { status: 409 });
  }

  // Tell the other party and HHT. No names are shared in notifications.
  const otherUserId = responder === 'candidate' ? employerUserId : candidateUserId;
  const otherDashboard = responder === 'candidate' ? '/dashboard/employer/introductions' : '/dashboard/candidate/introductions';

  if (otherUserId) {
    await admin.from('notifications').insert(
      decision === 'accepted'
        ? {
            user_id: otherUserId,
            type: 'introduction_approved',
            title: 'Introduction confirmed',
            body: `Your introduction for the ${roleTitle} role has been confirmed by both sides. HHT will be in touch to facilitate next steps.`,
            action_url: otherDashboard,
          }
        : {
            user_id: otherUserId,
            type: 'introduction_declined',
            title: 'Introduction update',
            body: `We are unable to progress this introduction for the ${roleTitle} role at this time.`,
            action_url: otherDashboard,
          },
    );
  }

  const { data: admins } = await admin.from('profiles').select('id').eq('role', 'admin');
  for (const a of admins || []) {
    await admin.from('notifications').insert({
      user_id: a.id,
      type: decision === 'accepted' ? 'introduction_approved' : 'introduction_declined',
      title: decision === 'accepted' ? 'Introduction confirmed' : 'Introduction declined',
      body: `The ${responder} ${decision === 'accepted' ? 'confirmed' : 'declined'} the introduction for the ${roleTitle} role.`,
      action_url: '/admin/introductions',
    });
  }

  return NextResponse.json({ ok: true, status: decision === 'accepted' ? 'introduced' : 'declined' });
}
