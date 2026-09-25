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
    // Get employer_id from the role
    const { data: role } = await supabase
      .from('roles')
      .select('employer_id')
      .eq('id', role_id)
      .single();
    if (!role) return NextResponse.json({ error: 'Role not found' }, { status: 404 });
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
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Introduction already requested' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
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
