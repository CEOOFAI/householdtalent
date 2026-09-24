require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmd2xlaXNoeXltYnh5bmxjYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2NjM2MiwiZXhwIjoyMDg5OTQyMzYyfQ.XlEjL3BqUhHsVQlyNSzU0g3UcljIj-2QaAQ36RA1Vyw';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const admin = createClient(url, serviceKey);

async function fullStressTest() {
  const errors = [];
  let empUserId, candUserId, empProfileId, candProfileId;

  try {
    // TEST 1: Employer signup
    console.log('=== TEST 1: Employer signup ===');
    const empEmail = 'stress-emp-' + Date.now() + '@test.com';
    const { data: empAuth, error: e1 } = await admin.auth.admin.createUser({
      email: empEmail, password: 'StressTest123!', email_confirm: true,
      user_metadata: { role: 'employer', first_name: 'Stress', last_name: 'Employer' }
    });
    if (e1) { errors.push('Employer signup: ' + e1.message); console.log('FAIL:', e1.message); return; }
    empUserId = empAuth.user.id;
    console.log('OK - user:', empUserId);
    await new Promise(r => setTimeout(r, 1500));

    const { data: empProf, error: e1b } = await admin.from('employer_profiles').select('id').eq('user_id', empUserId).single();
    if (e1b) { errors.push('Employer profile: ' + e1b.message); console.log('FAIL:', e1b.message); }
    else { empProfileId = empProf.id; console.log('OK - profile:', empProfileId); }

    // TEST 2: Candidate signup
    console.log('\n=== TEST 2: Candidate signup ===');
    const candEmail = 'stress-cand-' + Date.now() + '@test.com';
    const { data: candAuth, error: e2 } = await admin.auth.admin.createUser({
      email: candEmail, password: 'StressTest123!', email_confirm: true,
      user_metadata: { role: 'candidate', first_name: 'Stress', last_name: 'Candidate' }
    });
    if (e2) { errors.push('Candidate signup: ' + e2.message); console.log('FAIL:', e2.message); return; }
    candUserId = candAuth.user.id;
    console.log('OK - user:', candUserId);
    await new Promise(r => setTimeout(r, 1500));

    const { data: candProf, error: e2b } = await admin.from('candidate_profiles').select('id, slug').eq('user_id', candUserId).single();
    if (e2b) { errors.push('Candidate profile: ' + e2b.message); console.log('FAIL:', e2b.message); }
    else { candProfileId = candProf.id; console.log('OK - profile:', candProfileId); }

    // TEST 3: Employer login + post role via anon key (simulates frontend)
    console.log('\n=== TEST 3: Employer posts role (anon key) ===');
    const empClient = createClient(url, anonKey);
    const { error: e3login } = await empClient.auth.signInWithPassword({ email: empEmail, password: 'StressTest123!' });
    if (e3login) { errors.push('Employer login: ' + e3login.message); console.log('FAIL login:', e3login.message); }
    else console.log('OK - logged in');

    const { data: role1, error: e3role } = await empClient.from('roles').insert({
      employer_id: empProfileId,
      title: 'Live-in Housekeeper',
      role_type: 'Housekeeper',
      position_type: 'live_in',
      location: 'gibraltar',
      location_region: 'gibraltar',
      responsibilities: ['cleaning', 'laundry'],
      experience_preferred: 'private_household',
      salary_min: 25000,
      salary_max: 35000,
      listing_tier: 'standard',
      status: 'draft',
      start_date: 'immediate',
      additional_notes: 'Formal household experience preferred.',
    }).select().single();
    if (e3role) { errors.push('Role insert (anon): ' + e3role.message); console.log('FAIL:', e3role.message); }
    else console.log('OK - role:', role1.id);

    // TEST 3b: Post second role with all new fields
    console.log('\n=== TEST 3b: Role with expanded fields ===');
    const { data: role2, error: e3b } = await empClient.from('roles').insert({
      employer_id: empProfileId,
      title: 'Butler / House Manager',
      role_type: 'Butler',
      position_type: 'live_in',
      employment_type: 'permanent',
      location: 'marbella',
      location_region: 'costa_del_sol_west',
      responsibilities: ['formal_service', 'management'],
      requirements: ['UHNW experience', '5+ years formal household'],
      languages: ['English (Fluent)', 'Spanish (Conversational)'],
      hours_type: 'full_time',
      hours_per_week: 45,
      salary_band: '40000-50000',
      description: 'Seeking an experienced butler for a UHNW family estate.',
      experience_preferred: 'private_household',
      salary_min: 40000,
      salary_max: 50000,
      listing_tier: 'standard',
      status: 'draft',
      start_date: '2026-05-01',
      plan: 'standard',
      plan_price: 16500,
    }).select().single();
    if (e3b) { errors.push('Role insert (expanded): ' + e3b.message); console.log('FAIL:', e3b.message); }
    else console.log('OK - role:', role2.id);

    // TEST 4: Update candidate profile
    console.log('\n=== TEST 4: Candidate updates profile ===');
    const candClient = createClient(url, anonKey);
    await candClient.auth.signInWithPassword({ email: candEmail, password: 'StressTest123!' });

    const { error: e4 } = await candClient.from('candidate_profiles').update({
      headline: 'Experienced Butler & Housekeeper',
      bio: 'Over 8 years in UHNW households across Europe.',
      roles: ['Housekeeper', 'Butler', 'House Manager'],
      skills: ['Deep cleaning', 'Silver polishing', 'Formal service', 'Wine service', 'Guest reception', 'Wardrobe management'],
      languages: ['English (Fluent)', 'Spanish (Conversational)', 'French (Basic)'],
      location: 'gibraltar',
      location_region: 'gibraltar',
      availability: 'immediate',
      salary_expectation_min: 30000,
      salary_expectation_max: 45000,
    }).eq('user_id', candUserId);
    if (e4) { errors.push('Profile update: ' + e4.message); console.log('FAIL:', e4.message); }
    else console.log('OK - profile updated');

    // TEST 5: Employer searches candidates
    console.log('\n=== TEST 5: Employer searches candidates ===');
    const { data: candidates, error: e5 } = await empClient.from('candidate_profiles')
      .select('id, headline, roles, skills, status, tier')
      .limit(10);
    if (e5) { errors.push('Search: ' + e5.message); console.log('FAIL:', e5.message); }
    else console.log('OK - found', candidates.length, 'candidates');

    // TEST 6: Contact request
    console.log('\n=== TEST 6: Contact request ===');
    if (empProfileId && candProfileId) {
      const { error: e6 } = await empClient.from('contact_requests').insert({
        employer_id: empProfileId,
        candidate_id: candProfileId,
        message: 'Interested in your profile for our butler position.',
        status: 'pending',
      });
      if (e6) { errors.push('Contact request: ' + e6.message); console.log('FAIL:', e6.message); }
      else console.log('OK - request sent');
    }

    // TEST 7: Candidate dashboard data
    console.log('\n=== TEST 7: Candidate dashboard ===');
    const { data: myProfile, error: e7a } = await candClient.from('candidate_profiles').select('*').eq('user_id', candUserId).single();
    if (e7a) { errors.push('Cand dashboard: ' + e7a.message); console.log('FAIL:', e7a.message); }
    else console.log('OK - tier:', myProfile.tier, 'status:', myProfile.status, 'skills:', myProfile.skills?.length);

    const { count: views, error: e7b } = await candClient.from('profile_views').select('id', { count: 'exact', head: true }).eq('candidate_id', candProfileId);
    if (e7b) { errors.push('Views: ' + e7b.message); console.log('FAIL:', e7b.message); }
    else console.log('OK - views:', views);

    const { data: reqs, error: e7c } = await candClient.from('contact_requests').select('*').eq('candidate_id', candProfileId);
    if (e7c) { errors.push('Requests: ' + e7c.message); console.log('FAIL:', e7c.message); }
    else console.log('OK - requests:', reqs.length);

    // TEST 8: Employer reads own roles
    console.log('\n=== TEST 8: Employer roles list ===');
    const { data: myRoles, error: e8 } = await empClient.from('roles').select('id, title, status').eq('employer_id', empProfileId);
    if (e8) { errors.push('Roles list: ' + e8.message); console.log('FAIL:', e8.message); }
    else console.log('OK - roles:', myRoles.length, myRoles.map(r => r.title).join(', '));

    // TEST 9: Public pages - candidate listing
    console.log('\n=== TEST 9: Public candidate listing ===');
    const pubClient = createClient(url, anonKey);
    const { data: pubCandidates, error: e9 } = await pubClient.from('candidate_profiles')
      .select('id, headline, roles, location, availability, tier, status')
      .eq('status', 'active')
      .limit(10);
    if (e9) { errors.push('Public listing: ' + e9.message); console.log('FAIL:', e9.message); }
    else console.log('OK - public candidates:', pubCandidates.length, '(0 is fine, none are active yet)');

    // TEST 10: Saved candidates
    console.log('\n=== TEST 10: Save candidate ===');
    if (empProfileId && candProfileId) {
      const { error: e10 } = await empClient.from('saved_candidates').insert({
        employer_id: empProfileId,
        candidate_id: candProfileId,
      });
      if (e10) { errors.push('Save candidate: ' + e10.message); console.log('FAIL:', e10.message); }
      else console.log('OK - candidate saved');
    }

  } catch (err) {
    errors.push('CRASH: ' + err.message);
    console.log('CRASH:', err.message);
  }

  // CLEANUP
  console.log('\n=== CLEANUP ===');
  if (empProfileId) {
    await admin.from('saved_candidates').delete().eq('employer_id', empProfileId);
    await admin.from('contact_requests').delete().eq('employer_id', empProfileId);
    await admin.from('roles').delete().eq('employer_id', empProfileId);
  }
  if (empUserId) await admin.auth.admin.deleteUser(empUserId);
  if (candUserId) await admin.auth.admin.deleteUser(candUserId);
  console.log('Done');

  // RESULTS
  console.log('\n========================================');
  if (errors.length === 0) {
    console.log('ALL 10 TESTS PASSED');
  } else {
    console.log('FAILURES (' + errors.length + '):');
    errors.forEach(e => console.log('  - ' + e));
  }
}

fullStressTest();
