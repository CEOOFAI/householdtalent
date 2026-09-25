import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { candidatesForIntroductions } from '@/lib/candidates/employer-view'
import { Card, CardContent } from '@/components/ui/card'
import { Handshake, Clock, CheckCircle, XCircle, Inbox } from 'lucide-react'

interface EmployerIntroRow {
  id: string
  message: string | null
  status: 'pending' | 'approved' | 'introduced' | 'declined'
  candidate_consent: 'pending' | 'accepted' | 'declined' | null
  admin_approved_at: string | null
  candidate_consent_at: string | null
  introduced_at: string | null
  created_at: string
  roles: { title: string } | null
  candidate_profiles: {
    initials: string
    headline: string | null
    salutation: string | null
    location: string | null
    languages: string[] | null
    experience_years: number | null
    profiles: { first_name: string | null; last_name: string | null; email: string | null; phone: string | null } | null
  } | null
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function StatusBadge({ row }: { row: EmployerIntroRow }) {
  if (row.status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#9B7B3C]/10 px-2 py-0.5 text-xs font-medium text-[#9B7B3C]">
        <Clock className="h-3 w-3" />
        With our team
      </span>
    )
  }
  if (row.status === 'approved' && row.candidate_consent === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
        <Clock className="h-3 w-3" />
        Confirming with candidate
      </span>
    )
  }
  if (row.status === 'introduced') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
        <CheckCircle className="h-3 w-3" />
        Introduced
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
      <XCircle className="h-3 w-3" />
      Closed
    </span>
  )
}

export default async function EmployerIntroductionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!employerProfile) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-bold text-white">
          Introductions
        </h1>
        <Card className="border-border bg-card">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Please complete your employer profile first.
          </CardContent>
        </Card>
      </div>
    )
  }

  const { data: requests } = await supabase
    .from('contact_requests')
    .select(`
      id,
      candidate_id,
      message,
      status,
      candidate_consent,
      admin_approved_at,
      candidate_consent_at,
      introduced_at,
      created_at,
      roles ( title )
    `)
    .eq('employer_id', employerProfile.id)
    .order('created_at', { ascending: false })

  // Candidate details come from the server-side helper: anonymised until the
  // introduction is complete, then name/email/phone are released.
  const requestRows = (requests || []) as unknown as (Omit<EmployerIntroRow, 'candidate_profiles'> & { candidate_id: string | null })[]
  const candidates = await candidatesForIntroductions(requestRows)
  const rows: EmployerIntroRow[] = requestRows.map((r) => {
    const c = r.candidate_id ? candidates.get(r.candidate_id) : undefined
    const nameParts = (c?.contact?.full_name || '').split(' ')
    return {
      ...r,
      candidate_profiles: c
        ? {
            initials: c.initials,
            headline: c.headline,
            salutation: c.salutation,
            location: c.location,
            languages: c.languages,
            experience_years: c.experience_years,
            profiles: c.contact
              ? {
                  first_name: nameParts[0] || null,
                  last_name: nameParts.slice(1).join(' ') || null,
                  email: c.contact.email,
                  phone: c.contact.phone,
                }
              : null,
          }
        : null,
    }
  })

  // Pre-introduction: candidate identity is hidden. Only revealed once status === 'introduced'.
  function candidateLabel(row: EmployerIntroRow): string {
    const cp = row.candidate_profiles
    const profile = cp?.profiles
    if (row.status === 'introduced' && profile?.first_name) {
      return `${profile.first_name} ${profile.last_name || ''}`.trim()
    }
    const salutation = cp?.salutation || 'Mx'
    const initial = cp?.initials?.slice(-1) || ''
    if (initial) return `${salutation}. ${initial}.`
    if (cp?.headline) return cp.headline
    return 'Candidate'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">
          Introductions
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track the candidates you have requested to be introduced to.
        </p>
      </div>

      {rows.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Inbox className="mb-3 h-10 w-10 text-neutral-600" />
            <p className="text-sm text-muted-foreground">
              No introduction requests yet. Browse our network and request an
              introduction to a candidate that catches your eye.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <Card key={row.id} className="border-border bg-card">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-3">
                  <StatusBadge row={row} />
                  <span className="text-xs text-neutral-500">
                    Requested {formatDate(row.created_at)}
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-neutral-500">Role</p>
                    <p className="text-sm font-medium text-[#9B7B3C]">
                      {row.roles?.title || 'No role specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Candidate</p>
                    <p className="text-sm font-medium text-white">
                      {candidateLabel(row)}
                    </p>
                  </div>
                </div>

                {row.status === 'introduced' && (
                  <div className="mt-3 rounded-md border border-green-500/20 bg-green-500/5 p-4 text-sm">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-green-400">
                      Candidate details unlocked
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {row.candidate_profiles?.headline && (
                        <div>
                          <p className="text-xs text-neutral-500">Headline</p>
                          <p className="text-white">{row.candidate_profiles.headline}</p>
                        </div>
                      )}
                      {row.candidate_profiles?.location && (
                        <div>
                          <p className="text-xs text-neutral-500">Location</p>
                          <p className="capitalize text-white">{row.candidate_profiles.location}</p>
                        </div>
                      )}
                      {row.candidate_profiles?.profiles?.email && (
                        <div>
                          <p className="text-xs text-neutral-500">Email</p>
                          <a href={`mailto:${row.candidate_profiles.profiles.email}`} className="text-[#9B7B3C] hover:underline">
                            {row.candidate_profiles.profiles.email}
                          </a>
                        </div>
                      )}
                      {row.candidate_profiles?.profiles?.phone && (
                        <div>
                          <p className="text-xs text-neutral-500">Phone</p>
                          <a href={`tel:${row.candidate_profiles.profiles.phone}`} className="text-[#9B7B3C] hover:underline">
                            {row.candidate_profiles.profiles.phone}
                          </a>
                        </div>
                      )}
                      {row.candidate_profiles?.languages?.length ? (
                        <div>
                          <p className="text-xs text-neutral-500">Languages</p>
                          <p className="text-white">{row.candidate_profiles.languages.join(', ')}</p>
                        </div>
                      ) : null}
                      {row.candidate_profiles?.experience_years ? (
                        <div>
                          <p className="text-xs text-neutral-500">Experience</p>
                          <p className="text-white">{row.candidate_profiles.experience_years} years</p>
                        </div>
                      ) : null}
                    </div>
                    {row.introduced_at && (
                      <p className="mt-3 text-xs text-green-400">
                        Introduced on {formatDate(row.introduced_at)}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="flex items-center gap-2 text-xs text-neutral-500">
        <Handshake className="h-3.5 w-3.5" />
        Every introduction is reviewed by our team and confirmed by the
        candidate before details are shared.
      </p>
    </div>
  )
}
