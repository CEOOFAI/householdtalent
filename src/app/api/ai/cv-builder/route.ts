import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAnthropic, checkAIRateLimit } from '@/lib/ai/client';
import { buildCVPrompt, parseCVResponse } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { data: candidateProfile } = await supabase
    .from('candidate_profiles')
    .select('tier')
    .eq('user_id', user.id)
    .single();

  if (!candidateProfile) return NextResponse.json({ error: 'Candidate profile not found' }, { status: 404 });
  if (candidateProfile.tier !== 'complete') {
    return NextResponse.json({ error: 'Complete tier required for CV Builder' }, { status: 403 });
  }

  const allowed = await checkAIRateLimit(user.id, 'cv-builder');
  if (!allowed) {
    return NextResponse.json({ error: 'Daily generation limit reached. Try again tomorrow.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const prompt = buildCVPrompt({
      roles: body.roles,
      skills: body.skills,
      languages: body.languages,
      availability: body.availability,
      locationPreferences: body.location_preferences,
      salaryMin: body.salary_min,
      salaryMax: body.salary_max,
      personalStatement: body.personal_statement,
      achievements: body.achievements || '',
    });

    const anthropic = getAnthropic();
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    const cv = parseCVResponse(textBlock.text);

    await supabase
      .from('candidate_profiles')
      .update({ generated_cv: cv, cv_generated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    return NextResponse.json({ cv });
  } catch {
    console.error('CV generation failed');
    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 });
  }
}
