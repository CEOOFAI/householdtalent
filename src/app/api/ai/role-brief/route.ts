import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAnthropic, checkAIRateLimit } from '@/lib/ai/client';
import { buildRoleBriefPrompt, parseBriefResponse } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'employer') {
    return NextResponse.json({ error: 'Employer access only' }, { status: 403 });
  }

  // Cap AI usage per employer per day so a logged-in user cannot run up the
  // Anthropic bill by spamming role-brief generations.
  const allowed = await checkAIRateLimit(user.id, 'role-brief');
  if (!allowed) {
    return NextResponse.json(
      { error: 'Daily generation limit reached. Try again tomorrow.' },
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const prompt = buildRoleBriefPrompt({
      roleType: body.role_type,
      location: body.location,
      propertyType: body.property_type,
      householdSize: body.household_size,
      schedule: body.schedule,
      duties: body.duties,
      salaryMin: body.salary_min,
      salaryMax: body.salary_max,
      startDate: body.start_date,
      languages: body.languages,
      specialRequirements: body.special_requirements || '',
    });

    const anthropic = getAnthropic();
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    const brief = parseBriefResponse(textBlock.text);
    return NextResponse.json({ brief });
  } catch {
    console.error('role brief generation failed');
    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 });
  }
}
