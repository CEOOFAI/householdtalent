import Link from 'next/link'
import { Lock, Quote, ShieldCheck } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'
import { CandidateCard } from './candidate-card'
import type { PublicCandidate } from './types'

export const revalidate = 60

// Extract storage path from a Supabase public URL like
// https://<ref>.supabase.co/storage/v1/object/public/candidate-photos/<path>
function extractCandidatePhotoPath(raw: string): string | null {
  const m = raw.match(/\/storage\/v1\/object\/(?:public|sign)\/candidate-photos\/([^?]+)/)
  return m ? m[1] : null
}

async function resolvePhoto(raw: string | null | undefined, admin: ReturnType<typeof createAdminClient>): Promise<string | null> {
  if (!raw) return null
  if (raw.startsWith('https://image.pollinations.ai/')) return raw
  const path = extractCandidatePhotoPath(raw)
  if (!path) return raw // unknown host, leave as-is
  const { data } = await admin.storage.from('candidate-photos').createSignedUrl(path, 600)
  return data?.signedUrl ?? null
}

async function getActiveCandidates(): Promise<PublicCandidate[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []

  const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data, error } = await sb
    .from('candidate_profiles')
    .select('id, slug, salutation, full_name, headline, bio, roles, skills, languages, location, experience_years, photos, availability, public_listing_consent, status')
    .eq('status', 'active')
    .eq('public_listing_consent', true)
    .order('updated_at', { ascending: false })
    .limit(24)

  if (error) {
    console.error('candidates fetch failed:', error.message)
    return []
  }

  const admin = createAdminClient()

  return await Promise.all((data ?? []).map(async row => {
    const lastInitial = (row.full_name ?? '').split(' ').slice(-1)[0]?.charAt(0) ?? '?'
    const displayName = `${row.salutation ?? 'Mr.'} ${lastInitial}.`
    const rawPhoto = (row.photos ?? [])[0] ?? null
    const photo = await resolvePhoto(rawPhoto, admin)
    return {
      id: row.id,
      slug: row.slug,
      displayName,
      headline: row.headline ?? row.roles?.[0] ?? 'Household Professional',
      location: row.location ?? 'Available across Spain & UK',
      bio: row.bio ?? '',
      skills: (row.skills ?? []).slice(0, 3),
      experienceYears: row.experience_years ?? 0,
      languages: row.languages ?? [],
      photo,
      availability: humaniseAvailability(row.availability),
    }
  }))
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
            A selection of recent candidates
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            A small sample of the high-quality individuals available through Household Talent.
          </p>
          <p className="mt-2 text-sm text-[#9B7B3C]">
            Full access is provided once a role is submitted.
          </p>
        </div>

        {/* Profile Cards */}
        {candidates.length === 0 ? (
          <div className="mt-16 rounded-xl border border-neutral-800 bg-neutral-900/40 p-10 text-center">
            <Lock className="mx-auto mb-4 h-8 w-8 text-[#9B7B3C]/50" />
            <p className="text-neutral-400">
              Our active candidate roster is updated weekly.
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Submit a role to see introductions matched to your requirements.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map(c => (
              <CandidateCard key={c.id} candidate={c} />
            ))}
          </div>
        )}

        {/* Social Proof Strip */}
        <div className="mx-auto mt-20 max-w-2xl text-center">
          <Quote className="mx-auto mb-4 h-8 w-8 text-[#9B7B3C]/30" />
          <p className="font-heading text-lg italic text-neutral-300">
            &ldquo;The calibre of candidates was noticeably higher than traditional platforms.&rdquo;
          </p>
          <p className="mt-3 text-sm text-neutral-500">Private Client</p>
        </div>

        {/* Control Message */}
        <div className="mx-auto mt-16 max-w-xl rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 sm:p-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#9B7B3C]/10">
            <ShieldCheck className="h-5 w-5 text-[#9B7B3C]" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-white">
            Why you don&apos;t see everything
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            We prioritise quality over volume. Only relevant candidates are introduced based on your specific requirements.
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
