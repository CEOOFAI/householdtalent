'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldCheck, X, Award, FileText, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export type VerificationFields = {
  reference_status: 'pending' | 'in_progress' | 'verified'
  verification_notes: string | null
  gold_verified: boolean
  police_check_url: string | null
  police_check_uploaded_at: string | null
}

const REF_STATUS_OPTIONS: { value: VerificationFields['reference_status']; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'verified', label: 'Verified' },
]

export default function VerificationModal({
  candidateId,
  candidateName,
  initial,
  onClose,
}: {
  candidateId: string
  candidateName: string
  initial: VerificationFields
  onClose: () => void
}) {
  const router = useRouter()
  const [referenceStatus, setReferenceStatus] = useState(initial.reference_status)
  const [notes, setNotes] = useState(initial.verification_notes || '')
  const [goldVerified, setGoldVerified] = useState(initial.gold_verified)
  const [saving, setSaving] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/candidate-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: candidateId,
          reference_status: referenceStatus,
          verification_notes: notes,
          gold_verified: goldVerified,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        toast.error(j.error || 'Failed to save')
        setSaving(false)
        return
      }
      toast.success('Verification updated')
      router.refresh()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Network error')
      setSaving(false)
    }
  }

  async function viewPoliceCheck() {
    if (!initial.police_check_url) return
    setPreviewLoading(true)
    try {
      const res = await fetch(
        `/api/admin/police-check-url?candidate_id=${candidateId}`,
        { method: 'GET' },
      )
      const j = await res.json()
      if (res.ok && j.url) {
        window.open(j.url, '_blank', 'noopener,noreferrer')
      } else {
        toast.error(j.error || 'Could not open file')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Network error')
    } finally {
      setPreviewLoading(false)
    }
  }

  const policeCheckPresent = !!initial.police_check_url

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#9B7B3C]">
              Reference Verification
            </p>
            <h2 className="mt-1 font-heading text-xl font-light text-white sm:text-2xl">
              {candidateName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Reference status */}
        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Reference Status
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {REF_STATUS_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setReferenceStatus(o.value)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  referenceStatus === o.value
                    ? 'border-[#9B7B3C] bg-[#9B7B3C]/10 text-[#9B7B3C]'
                    : 'border-border bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            When set to Verified, a &ldquo;References Verified by HHT&rdquo; badge appears on the candidate&rsquo;s profile.
          </p>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label htmlFor="verification-notes" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Internal Notes (admin only)
          </label>
          <textarea
            id="verification-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Reference check outcomes, contact attempts, anything you want a future admin to see."
            className="mt-2 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:border-[#9B7B3C] focus:outline-none focus:ring-1 focus:ring-[#9B7B3C]"
          />
        </div>

        {/* Police check */}
        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-white">Police Check / DBS</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {policeCheckPresent
                    ? `Uploaded ${initial.police_check_uploaded_at ? new Date(initial.police_check_uploaded_at).toLocaleDateString('en-GB') : '—'}`
                    : 'Candidate has not uploaded a police check or DBS.'}
                </p>
              </div>
            </div>
            {policeCheckPresent && (
              <button
                type="button"
                onClick={viewPoliceCheck}
                disabled={previewLoading}
                className="flex shrink-0 items-center gap-1 rounded-md border border-border bg-muted px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-muted/70 disabled:opacity-50"
              >
                {previewLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <ExternalLink className="h-3 w-3" />
                )}
                Open
              </button>
            )}
          </div>

          <label className="mt-4 flex items-start gap-3 rounded-md border border-[#9B7B3C]/30 bg-[#9B7B3C]/5 p-3 transition-colors hover:bg-[#9B7B3C]/10">
            <input
              type="checkbox"
              checked={goldVerified}
              onChange={(e) => setGoldVerified(e.target.checked)}
              disabled={!policeCheckPresent}
              className="mt-1 h-4 w-4 accent-[#9B7B3C] disabled:opacity-40"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[#9B7B3C]" />
                <p className="text-sm font-medium text-white">HHT Gold Verified</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Tick once you have reviewed the candidate&rsquo;s police check or DBS and confirmed it is valid. Requires reference status = Verified.
                {!policeCheckPresent && ' Candidate must upload a police check first.'}
              </p>
            </div>
          </label>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-muted/70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || (goldVerified && referenceStatus !== 'verified')}
            className="flex items-center gap-2 rounded-md bg-[#9B7B3C] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#7B6535] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            Save Verification
          </button>
        </div>
      </div>
    </div>
  )
}
