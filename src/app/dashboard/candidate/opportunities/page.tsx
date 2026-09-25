'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { ROLE_CATEGORIES, LOCATIONS } from '@/lib/constants'
import { Briefcase, MapPin, Filter, Loader2, Clock, Send, CheckCircle, Banknote } from 'lucide-react'
import { toast } from 'sonner'
import type { GeneratedBrief } from '@/types'

interface RoleResult {
  id: string
  title: string
  role_type: string
  position_type: string
  location: string
  salary_min: number | null
  salary_max: number | null
  salary_band: string | null
  description: string | null
  listing_tier: string
  generated_brief: GeneratedBrief | null
  start_date: string | null
  created_at: string
}

function formatSalary(role: RoleResult): string {
  if (role.salary_band) return role.salary_band
  const { salary_min: min, salary_max: max } = role
  if (!min && !max) return 'Negotiable'
  if (min && max) return `£${min.toLocaleString()} - £${max.toLocaleString()} p.a.`
  if (min) return `From £${min.toLocaleString()} p.a.`
  return `Up to £${max!.toLocaleString()} p.a.`
}

function getLocationLabel(value: string) {
  const loc = LOCATIONS.find((l) => l.value === value)
  return loc?.label || value
}

function getBriefPreview(role: RoleResult): string {
  if (role.description) {
    const sentences = role.description.split(/[.!?]+/).filter(Boolean)
    return sentences.slice(0, 2).join('. ').trim() + '.'
  }
  if (role.generated_brief?.role_overview) {
    const sentences = role.generated_brief.role_overview.split(/[.!?]+/).filter(Boolean)
    return sentences.slice(0, 2).join('. ').trim() + '.'
  }
  return 'No description available.'
}

export default function BrowseOpportunitiesPage() {
  const [roles, setRoles] = useState<RoleResult[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [expressedInterest, setExpressedInterest] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [messageForRole, setMessageForRole] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function fetchRoles() {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('roles')
        .select('id, title, role_type, position_type, location, salary_min, salary_max, salary_band, description, listing_tier, generated_brief, start_date, created_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching roles:', error)
      }

      // Sort by tier: ultra first, then priority, then standard
      const tierOrder: Record<string, number> = { ultra: 0, priority: 1, standard: 2 }
      const sorted = (data || []).sort((a, b) =>
        (tierOrder[a.listing_tier] ?? 3) - (tierOrder[b.listing_tier] ?? 3)
      )

      setRoles(sorted as RoleResult[])

      // Check which roles user already expressed interest in
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: candidateProfile } = await supabase
          .from('candidate_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (candidateProfile) {
          const { data: existing } = await supabase
            .from('contact_requests')
            .select('role_id')
            .eq('candidate_id', candidateProfile.id)

          if (existing) {
            setExpressedInterest(new Set(existing.map(e => e.role_id).filter(Boolean)))
          }
        }
      }

      setLoading(false)
    }

    fetchRoles()
  }, [])

  const filtered = useMemo(() => {
    let results = [...roles]
    if (roleFilter) {
      results = results.filter(r => r.role_type === roleFilter)
    }
    if (locationFilter) {
      results = results.filter(r => r.location === locationFilter)
    }
    return results
  }, [roles, roleFilter, locationFilter])

  async function handleExpressInterest(roleId: string) {
    setSubmitting(roleId)
    try {
      const res = await fetch('/api/introduction-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role_id: roleId,
          message: message || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit')
      }

      setExpressedInterest(prev => new Set([...prev, roleId]))
      setMessageForRole(null)
      setMessage('')
      toast.success("Interest submitted. Track it in your Introductions tab.", {
        duration: 6000,
        action: {
          label: 'View',
          onClick: () => {
            window.location.href = '/dashboard/candidate/introductions'
          },
        },
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Browse Opportunities</h1>
        <p className="mt-1 text-muted-foreground">Explore available roles from our private network of employers.</p>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full appearance-none rounded-md border border-neutral-700 bg-neutral-800/50 py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-[#9B7B3C]"
              >
                <option value="">All Role Types</option>
                {ROLE_CATEGORIES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full appearance-none rounded-md border border-neutral-700 bg-neutral-800/50 py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-[#9B7B3C]"
              >
                <option value="">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#9B7B3C]" />
          <span className="ml-3 text-sm text-neutral-400">Loading opportunities...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Briefcase className="mb-3 h-10 w-10 text-neutral-600" />
          <p className="text-sm text-muted-foreground">No opportunities available right now. Check back soon.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-400">{filtered.length} opportunit{filtered.length !== 1 ? 'ies' : 'y'} available</p>
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((role) => {
              const isPremium = role.listing_tier === 'ultra' || role.listing_tier === 'priority'
              const alreadyExpressed = expressedInterest.has(role.id)

              return (
                <Card
                  key={role.id}
                  className={`border-border bg-card transition-all ${
                    isPremium ? 'border-[#9B7B3C]/30 shadow-[0_0_15px_rgba(212,160,18,0.08)]' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    {/* Tier badge */}
                    {isPremium && (
                      <span className="mb-3 inline-block rounded-full bg-[#9B7B3C]/10 px-2 py-0.5 text-xs font-medium text-[#9B7B3C]">
                        {role.listing_tier === 'ultra' ? 'Featured' : 'Priority'}
                      </span>
                    )}

                    {/* Title + Role type */}
                    <h3 className="text-lg font-medium text-white">{role.title || role.role_type}</h3>

                    {/* Details */}
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-neutral-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />{getLocationLabel(role.location)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Banknote className="h-3.5 w-3.5" />{formatSalary(role)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />{role.position_type?.replace('_', '-')}
                      </span>
                    </div>

                    {/* Brief preview */}
                    <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                      {getBriefPreview(role)}
                    </p>

                    {/* Express Interest */}
                    {alreadyExpressed ? (
                      <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
                        <CheckCircle className="h-4 w-4" />Interest expressed
                      </div>
                    ) : messageForRole === role.id ? (
                      <div className="mt-4 space-y-3">
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                          placeholder="Optional message (why you're a great fit)..."
                          maxLength={200}
                          rows={2}
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-[#9B7B3C]"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-neutral-500">{message.length}/200</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setMessageForRole(null); setMessage(''); }}
                              className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleExpressInterest(role.id)}
                              disabled={submitting === role.id}
                              className="flex items-center gap-1 rounded-lg bg-[#9B7B3C] px-4 py-1.5 text-sm font-medium text-black hover:bg-[#7B6535] disabled:opacity-50"
                            >
                              {submitting === role.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setMessageForRole(role.id)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#9B7B3C] px-4 py-2 text-sm font-medium text-black hover:bg-[#7B6535]"
                      >
                        <Send className="h-4 w-4" />Express Interest
                      </button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
