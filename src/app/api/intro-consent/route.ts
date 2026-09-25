import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// PATCH /api/intro-consent
// Body: { request_id: string, decision: 'accepted' | 'declined' }
// Called by the candidate to confirm or refuse an introduction the admin has approved.
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

  // Fetch the request and verify the caller is the candidate it belongs to
  const { data: candidateProfile } = await supabase
    .from('candidate_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!candidateProfile) {
    return NextResponse.json({ error: 'Candidate profile not found' }, { status: 403 });
  }

  const { data: request, error: fetchErr } = await admin
    .from('contact_requests')
    .select(`
      id,
      employer_id,
      candidate_id,
      role_id,
      status,
      candidate_consent,
      employer_profiles!contact_requests_employer_id_fkey (
        user_id,
        profiles:user_id ( first_name, last_name )
      ),
      candidate_profiles!contact_requests_candidate_id_fkey (
        user_id,
        profiles:user_id ( first_name, last_name )
      ),
      roles ( title )
    `)
    .eq('id', request_id)
    .single();

  if (fetchErr || !request) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  if (request.candidate_id !== candidateProfile.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (request.status !== 'approved' || request.candidate_consent !== 'pending') {
    return NextResponse.json(
      { error: 'This introduction is not awaiting your confirmation' },
      { status: 409 },
    );
  }

  // Cast nested join shape (Supabase returns arrays for relations)
  const employer = (request.employer_profiles as unknown) as {
    user_id: string;
    profiles: { first_name: string; last_name: string };
  } | null;
  const candidate = (request.candidate_profiles as unknown) as {
    user_id: string;
    profiles: { first_name: string; last_name: string };
  } | null;
  const role = (request.roles as unknown) as { title: string } | null;

  const employerUserId = employer?.user_id || '';
  const employerName = employer?.profiles
    ? `${employer.profiles.first_name} ${employer.profiles.last_name}`
    : 'the employer';
  const candidateName = candidate?.profiles
    ? `${candidate.profiles.first_name} ${candidate.profiles.last_name}`
    : 'the candidate';
  const roleTitle = role?.title || 'the role';

  if (decision === 'accepted') {
    const now = new Date().toISOString();
    const { error: updateErr } = await admin
      .from('contact_requests')
      .update({
        status: 'introduced',
        candidate_consent: 'accepted',
        candidate_consent_at: now,
        introduced_at: now,
      })
      .eq('id', request_id)
      .eq('status', 'approved')
      .eq('candidate_consent', 'pending');

    if (updateErr) {
      console.error('intro consent update failed', updateErr.code);
    return NextResponse.json({ error: 'Could not save your answer. Please try again.' }, { status: 500 });
    }

    // Notify employer the intro is now live
    if (employerUserId) {
      await admin.from('notifications').insert({
        user_id: employerUserId,
        type: 'introduction_approved',
        title: 'Introduction Confirmed',
        body: `${candidateName} has accepted your introduction request for the ${roleTitle} role. We will be in touch with details shortly.`,
        action_url: '/dashboard/employer/introductions',
      });
    }

    return NextResponse.json({ ok: true, status: 'introduced' });
  }

  // decision === 'declined'
  const { error: updateErr } = await admin
    .from('contact_requests')
    .update({
      status: 'declined',
      candidate_consent: 'declined',
      candidate_consent_at: new Date().toISOString(),
      declined_by: 'candidate',
    })
    .eq('id', request_id)
    .eq('status', 'approved')
    .eq('candidate_consent', 'pending');

  if (updateErr) {
    console.error('intro consent update failed', updateErr.code);
    return NextResponse.json({ error: 'Could not save your answer. Please try again.' }, { status: 500 });
  }

  // Graceful, non-revealing message to the employer
  if (employerUserId) {
    await admin.from('notifications').insert({
      user_id: employerUserId,
      type: 'introduction_declined',
      title: 'Introduction Update',
      body: `Unfortunately, we are unable to progress this introduction for the ${roleTitle} role at this time. Our team will continue to look for the right match for you.`,
      action_url: '/dashboard/employer/introductions',
    });
  }

  return NextResponse.json({ ok: true, status: 'declined' });
}
