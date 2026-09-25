'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, X, Loader2 } from 'lucide-react'

export function ConsentActions({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'accepted' | 'declined' | null>(null)

  async function handle(decision: 'accepted' | 'declined') {
    setLoading(decision)
    try {
      const res = await fetch('/api/intro-consent', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, decision }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update')

      if (decision === 'accepted') {
        toast.success('Introduction confirmed. We will be in touch shortly.')
      } else {
        toast.success('Thanks for letting us know.')
      }
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handle('accepted')}
        disabled={loading !== null}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#9B7B3C] px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#9B7B3C]/90 disabled:opacity-50"
      >
        {loading === 'accepted' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        Yes, introduce me
      </button>
      <button
        onClick={() => handle('declined')}
        disabled={loading !== null}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-50"
      >
        {loading === 'declined' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <X className="h-4 w-4" />
        )}
        Not this one
      </button>
    </div>
  )
}
