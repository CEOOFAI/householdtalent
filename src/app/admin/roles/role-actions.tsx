'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function RoleActions({
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
    const supabase = createClient()
    const { error } = await supabase
      .from('roles')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      toast.error(`Failed: ${error.message}`)
    } else {
      toast.success(
        newStatus === 'active'
          ? 'Role approved and live'
          : newStatus === 'closed'
          ? 'Role closed'
          : 'Role updated'
      )
      router.refresh()
    }
    setLoading(false)
  }

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
  }

  if (status === 'active') {
    return (
      <button
        onClick={() => update('closed')}
        className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
      >
        Close
      </button>
    )
  }

  if (status === 'closed') {
    return (
      <button
        onClick={() => update('active')}
        className="rounded-md border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 transition-colors hover:bg-green-500/20"
      >
        Reopen
      </button>
    )
  }

  // pending_review or draft
  return (
    <div className="flex gap-2">
      <button
        onClick={() => update('active')}
        className="flex items-center gap-1 rounded-md border border-[#9B7B3C]/40 bg-[#9B7B3C]/10 px-2.5 py-1 text-xs font-medium text-[#9B7B3C] transition-colors hover:bg-[#9B7B3C]/20"
      >
        <Check className="h-3 w-3" />
        Approve
      </button>
      <button
        onClick={() => update('closed')}
        className="flex items-center gap-1 rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
      >
        <X className="h-3 w-3" />
        Reject
      </button>
    </div>
  )
}
