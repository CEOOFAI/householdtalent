import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const body = await req.json();
  const { candidate_id, role_id, message } = body;

  // Determine if this is from an employer or candidate
  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('id, tier')
    .eq('user_id', user.id)
    .single();

  const { data: candidateProfile } = await supabase
    .from('candidate_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  let employer_id: string;
  let actual_candidate_id: string;
  let initiated_by: 'employer' | 'candidate' = 'employer';

  if (employerProfile) {
    // Employer requesting introduction to candidate
    employer_id = employerProfile.id;
    actual_candidate_id = candidate_id;

    // Verify target candidate exists and is active (prevents IDOR + requests
    // against draft/suspended candidates).
    const { data: targetCandidate } = await admin
      .from('candidate_profiles')
      .select('id, status')
      .eq('id', candidate_id)
      .maybeSingle();
    if (!targetCandidate || targetCandidate.status !== 'active') {
      return NextResponse.json(
        { error: 'Candidate is not currently available for introductions.' },
        { status: 404 },
      );
    }

    // The role must belong to this employer and be live (or awaiting review).
    if (!role_id) {
      return NextResponse.json({ error: 'Please choose which role this introduction is for.' }, { status: 400 });
    }
    const { data: ownRole } = await admin
      .from('roles')
      .select('id, employer_id, status')
      .eq('id', role_id)
      .maybeSingle();
    if (!ownRole || ownRole.employer_id !== employer_id || !['active', 'pending_review'].includes(ownRole.status)) {
      return NextResponse.json({ error: 'That role is not available for introductions.' }, { status: 400 });
    }

    // Check per-role introduction limit for Standard tier
    if (employerProfile.tier === 'basic') {
      const { count } = await supabase
        .from('contact_requests')
        .select('id', { count: 'exact', head: true })
        .eq('employer_id', employer_id)
        .eq('role_id', role_id);

      if ((count || 0) >= 5) {
        return NextResponse.json(
          { error: 'Introduction limit reached for this role (5 max on Standard tier). Upgrade to Priority for unlimited.' },
          { status: 429 }
        );
      }
    }
  } else if (candidateProfile) {
    // Candidate expressing interest in a role
    actual_candidate_id = candidateProfile.id;
    initiated_by = 'candidate';
    // Only approved (active) candidates can express interest, and only in live roles.
    const { data: me } = await admin
      .from('candidate_profiles')
      .select('status')
      .eq('id', candidateProfile.id)
      .single();
    if (me?.status !== 'active') {
      return NextResponse.json(
        { error: 'Your profile needs to be approved by HHT before you can request introductions.' },
        { status: 403 },
      );
    }
    if (!role_id) return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    const { data: role } = await admin
      .from('roles')
      .select('employer_id, status')
      .eq('id', role_id)
      .maybeSingle();
    if (!role || role.status !== 'active') return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    employer_id = role.employer_id;
  } else {
    return NextResponse.json({ error: 'Profile not found' }, { status: 403 });
  }

  // Use admin client to bypass RLS (which only lets employers insert)
  const { data, error } = await admin
    .from('contact_requests')
    .insert({
      employer_id,
      candidate_id: actual_candidate_id,
      role_id,
      message: message || null,
      status: 'pending',
      initiated_by,
      // A candidate expressing interest has already consented on their side;
      // the employer is asked to confirm once HHT approves.
      ...(initiated_by === 'candidate'
        ? { candidate_consent: 'accepted', candidate_consent_at: new Date().toISOString() }
        : {}),
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Introduction already requested' }, { status: 409 });
    }
    console.error('introduction insert failed', error.code);
    return NextResponse.json({ error: 'Could not send the request. Please try again.' }, { status: 500 });
  }

  // Notify admins (best-effort; ignore if notifications table doesn't exist or RLS blocks)
  const { data: admins } = await admin
    .from('profiles')
    .select('id')
    .eq('role', 'admin');

  if (admins) {
    for (const adminUser of admins) {
      await admin.from('notifications').insert({
        user_id: adminUser.id,
        type: 'introduction_request',
        title: 'New Introduction Request',
        body: 'A new introduction request has been submitted for review',
        action_url: '/admin/introductions',
      }).then(() => {}, () => {}); // swallow errors
    }
  }

  return NextResponse.json({ request: data });
}
