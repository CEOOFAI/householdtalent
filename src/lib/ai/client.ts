import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { AI_DAILY_LIMIT } from './constants';

let _anthropic: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  }
  return _anthropic;
}

export async function checkAIRateLimit(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('candidate_profiles')
    .select('ai_generations_today, ai_generations_reset_at')
    .eq('user_id', userId)
    .single();

  if (!profile) {
    const { data: employer } = await supabase
      .from('employer_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();
    if (!employer) return false;
    const today = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('roles')
      .select('id', { count: 'exact', head: true })
      .eq('employer_id', employer.id)
      .gte('brief_generated_at', `${today}T00:00:00Z`);
    return (count || 0) < AI_DAILY_LIMIT;
  }

  const now = new Date();
  const resetAt = profile.ai_generations_reset_at ? new Date(profile.ai_generations_reset_at) : null;

  if (!resetAt || now.toDateString() !== resetAt.toDateString()) {
    await supabase
      .from('candidate_profiles')
      .update({ ai_generations_today: 1, ai_generations_reset_at: now.toISOString() })
      .eq('user_id', userId);
    return true;
  }

  if (profile.ai_generations_today >= AI_DAILY_LIMIT) return false;

  await supabase
    .from('candidate_profiles')
    .update({ ai_generations_today: profile.ai_generations_today + 1 })
    .eq('user_id', userId);

  return true;
}
