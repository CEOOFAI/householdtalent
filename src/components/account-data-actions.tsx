'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function ExportDataButton() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch('/api/account/export')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Export failed')
      }
      const blob = await res.blob()
      const filename =
        res.headers.get('content-disposition')?.match(/filename="?([^"]+)"?/)?.[1]
        || `householdtalent-data-${new Date().toISOString().slice(0, 10)}.json`
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('Your data has been downloaded')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not export data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md border border-[#9B7B3C]/40 px-4 py-2 text-sm font-medium text-[#9B7B3C] transition-colors hover:bg-[#9B7B3C]/10 disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {loading ? 'Preparing…' : 'Download my data'}
    </button>
  )
}

export function DeleteAccountButton() {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (confirmText.trim().toUpperCase() !== 'DELETE') {
      toast.error('Type DELETE to confirm')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Delete failed')
      }
      toast.success('Account deleted. Goodbye.')
      // Hard navigate so client-side auth state is fully reset
      window.location.href = '/'
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not delete account')
      setLoading(false)
    }
  }

  if (!confirmOpen) {
    return (
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
      >
        <Trash2 className="h-4 w-4" />
        Delete my account
      </button>
    )
  }

  return (
    <div className="rounded-md border border-red-500/40 bg-red-500/5 p-4">
      <p className="text-sm font-medium text-white">This deletes everything.</p>
      <p className="mt-1 text-xs text-neutral-400">
        Your profile, photos, CV, introductions, and account will be permanently
        removed. This cannot be undone. Type{' '}
        <span className="font-mono font-semibold text-red-400">DELETE</span> to
        confirm.
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="DELETE"
        className="mt-3 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-red-500/40 focus:outline-none"
        disabled={loading}
      />
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading || confirmText.trim().toUpperCase() !== 'DELETE'}
          className="inline-flex items-center gap-2 rounded-md bg-red-500/80 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          {loading ? 'Deleting…' : 'Permanently delete'}
        </button>
        <button
          type="button"
          onClick={() => {
            setConfirmOpen(false)
            setConfirmText('')
          }}
          disabled={loading}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
