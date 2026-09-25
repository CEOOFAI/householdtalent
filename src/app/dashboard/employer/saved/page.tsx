import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { candidateCardsByIds } from '@/lib/candidates/employer-view'
import { SavedList } from './saved-list'

export default async function EmployerSavedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: employer } = await supabase
    .from('employer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  let cards: Awaited<ReturnType<typeof candidateCardsByIds>> = []
  if (employer) {
    const { data: saved } = await supabase
      .from('saved_candidates')
      .select('candidate_id, created_at')
      .eq('employer_id', employer.id)
      .order('created_at', { ascending: false })
    const ids = (saved ?? []).map((r) => r.candidate_id as string)
    const byId = new Map((await candidateCardsByIds(ids)).map((c) => [c.id, c]))
    cards = ids.map((id) => byId.get(id)).filter((c): c is NonNullable<typeof c> => !!c)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Saved Candidates</h1>
        <p className="mt-1 text-muted-foreground">
          Your shortlist of HHT Approved profiles, kept privately for quick comparison.
        </p>
      </div>
      <SavedList initial={cards} />
    </div>
  )
}
