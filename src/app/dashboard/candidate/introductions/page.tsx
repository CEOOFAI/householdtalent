import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Handshake, Clock, CheckCircle, XCircle, Inbox } from 'lucide-react'
import { ConsentActions } from './consent-actions'

interface CandidateIntroRow {
  id: string
  message: string | null
  status: 'pending' | 'approved' | 'introduced' | 'declined'
  candidate_consent: 'pending' | 'accepted' | 'declined' | null
  admin_approved_at: string | null
  candidate_consent_at: string | null
  declined_by: 'admin' | 'candidate' | null
  introduced_at: string | null
  created_at: string
  roles: { title: string; location: string | null } | null
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function CandidateIntroductionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: candidateProfile } = await supabase
    .from('candidate_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!candidateProfile) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-bold text-white">
          Introductions
        </h1>
        <Card className="border-border bg-card">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Please complete your candidate profile first.
          </CardContent>
        </Card>
      </div>
    )
  }

  const { data: requests } = await supabase
    .from('contact_requests')
    .select(`
      id,
      message,
      status,
      candidate_consent,
      admin_approved_at,
      candidate_consent_at,
      declined_by,
      introduced_at,
      created_at,
      roles ( title, location )
    `)
    .eq('candidate_id', candidateProfile.id)
    // Hide admin-rejected rows so the candidate never sees vetting decisions
    .or('declined_by.is.null,declined_by.neq.admin')
    .order('created_at', { ascending: false })

  const rows = (requests || []) as unknown as CandidateIntroRow[]

  const withAdmin = rows.filter((r) => r.status === 'pending')
  const awaiting = rows.filter(
    (r) => r.status === 'approved' && r.candidate_consent === 'pending',
  )
  const accepted = rows.filter((r) => r.status === 'introduced')
  const declined = rows.filter(
    (r) => r.status === 'declined' && r.declined_by === 'candidate',
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">
          Introductions
        </h1>
        <p className="mt-1 text-muted-foreground">
          Employers we have curated for you. You decide whether to be
          introduced.
        </p>
      </div>

      {withAdmin.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            With our team
          </h2>
          {withAdmin.map((r) => (
            <Card key={r.id} className="border-border bg-card">
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-white/70">
                    <Clock className="h-3 w-3" />
                    Awaiting our review
                  </span>
                  <span className="text-xs text-neutral-500">
                    Submitted {formatDate(r.created_at)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {r.roles?.title || 'Role'}
                  </p>
                  <p className="text-xs text-neutral-400">
                    Our team is reviewing this introduction. We typically get back within 24 hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {awaiting.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9B7B3C]">
            Awaiting your decision
          </h2>
          {awaiting.map((r) => (
            <Card
              key={r.id}
              className="border-l-2 border-l-[#9B7B3C] border-border bg-card"
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#9B7B3C]/10 px-2 py-0.5 text-xs font-medium text-[#9B7B3C]">
                    <Clock className="h-3 w-3" />
                    Awaiting your decision
                  </span>
                  <span className="text-xs text-neutral-500">
                    Approved {r.admin_approved_at ? formatDate(r.admin_approved_at) : formatDate(r.created_at)}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">Role</p>
                  <p className="text-base font-medium text-[#9B7B3C]">
                    {r.roles?.title || 'Role'}
                  </p>
                  {r.roles?.location && (
                    <p className="text-xs text-neutral-400 capitalize">
                      {r.roles.location.replace(/_/g, ' ')}
                    </p>
                  )}
                </div>

                {r.message && (
                  <div>
                    <p className="text-xs text-neutral-500">Message from employer</p>
                    <p className="mt-0.5 text-sm text-neutral-300">
                      &ldquo;{r.message}&rdquo;
                    </p>
                  </div>
                )}

                <ConsentActions requestId={r.id} />
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {accepted.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-green-400">
            Introduced
          </h2>
          {accepted.map((r) => (
            <Card key={r.id} className="border-border bg-card">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-base font-medium text-white">
                    {r.roles?.title || 'Role'}
                  </p>
                  <p className="text-xs text-neutral-400">
                    Introduced {r.introduced_at ? formatDate(r.introduced_at) : ''}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  Introduced
                </span>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {declined.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Past
          </h2>
          {declined.map((r) => (
            <Card key={r.id} className="border-border bg-card opacity-60">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-base font-medium text-white">
                    {r.roles?.title || 'Role'}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {r.declined_by === 'candidate' ? 'You declined' : 'Closed'}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
                  <XCircle className="h-3 w-3" />
                  Declined
                </span>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {rows.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Inbox className="mb-3 h-10 w-10 text-neutral-600" />
            <p className="text-sm text-muted-foreground">
              No introductions yet. When an employer is interested and our team
              has approved the match, you will see it here.
            </p>
          </CardContent>
        </Card>
      )}

      <p className="flex items-center gap-2 text-xs text-neutral-500">
        <Handshake className="h-3.5 w-3.5" />
        Every introduction is hand-reviewed before it reaches you. Selected, not
        listed.
      </p>
    </div>
  )
}
