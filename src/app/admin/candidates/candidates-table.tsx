'use client'

import { useMemo, useState } from 'react'
import { Search, Users, Award, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import CandidateActions from './candidate-actions'
import VerificationModal from './verification-modal'

export type CandidateRow = {
  id: string
  headline: string | null
  location: string | null
  tier: string
  status: string
  reference_status: 'pending' | 'in_progress' | 'verified' | null
  verification_notes: string | null
  gold_verified: boolean | null
  police_check_url: string | null
  police_check_uploaded_at: string | null
  profiles: { first_name: string; last_name: string; email: string } | null
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending_review', label: 'Applications Pending Review' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'active', label: 'Active (Accepted)' },
  { value: 'draft', label: 'Draft' },
  { value: 'suspended', label: 'Declined / Suspended' },
]

function VerificationBadge({ row }: { row: CandidateRow }) {
  if (row.gold_verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#9B7B3C] bg-[#9B7B3C]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#9B7B3C]">
        <Award className="h-3 w-3" />
        Gold
      </span>
    )
  }
  if (row.reference_status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
        <ShieldCheck className="h-3 w-3" />
        Verified
      </span>
    )
  }
  if (row.reference_status === 'in_progress') {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-300">
        In progress
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
      Pending
    </span>
  )
}

export function CandidatesTable({ rows }: { rows: CandidateRow[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [verifying, setVerifying] = useState<CandidateRow | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((c) => {
      if (status !== 'all' && c.status !== status) return false
      if (!q) return true
      const name = c.profiles
        ? `${c.profiles.first_name} ${c.profiles.last_name}`.toLowerCase()
        : ''
      const email = c.profiles?.email?.toLowerCase() || ''
      const headline = c.headline?.toLowerCase() || ''
      const location = c.location?.toLowerCase() || ''
      return (
        name.includes(q)
        || email.includes(q)
        || headline.includes(q)
        || location.includes(q)
      )
    })
  }, [rows, query, status])

  return (
    <>
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search candidates by name, headline, location, or email…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-border bg-muted py-2 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground focus:border-[#9B7B3C] focus:outline-none focus:ring-1 focus:ring-[#9B7B3C]"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-white focus:border-[#9B7B3C] focus:outline-none focus:ring-1 focus:ring-[#9B7B3C]"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Showing {filtered.length} of {rows.length}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Name</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Headline</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Location</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Tier</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Verification</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No candidates match these filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="border-b border-border">
                      <td className="p-4 text-sm text-white">
                        {c.profiles ? `${c.profiles.first_name} ${c.profiles.last_name}` : '—'}
                        <div className="text-xs text-muted-foreground">
                          {c.profiles?.email || '—'}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {c.headline || '—'}
                      </td>
                      <td className="p-4 text-sm capitalize text-muted-foreground">
                        {c.location || '—'}
                      </td>
                      <td className="p-4 text-sm capitalize text-[#9B7B3C]">
                        {c.tier}
                      </td>
                      <td className="p-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            c.status === 'active'
                              ? 'bg-green-500/10 text-green-400'
                              : c.status === 'pending_review'
                                ? 'bg-amber-500/10 text-amber-400'
                                : c.status === 'waitlisted'
                                  ? 'bg-blue-500/10 text-blue-400'
                                  : c.status === 'suspended'
                                    ? 'bg-red-500/10 text-red-400'
                                    : 'bg-neutral-500/10 text-neutral-400'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <VerificationBadge row={c} />
                          <button
                            type="button"
                            onClick={() => setVerifying(c)}
                            className="text-[11px] font-medium text-[#9B7B3C] hover:underline"
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <CandidateActions id={c.id} status={c.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {verifying && (
        <VerificationModal
          candidateId={verifying.id}
          candidateName={
            verifying.profiles
              ? `${verifying.profiles.first_name} ${verifying.profiles.last_name}`
              : 'Candidate'
          }
          initial={{
            reference_status: verifying.reference_status || 'pending',
            verification_notes: verifying.verification_notes,
            gold_verified: !!verifying.gold_verified,
            police_check_url: verifying.police_check_url,
            police_check_uploaded_at: verifying.police_check_uploaded_at,
          }}
          onClose={() => setVerifying(null)}
        />
      )}
    </>
  )
}
