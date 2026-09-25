'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Loader2, Clock } from 'lucide-react'
import { toast } from 'sonner'

export default function CandidateActions({
  id,
  status,
}: {
  id: string
  status: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function update(newStatus: string) {
    setLoading(true)

    let emailSent = false
    try {
      const res = await fetch('/api/admin/candidate-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: id, status: newStatus }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        toast.error(`Failed to update: ${j.error || res.statusText}`)
        setLoading(false)
        return
      }
      const j = await res.json()
      emailSent = !!j.email_sent
    } catch (err) {
      toast.error(`Failed to update: ${err instanceof Error ? err.message : 'network error'}`)
      setLoading(false)
      return
    }

    // When the admin accepts a candidate into the network, notify employers via
    // the API (server-side has the service-role key + can fan out across all
    // employers). The status update + candidate email is already done above.
    if (newStatus === 'active') {
      try {
        await fetch('/api/notify-employers/new-candidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidate_id: id }),
        })
      } catch {
        // Best-effort. Approval already succeeded.
      }
    }

    const message: Record<string, string> = {
      active: 'Candidate accepted, email sent and employers notified',
      waitlisted: 'Candidate waitlisted, email sent',
      suspended: 'Candidate declined, email sent',
    }
    const base = message[newStatus] || 'Status updated'
    toast.success(emailSent || newStatus === 'draft' || newStatus === 'pending_review'
      ? base
      : `${base} (email not delivered, check Resend setup)`)
    router.refresh()
    setLoading(false)
  }

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
  }

  if (status === 'active') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => update('waitlisted')}
          className="flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
        >
          <Clock className="h-3 w-3" />
          Waitlist
        </button>
        <button
          onClick={() => update('suspended')}
          className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
        >
          Suspend
        </button>
      </div>
    )
  }

  if (status === 'suspended') {
    return (
      <button
        onClick={() => update('active')}
        className="rounded-md border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 transition-colors hover:bg-green-500/20"
      >
        Reactivate
      </button>
    )
  }

  if (status === 'waitlisted') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => update('active')}
          className="flex items-center gap-1 rounded-md border border-[#9B7B3C]/40 bg-[#9B7B3C]/10 px-2.5 py-1 text-xs font-medium text-[#9B7B3C] transition-colors hover:bg-[#9B7B3C]/20"
        >
          <Check className="h-3 w-3" />
          Accept
        </button>
        <button
          onClick={() => update('suspended')}
          className="flex items-center gap-1 rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
        >
          <X className="h-3 w-3" />
          Decline
        </button>
      </div>
    )
  }

  // pending_review or draft
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => update('active')}
        className="flex items-center gap-1 rounded-md border border-[#9B7B3C]/40 bg-[#9B7B3C]/10 px-2.5 py-1 text-xs font-medium text-[#9B7B3C] transition-colors hover:bg-[#9B7B3C]/20"
      >
        <Check className="h-3 w-3" />
        Accept
      </button>
      <button
        onClick={() => update('waitlisted')}
        className="flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
      >
        <Clock className="h-3 w-3" />
        Waitlist
      </button>
      <button
        onClick={() => update('suspended')}
        className="flex items-center gap-1 rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
      >
        <X className="h-3 w-3" />
        Decline
      </button>
    </div>
  )
}
