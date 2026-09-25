import Link from 'next/link'
import type { Metadata } from 'next'
import { Lock, ShieldCheck } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { CandidateCard } from './candidate-card'
import type { PublicCandidate } from './types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'HHT Approved Candidates',
  description:
    'A small selection of HHT Approved household professionals, shared with consent. Full profiles are shared privately with registered employers through HHT-facilitated introductions.',
}

async function getActiveCandidates(): Promise<PublicCandidate[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []

  const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data, error } = await sb
    .from('candidate_profiles')
    .select('id, slug, salutation, full_name, headline, bio, roles, skills, languages, location, experience_years, availability')
    .eq('status', 'active')
    .eq('public_listing_consent', true)
    .order('updated_at', { ascending: false })
    .limit(24)

  // Throw rather than return [] so a database outage doesn't get cached as an
  // empty page; Vercel keeps serving the last good version instead.
  if (error) throw new Error(`candidates fetch failed: ${error.message}`)

  return (data ?? []).map(row => {
    const lastInitial = (row.full_name ?? '').split(' ').slice(-1)[0]?.charAt(0) ?? '?'
    const displayName = `${row.salutation ?? 'Mr.'} ${lastInitial}.`
    // Photos are never shown publicly: a CSS blur can be removed by anyone who
    // views the page source, so the original image would leak. Cards use the
    // initials placeholder instead.
    const photo: string | null = null
    return {
      id: row.id,
      slug: row.slug,
      displayName,
      headline: row.headline ?? row.roles?.[0] ?? 'Household Professional',
      location: row.location ?? 'Location on request',
      bio: truncate(row.bio ?? '', 180),
      skills: (row.skills ?? []).slice(0, 3),
      experienceYears: row.experience_years ?? 0,
      languages: row.languages ?? [],
      photo,
      availability: humaniseAvailability(row.availability),
    }
  })
}

function humaniseAvailability(value: string | null | undefined): string {
  if (!value) return 'Availability on request'
  if (value === 'immediately') return 'Available immediately'
  if (value === 'within_2_weeks') return 'Available within 2 weeks'
  if (value === 'within_1_month') return 'Available within 1 month'
  if (value === 'within_3_months') return 'Available within 3 months'
  return 'Availability on request'
}

export default async function CandidatesPage() {
  const candidates = await getActiveCandidates()

  return (
    <div className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
            HHT Approved Candidates
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            A small selection of HHT Approved profiles, shared with consent.
          </p>
          <p className="mt-2 text-sm text-[#9B7B3C]">
            HHT Approved means every profile is individually reviewed by our team before admission.
          </p>
        </div>

        {/* Profile Cards */}
        {candidates.length === 0 ? (
          <div className="mt-16 rounded-xl border border-neutral-800 bg-neutral-900/40 p-10 text-center">
            <Lock className="mx-auto mb-4 h-8 w-8 text-[#9B7B3C]/50" />
            <p className="text-neutral-400">
              Profiles are shared privately with registered employers.
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Submit a role brief to browse the HHT Approved network and request introductions.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map(c => (
              <CandidateCard key={c.id} candidate={c} />
            ))}
          </div>
        )}

        {/* Control Message */}
        <div className="mx-auto mt-16 max-w-xl rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 sm:p-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#9B7B3C]/10">
            <ShieldCheck className="h-5 w-5 text-[#9B7B3C]" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-white">
            Why you don&apos;t see everything
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            We prioritise discretion and quality over volume. Profiles are anonymised, and identifying details are released only with the candidate&apos;s consent through an HHT-facilitated introduction.
          </p>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Ready to find the right person?
          </h2>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register/employer"
              className="rounded-lg bg-[#9B7B3C] px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-[#7B6535]"
            >
              Submit a Role Brief
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-neutral-700 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Speak to Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max).replace(/\s+\S*$/, '')}…` : clean
}
