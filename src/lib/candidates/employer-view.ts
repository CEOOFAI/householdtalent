import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

// Employer-facing candidate data.
//
// candidate_profiles is only readable by its owner and admins (RLS). Employers
// never query it directly: these helpers read it with the service role and
// return only fields that are safe to show before an introduction. Contact
// details (name, email, phone) are released only once HHT has completed the
// introduction (contact_requests.status === 'introduced').

export interface EmployerCandidateCard {
  id: string
  initials: string
  salutation: string | null
  headline: string | null
  location: string | null
  roles: string[]
  experience_years: number | null
  availability: string | null
  tier: string | null
  reference_status: 'pending' | 'in_progress' | 'verified' | null
  gold_verified: boolean | null
}

export interface IntroducedCandidate extends EmployerCandidateCard {
  languages: string[]
  // Only populated once the introduction is complete
  contact: { full_name: string; email: string | null; phone: string | null } | null
}

const CARD_COLUMNS =
  'id, full_name, salutation, headline, location, roles, languages, experience_years, availability, tier, reference_status, gold_verified'

type CardRow = {
  id: string
  full_name: string | null
  salutation: string | null
  headline: string | null
  location: string | null
  roles: string[] | null
  languages: string[] | null
  experience_years: number | null
  availability: string | null
  tier: string | null
  reference_status: EmployerCandidateCard['reference_status']
  gold_verified: boolean | null
}

export function initialsFrom(fullName: string | null | undefined): string {
  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : ''
  return `${first}${last}`.toUpperCase()
}

function toCard(row: CardRow): EmployerCandidateCard {
  return {
    id: row.id,
    initials: initialsFrom(row.full_name),
    salutation: row.salutation,
    headline: row.headline,
    location: row.location,
    roles: row.roles ?? [],
    experience_years: row.experience_years,
    availability: row.availability,
    tier: row.tier,
    reference_status: row.reference_status,
    gold_verified: row.gold_verified,
  }
}

export async function listActiveCandidatesForEmployers(): Promise<EmployerCandidateCard[]> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('candidate_profiles')
    .select(CARD_COLUMNS)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  if (error) throw new Error(`candidate search failed: ${error.message}`)
  return ((data ?? []) as CardRow[]).map(toCard)
}

// Candidate details for an employer's own introduction requests.
// `requests` must already be scoped to the employer (fetched under their session).
export async function candidatesForIntroductions(
  requests: { candidate_id: string | null; status: string }[],
): Promise<Map<string, IntroducedCandidate>> {
  const ids = [...new Set(requests.map(r => r.candidate_id).filter((v): v is string => !!v))]
  const result = new Map<string, IntroducedCandidate>()
  if (ids.length === 0) return result

  const introducedIds = new Set(
    requests.filter(r => r.status === 'introduced' && r.candidate_id).map(r => r.candidate_id as string),
  )

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('candidate_profiles')
    .select(`${CARD_COLUMNS}, user_id, phone, email`)
    .in('id', ids)
  if (error) throw new Error(`introduction candidates failed: ${error.message}`)

  for (const row of (data ?? []) as (CardRow & { user_id: string; phone: string | null; email: string | null })[]) {
    let contact: IntroducedCandidate['contact'] = null
    if (introducedIds.has(row.id)) {
      const { data: profile } = await admin
        .from('profiles')
        .select('first_name, last_name, email, phone')
        .eq('id', row.user_id)
        .maybeSingle()
      contact = {
        full_name: row.full_name || `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim(),
        email: row.email || profile?.email || null,
        phone: row.phone || profile?.phone || null,
      }
    }
    result.set(row.id, { ...toCard(row), languages: row.languages ?? [], contact })
  }
  return result
}

// Anonymised cards for specific candidates (e.g. an employer's saved list).
// Only active candidates are returned.
export async function candidateCardsByIds(ids: string[]): Promise<EmployerCandidateCard[]> {
  if (ids.length === 0) return []
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('candidate_profiles')
    .select(CARD_COLUMNS)
    .in('id', ids)
    .eq('status', 'active')
  if (error) throw new Error(`saved candidates failed: ${error.message}`)
  return ((data ?? []) as CardRow[]).map(toCard)
}
