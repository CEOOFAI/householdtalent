'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { X, Send, Loader2 } from 'lucide-react'

interface Role {
  id: string
  title: string
  status: string
}

interface IntroductionRequestModalProps {
  candidateId: string
  candidateName: string
  isOpen: boolean
  onClose: () => void
}

export function IntroductionRequestModal({
  candidateId,
  candidateName,
  isOpen,
  onClose,
}: IntroductionRequestModalProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setSelectedRoleId('')
      setMessage('')
      setSuccess(false)
      return
    }

    async function fetchRoles() {
      setLoadingRoles(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoadingRoles(false)
        return
      }

      const { data: employer } = await supabase
        .from('employer_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!employer) {
        setLoadingRoles(false)
        return
      }

      const { data } = await supabase
        .from('roles')
        .select('id, title, status')
        .eq('employer_id', employer.id)
        .in('status', ['active', 'pending_review'])
        .order('created_at', { ascending: false })

      setRoles(data || [])
      if (data && data.length > 0) {
        setSelectedRoleId(data[0].id)
      }
      setLoadingRoles(false)
    }

    fetchRoles()
  }, [isOpen])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedRoleId) {
      toast.error('Please select a role')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/introduction-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: candidateId,
          role_id: selectedRoleId,
          message: message.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to submit request')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative mx-4 w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {success ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-white">
              Request Sent
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              We&apos;ll review your request and be in touch within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <h2 className="pr-8 font-heading text-xl font-semibold text-white">
              Request Introduction to{' '}
              <span className="text-primary">{candidateName}</span>
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Select a role and optionally include a message.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Role selection */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                  For which role?
                </label>
                {loadingRoles ? (
                  <div className="flex h-9 items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 text-sm text-neutral-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading roles...
                  </div>
                ) : roles.length === 0 ? (
                  <p className="rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-400">
                    No active roles found. Submit a role brief first.
                  </p>
                ) : (
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="h-9 w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 text-sm text-white outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Optional message */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-300">
                    Message <span className="text-neutral-500">(optional)</span>
                  </label>
                  <span
                    className={`text-xs ${
                      message.length > 200
                        ? 'text-red-400'
                        : 'text-neutral-500'
                    }`}
                  >
                    {message.length}/200
                  </span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                  placeholder="Tell us why this candidate is a good fit..."
                  rows={3}
                  maxLength={200}
                  className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || roles.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#9B7B3C] px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#9B7B3C]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Request Introduction
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
