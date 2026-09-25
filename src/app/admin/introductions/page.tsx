import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Handshake, Clock, CheckCircle, XCircle } from 'lucide-react'
import { IntroductionActions } from './introduction-actions'
import type { ContactRequestStatus } from '@/types'

interface IntroductionRequest {
  id: string
  employer_id: string
  candidate_id: string
  role_id: string | null
  message: string
  status: ContactRequestStatus
  candidate_consent: 'pending' | 'accepted' | 'declined' | null
  admin_approved_at: string | null
  candidate_consent_at: string | null
  declined_by: 'admin' | 'candidate' | 'employer' | null
  initiated_by: 'employer' | 'candidate'
  employer_consent: 'pending' | 'accepted' | 'declined' | null
  admin_notes: string | null
  introduced_at: string | null
  created_at: string
  employer_profiles: {
    user_id: string
    profiles: {
      first_name: string
      last_name: string
    }
  }
  candidate_profiles: {
    user_id: string
    profiles: {
      first_name: string
      last_name: string
    }
  }
  roles: {
    title: string
  } | null
}

function getStatusBadge(
  status: ContactRequestStatus,
  candidateConsent: 'pending' | 'accepted' | 'declined' | null,
  declinedBy: 'admin' | 'candidate' | 'employer' | null,
  initiatedBy: 'employer' | 'candidate' = 'employer',
  employerConsent: 'pending' | 'accepted' | 'declined' | null = null,
) {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#9B7B3C]/10 px-2 py-0.5 text-xs font-medium text-[#9B7B3C]">
          <Clock className="h-3 w-3" />
          Awaiting your review
        </span>
      )
    case 'approved':
      if (initiatedBy === 'candidate' ? employerConsent === 'pending' : candidateConsent === 'pending') {
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
            <Clock className="h-3 w-3" />
            Awaiting {initiatedBy === 'candidate' ? 'employer' : 'candidate'}
          </span>
        )
      }
      return (
        <span className="inline-flex rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-400">
          Approved
        </span>
      )
    case 'introduced':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
          <CheckCircle className="h-3 w-3" />
          Introduced
        </span>
      )
    case 'declined':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
          <XCircle className="h-3 w-3" />
          Declined{declinedBy && declinedBy !== 'admin' ? ` (${declinedBy})` : ''}
        </span>
      )
    default:
      return (
        <span className="inline-flex rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-400">
          {status}
        </span>
      )
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Always render on request: live data, admin-only.
export const dynamic = 'force-dynamic'

export default async function AdminIntroductionsPage() {
  // Admin-only page (gated by middleware + admin layout). admin_notes is hidden
  // from signed-in users by column privileges, so read with the service role.
  const supabase = createAdminClient()

  const { data: requests, error } = await supabase
    .from('contact_requests')
    .select(`
      id,
      employer_id,
      candidate_id,
      role_id,
      message,
      status,
      candidate_consent,
      admin_approved_at,
      candidate_consent_at,
      declined_by,
      initiated_by,
      employer_consent,
      admin_notes,
      introduced_at,
      created_at,
      employer_profiles!contact_requests_employer_id_fkey (
        user_id,
        profiles:user_id (
          first_name,
          last_name
        )
      ),
      candidate_profiles!contact_requests_candidate_id_fkey (
        user_id,
        profiles:user_id (
          first_name,
          last_name
        )
      ),
      roles (
        title
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching introduction requests:', error)
  }

  const allRequests = (requests || []) as unknown as IntroductionRequest[]

  // Group: awaiting admin review first, then awaiting candidate, then introduced, then declined
  const pending = allRequests.filter((r) => r.status === 'pending')
  const isAwaitingConsent = (r: IntroductionRequest) =>
    r.status === 'approved' &&
    (r.initiated_by === 'candidate' ? r.employer_consent === 'pending' : r.candidate_consent === 'pending')
  const awaitingCandidate = allRequests.filter(isAwaitingConsent)
  const introduced = allRequests.filter((r) => r.status === 'introduced')
  const declined = allRequests.filter((r) => r.status === 'declined')
  const other = allRequests.filter(
    (r) =>
      !['pending', 'introduced', 'declined'].includes(r.status) &&
      !isAwaitingConsent(r),
  )
  const grouped = [
    ...pending,
    ...awaitingCandidate,
    ...introduced,
    ...declined,
    ...other,
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">
          Introductions
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review and manage introduction requests between employers and
          candidates.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#9B7B3C]/20 bg-[#9B7B3C]/5">
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-[#9B7B3C]" />
            <div>
              <p className="text-2xl font-bold text-white">{pending.length}</p>
              <p className="text-xs text-neutral-400">Awaiting Review</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {awaitingCandidate.length}
              </p>
              <p className="text-xs text-neutral-400">Awaiting Confirmation</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {introduced.length}
              </p>
              <p className="text-xs text-neutral-400">Introduced</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <XCircle className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {declined.length}
              </p>
              <p className="text-xs text-neutral-400">Declined</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      {grouped.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Handshake className="mb-3 h-10 w-10 text-neutral-600" />
            <p className="text-sm text-muted-foreground">
              No introduction requests yet. They will appear here when employers
              request introductions to candidates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {grouped.map((request) => {
            const employerName = request.employer_profiles?.profiles
              ? `${request.employer_profiles.profiles.first_name} ${request.employer_profiles.profiles.last_name}`
              : 'Unknown Employer'
            const candidateName = request.candidate_profiles?.profiles
              ? `${request.candidate_profiles.profiles.first_name} ${request.candidate_profiles.profiles.last_name}`
              : 'Unknown Candidate'
            const roleTitle = request.roles?.title || 'No role specified'

            return (
              <Card
                key={request.id}
                className={`border-border bg-card ${
                  request.status === 'pending'
                    ? 'border-l-2 border-l-[#9B7B3C]'
                    : ''
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left side: info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        {getStatusBadge(
                          request.status,
                          request.candidate_consent,
                          request.declined_by,
                          request.initiated_by,
                          request.employer_consent,
                        )}
                        <span className="text-xs text-neutral-500">
                          {request.initiated_by === 'candidate' ? 'Candidate interest' : 'Employer request'}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {formatDate(request.created_at)}
                        </span>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                          <p className="text-xs text-neutral-500">Employer</p>
                          <p className="text-sm font-medium text-white">
                            {employerName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Candidate</p>
                          <p className="text-sm font-medium text-white">
                            {candidateName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Role</p>
                          <p className="text-sm font-medium text-[#9B7B3C]">
                            {roleTitle}
                          </p>
                        </div>
                      </div>

                      {request.message && (
                        <div>
                          <p className="text-xs text-neutral-500">Message</p>
                          <p className="mt-0.5 text-sm text-neutral-300">
                            &ldquo;{request.message}&rdquo;
                          </p>
                        </div>
                      )}

                      {request.introduced_at && (
                        <p className="text-xs text-green-400">
                          Introduced on {formatDate(request.introduced_at)}
                        </p>
                      )}
                    </div>

                    {/* Right side: actions */}
                    <div className="w-full sm:w-64">
                      <IntroductionActions
                        requestId={request.id}
                        status={request.status}
                        candidateConsent={request.candidate_consent}
                        initiatedBy={request.initiated_by}
                        employerConsent={request.employer_consent}
                        employerUserId={
                          request.employer_profiles?.user_id || ''
                        }
                        candidateUserId={
                          request.candidate_profiles?.user_id || ''
                        }
                        employerName={employerName}
                        candidateName={candidateName}
                        roleTitle={roleTitle}
                        adminNotes={request.admin_notes}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
