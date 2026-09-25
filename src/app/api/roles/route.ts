import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { LOCATIONS } from '@/lib/constants';

const LOCATION_ENUM_VALUES = [
  'gibraltar', 'marbella', 'estepona', 'sotogrande', 'san_roque',
  'la_linea', 'manilva', 'casares', 'benahavis', 'fuengirola', 'mijas', 'other'
];

// Normalize free-text location to enum value
function normalizeLocation(input: string): string {
  if (!input) return 'gibraltar';
  const normalized = input.toLowerCase().trim().replace(/\s+/g, '_').replace(/-/g, '_');
  const exact = LOCATIONS.find(l => l.value === normalized);
  if (exact) return exact.value;
  const fuzzy = LOCATION_ENUM_VALUES.find(v => normalized.includes(v) || v.includes(normalized));
  return fuzzy || 'other';
}

// Derive location_region from location value
function getLocationRegion(location: string): string {
  const loc = LOCATIONS.find(l => l.value === location);
  return loc?.region || 'gibraltar';
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { data: employer } = await supabase
    .from('employer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!employer) return NextResponse.json({ error: 'Employer only' }, { status: 403 });

  const body = await req.json();

  // Validate required fields
  if (!body.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  if (!body.position_type) return NextResponse.json({ error: 'Position type is required' }, { status: 400 });

  // Normalize location to enum value (user may type free text)
  const rawLocation = body.location || 'gibraltar';
  const location = normalizeLocation(rawLocation);
  const locationRegion = body.location_region || getLocationRegion(location);

  // Preserve original typed location in description if it didn't map cleanly
  const locationNote = (location === 'other' && rawLocation)
    ? `[Location: ${rawLocation}]`
    : '';
  const description = locationNote && body.description
    ? `${locationNote}\n\n${body.description}`
    : locationNote || body.description || null;

  const { data, error } = await supabase
    .from('roles')
    .insert({
      employer_id: employer.id,
      title: body.title,
      role_type: body.role_type || body.title,
      position_type: body.position_type,
      employment_type: body.employment_type || null,
      location: location,
      location_region: locationRegion,
      responsibilities: body.responsibilities || [],
      requirements: body.requirements || [],
      languages: body.languages || [],
      hours_type: body.hours_type || null,
      hours_per_week: body.hours_per_week && !isNaN(parseInt(body.hours_per_week)) ? parseInt(body.hours_per_week) : null,
      salary_band: body.salary_band || null,
      salary_min: body.salary_min ? parseInt(body.salary_min) : null,
      salary_max: body.salary_max ? parseInt(body.salary_max) : null,
      description: description,
      start_date: body.start_date || null,
      plan: body.plan || null,
      plan_price: body.plan_price ? parseInt(body.plan_price) : null,
      generated_brief: body.generated_brief || null,
      // Employers can only save drafts or submit for HHT review; going live is an admin action.
      status: body.status === 'draft' ? 'draft' : 'pending_review',
      listing_tier: 'standard',
    })
    .select()
    .single();

  if (error) {
    console.error('roles insert failed', { code: error.code });
    return NextResponse.json({ error: 'Could not save the role. Please try again.' }, { status: 500 });
  }
  return NextResponse.json({ role: data });
}
