import Anthropic from '@anthropic-ai/sdk';
import { createAdminClient } from '@/lib/supabase/admin';
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

// Daily AI generation limit per user. Usage is recorded in ai_usage, a
// service-role-only table, so users cannot reset their own counter. The slot
// is claimed before the model is called, so parallel requests can't overshoot.
export async function checkAIRateLimit(userId: string, feature = 'ai'): Promise<boolean> {
  const admin = createAdminClient();
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);

  const { count, error } = await admin
    .from('ai_usage')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', since.toISOString());
  if (error) {
    console.error('ai_usage count failed', error.code);
    return false;
  }
  if ((count || 0) >= AI_DAILY_LIMIT) return false;

  const { error: insertErr } = await admin.from('ai_usage').insert({ user_id: userId, feature });
  if (insertErr) {
    console.error('ai_usage insert failed', insertErr.code);
    return false;
  }
  return true;
}
