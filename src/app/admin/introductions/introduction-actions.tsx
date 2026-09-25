'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Check, X, Loader2, Save, Send } from 'lucide-react'
import type { ContactRequestStatus } from '@/types'

interface IntroductionActionsProps {
  requestId: string
  status: ContactRequestStatus
  candidateConsent: 'pending' | 'accepted' | 'declined' | null
  employerUserId: string
  candidateUserId: string
  employerName: string
  candidateName: string
  roleTitle: string
  adminNotes: string | null
}

export function IntroductionActions({
  requestId,
  status: initialStatus,
  candidateConsent: initialConsent,
  employerUserId,
  candidateUserId,
  employerName,
  candidateName,
  roleTitle,
  adminNotes: initialNotes,
}: IntroductionActionsProps) {
  const [status, setStatus] = useState(initialStatus)
  const [consent, setConsent] = useState(initialConsent)
  const [loading, setLoading] = useState<'approve' | 'decline' | null>(null)
  const [notes, setNotes] = useState(initialNotes || '')
  const [savingNotes, setSavingNotes] = useState(false)

  async function handleAction(action: 'approve' | 'decline') {
    setLoading(action)
    const supabase = createClient()

    try {
      if (action === 'approve') {
        // Step 2: Admin approves. Move to candidate consent stage.
        const { error } = await supabase
          .from('contact_requests')
          .update({
            status: 'approved',
            candidate_consent: 'pending',
            admin_approved_at: new Date().toISOString(),
            admin_notes: notes || null,
          })
          .eq('id', requestId)
          .eq('status', 'pending')

        if (error) throw error

        // Notify candidate that an employer wants to be introduced
        await supabase.from('notifications').insert({
          user_id: candidateUserId,
          type: 'introduction_request',
          title: 'New Introduction Request',
          body: `An employer is interested in you for the ${roleTitle} role. Please review and let us know if you would like to be introduced.`,
          action_url: '/dashboard/candidate/introductions',
        })

        // Notify employer that the request is in motion (not yet introduced)
        await supabase.from('notifications').insert({
          user_id: employerUserId,
          type: 'introduction_pending_candidate',
          title: 'Introduction Request Approved',
          body: `Your request to be introduced for the ${roleTitle} role has been approved. We are now confirming with the candidate and will be in touch.`,
          action_url: '/dashboard/employer/introductions',
        })

        setStatus('approved')
        setConsent('pending')
        toast.success('Approved. Candidate has been asked to confirm.')
      } else {
        // Admin declines outright. Candidate never sees it.
        const { error } = await supabase
          .from('contact_requests')
          .update({
            status: 'declined',
            declined_by: 'admin',
            admin_notes: notes || null,
          })
          .eq('id', requestId)

        if (error) throw error

        await supabase.from('notifications').insert({
          user_id: employerUserId,
          type: 'introduction_declined',
          title: 'Introduction Request Update',
          body: `Your introduction request for the ${roleTitle} role could not be progressed. Please contact us if you would like more information.`,
          action_url: '/dashboard/employer/introductions',
        })

        setStatus('declined')
        toast.success('Request declined and employer notified')
      }
    } catch (err) {
      toast.error('Failed to update request')
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  async function saveNotes() {
    setSavingNotes(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('contact_requests')
      .update({ admin_notes: notes || null })
      .eq('id', requestId)

    if (error) {
      toast.error('Failed to save notes')
    } else {
      toast.success('Notes saved')
    }
    setSavingNotes(false)
  }

  const awaitingCandidate = status === 'approved' && consent === 'pending'

  return (
    <div className="space-y-3">
      {/* Admin Notes */}
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-400">
          Admin Notes
        </label>
        <div className="flex gap-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={saveNotes}
            placeholder="Internal notes..."
            rows={2}
            className="flex-1 resize-none rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50"
          />
          <button
            onClick={saveNotes}
            disabled={savingNotes}
            className="self-end rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white disabled:opacity-50"
            title="Save notes"
          >
            {savingNotes ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Action buttons: only when admin has not yet decided */}
      {status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('approve')}
            disabled={loading !== null}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#9B7B3C] px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-[#9B7B3C]/90 disabled:opacity-50"
          >
            {loading === 'approve' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Approve & Send to Candidate
          </button>
          <button
            onClick={() => handleAction('decline')}
            disabled={loading !== null}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            {loading === 'decline' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
            Decline
          </button>
        </div>
      )}

      {/* Awaiting candidate confirmation */}
      {awaitingCandidate && (
        <div className="rounded-lg bg-[#9B7B3C]/10 px-3 py-2 text-center text-xs font-medium text-[#9B7B3C]">
          Awaiting candidate confirmation
        </div>
      )}

      {/* Final states */}
      {status === 'introduced' && (
        <div className="rounded-lg bg-green-500/10 px-3 py-2 text-center text-xs font-medium text-green-400">
          <Check className="mr-1 inline h-3.5 w-3.5" />
          Introduced
        </div>
      )}
      {status === 'declined' && (
        <div className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs font-medium text-red-400">
          Declined
        </div>
      )}
    </div>
  )
}
