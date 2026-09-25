'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { IntroductionRequestModal } from '@/components/introduction-request-modal'
import { ROLE_CATEGORIES, LOCATIONS, AVAILABILITY_LABELS } from '@/lib/constants'
import { Search, MapPin, Filter, Star, FileText, Loader2, UserPlus, ShieldCheck, Award } from 'lucide-react'
import type { CandidatePlanKey } from '@/lib/stripe/config'

interface CandidateResult {
  id: string
  user_id: string
  headline: string | null
  salutation: string | null
  location: string | null
  roles: string[]
  experience_years: number | null
  availability: string | null
  tier: CandidatePlanKey
  reference_status: 'pending' | 'in_progress' | 'verified' | null
  gold_verified: boolean | null
  profiles: {
    first_name: string | null
    last_name: string | null
  } | null
}

const TIER_ORDER: Record<CandidatePlanKey, number> = {
  premium: 0,
  free: 1,
}

function getInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

function getLocationLabel(value: string | null) {
  if (!value) return 'Not specified'
  const loc = LOCATIONS.find((l) => l.value === value)
  return loc?.label || value
}

export default function EmployerSearchPage() {
  const [candidates, setCandidates] = useState<CandidateResult[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<{
    id: string
    name: string
  } | null>(null)

  useEffect(() => {
    async function fetchCandidates() {
      setLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('candidate_profiles')
        .select(`
          id,
          user_id,
          headline,
          salutation,
          location,
          roles,
          experience_years,
          availability,
          tier,
          reference_status,
          gold_verified,
          profiles!candidate_profiles_user_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching candidates:', error)
      }

      setCandidates((data as unknown as CandidateResult[]) || [])
      setLoading(false)
    }

    fetchCandidates()
  }, [])

  const filtered = useMemo(() => {
    let results = [...candidates]

    // Search by headline or name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = results.filter((c) => {
        const name = `${c.profiles?.first_name} ${c.profiles?.last_name}`.toLowerCase()
        const headline = (c.headline || '').toLowerCase()
        return name.includes(q) || headline.includes(q)
      })
    }

    // Filter by role type
    if (roleFilter) {
      results = results.filter((c) =>
        c.roles?.some((r) => r === roleFilter)
      )
    }

    // Filter by location
    if (locationFilter) {
      results = results.filter((c) => c.location === locationFilter)
    }

    // Filter by availability
    if (availabilityFilter) {
      results = results.filter((c) => c.availability === availabilityFilter)
    }

    // Sort by tier: complete first, then recommended, then free
    results.sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])

    return results
  }, [candidates, searchQuery, roleFilter, locationFilter, availabilityFilter])

  function openIntroModal(candidateId: string, firstName: string, lastName: string) {
    setSelectedCandidate({
      id: candidateId,
      name: `${firstName} ${lastName}`,
    })
    setModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">
          Search Candidates
        </h1>
        <p className="mt-1 text-muted-foreground">
          Browse our curated directory of vetted domestic professionals.
        </p>
      </div>

      {/* Search & Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or headline..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
              />
            </div>

            {/* Role type filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full appearance-none rounded-md border border-neutral-700 bg-neutral-800/50 py-2 pl-10 pr-8 text-sm text-white outline-none transition-colors focus:border-[#9B7B3C] lg:w-52"
              >
                <option value="">All Roles</option>
                {ROLE_CATEGORIES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Location filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full appearance-none rounded-md border border-neutral-700 bg-neutral-800/50 py-2 pl-10 pr-8 text-sm text-white outline-none transition-colors focus:border-[#9B7B3C] lg:w-48"
              >
                <option value="">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability filter */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full appearance-none rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#9B7B3C] lg:w-48"
            >
              <option value="">Any Availability</option>
              {Object.entries(AVAILABILITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#9B7B3C]" />
          <span className="ml-3 text-sm text-neutral-400">Loading candidates...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Search className="mb-3 h-10 w-10 text-neutral-600" />
          <p className="text-sm text-muted-foreground">
            No candidates found matching your criteria. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-400">
            {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((candidate) => {
              // Anonymise on the public/employer browse: salutation + last initial only.
              // Real name only revealed once both sides have agreed to an introduction.
              const firstInitial = candidate.profiles?.first_name?.[0]?.toUpperCase() || ''
              const lastInitial = candidate.profiles?.last_name?.[0]?.toUpperCase() || ''
              const initials = (firstInitial + lastInitial) || 'C'
              const salutation = candidate.salutation || 'Mx'
              const anonName = lastInitial
                ? `${salutation}. ${lastInitial}.`
                : candidate.headline || 'Candidate'
              const firstName = candidate.profiles?.first_name || 'C'
              const lastName = candidate.profiles?.last_name || ''
              const isPremium = candidate.tier === 'premium'
              const isFree = candidate.tier === 'free'

              return (
                <Card
                  key={candidate.id}
                  className={`border-border bg-card transition-all ${
                    isPremium
                      ? 'border-[#9B7B3C]/40 shadow-[0_0_20px_rgba(212,160,18,0.1)]'
                      : 'opacity-75'
                  }`}
                >
                  <CardContent className="p-6">
                    {/* Tier + Verification badges */}
                    {(isPremium || candidate.gold_verified || candidate.reference_status === 'verified') && (
                      <div className="mb-3 flex flex-wrap items-center gap-1.5">
                        {isPremium && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#9B7B3C]/10 px-2 py-0.5 text-xs font-medium text-[#9B7B3C]">
                            <Star className="h-3 w-3" />
                            Premium
                          </span>
                        )}
                        {candidate.gold_verified ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#9B7B3C] bg-[#9B7B3C]/10 px-2 py-0.5 text-xs font-semibold text-[#9B7B3C]">
                            <Award className="h-3 w-3" />
                            HHT Gold Verified
                          </span>
                        ) : candidate.reference_status === 'verified' && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                            <ShieldCheck className="h-3 w-3" />
                            References Verified by HHT
                          </span>
                        )}
                      </div>
                    )}

                    {/* Avatar + Info */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isPremium
                            ? 'bg-[#9B7B3C]/20 text-[#9B7B3C]'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-medium text-white">
                          {candidate.headline || anonName}
                        </h3>
                        <p className="truncate text-xs text-[#9B7B3C]">
                          {anonName}
                        </p>
                        <p className="text-sm text-neutral-400">
                          {getLocationLabel(candidate.location)}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-4 space-y-2">
                      {candidate.roles?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {candidate.roles.slice(0, 2).map((role) => (
                            <span
                              key={role}
                              className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300"
                            >
                              {role}
                            </span>
                          ))}
                          {candidate.roles.length > 2 && (
                            <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-500">
                              +{candidate.roles.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        {candidate.experience_years && (
                          <span>{candidate.experience_years}+ years exp.</span>
                        )}
                        {candidate.availability && (
                          <span>
                            {AVAILABILITY_LABELS[candidate.availability] || candidate.availability}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Request Introduction button */}
                    <button
                      onClick={() => openIntroModal(candidate.id, anonName, '')}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#9B7B3C] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#9B7B3C]/90"
                    >
                      <UserPlus className="h-4 w-4" />
                      Request Introduction
                    </button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* Introduction Request Modal */}
      {selectedCandidate && (
        <IntroductionRequestModal
          candidateId={selectedCandidate.id}
          candidateName={selectedCandidate.name}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedCandidate(null)
          }}
        />
      )}
    </div>
  )
}
