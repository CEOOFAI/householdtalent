import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Card, CardContent } from '@/components/ui/card'
import {
  Briefcase,
  MapPin,
  Clock,
  Crown,
  Lock,
  ArrowLeft,
  Calendar,
  CheckCircle,
} from 'lucide-react'
import type { Metadata } from 'next'
import { jsonLd } from '@/lib/utils'
import { SITE_URL } from '@/lib/site'

interface PageProps {
  params: Promise<{ id: string }>
}

interface PublicRoleDetail {
  id: string
  title: string
  role_type: string | null
  position_type: string | null
  location: string | null
  description: string | null
  start_date: string | null
  application_deadline: string | null
  listing_tier: string | null
  status: string
  created_at: string
}

function formatLocation(loc: string | null): string {
  if (!loc) return 'Location flexible'
  return loc
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

function formatPositionType(p: string | null): string {
  if (!p) return ''
  const map: Record<string, string> = {
    live_in: 'Live-in',
    live_out: 'Live-out',
    full_time: 'Full-time',
    part_time: 'Part-time',
  }
  return map[p] || p
}

function formatStartDate(d: string | null): string | null {
  if (!d) return null
  const parsed = new Date(d)
  if (isNaN(parsed.getTime())) return d
  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function publicSummary(text: string | null): string {
  if (!text) {
    return 'A discreet household role with a private family. Sign up to view full role details, salary expectations and household profile.'
  }
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= 320) return trimmed
  return trimmed.slice(0, 317).trimEnd() + '...'
}

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createSupabaseClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = getPublicClient()
  const { data: role } = await supabase
    .from('roles')
    .select('title, location, position_type, status, description')
    .eq('id', id)
    .single()

  if (!role || role.status !== 'active') {
    return { title: 'Role | HouseHoldTalent' }
  }

  const loc = formatLocation(role.location)
  const url = `${SITE_URL}/jobs/${id}`
  const description = role.description
    ? role.description.slice(0, 155).replace(/\s+\S*$/, '') + '...'
    : `${role.title} role currently open in ${loc}. Curated household staffing through HouseHoldTalent.`

  return {
    title: `${role.title}, ${loc} | HouseHoldTalent`,
    description,
    openGraph: {
      title: `${role.title} in ${loc}`,
      description,
      type: 'website',
      url,
      siteName: 'HouseHoldTalent',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${role.title} in ${loc}`,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = getPublicClient()

  const { data: role } = await supabase
    .from('roles')
    .select(
      'id, title, role_type, position_type, location, description, start_date, application_deadline, listing_tier, status, created_at',
    )
    .eq('id', id)
    .single<PublicRoleDetail>()

  if (!role || role.status !== 'active') {
    notFound()
  }

  const startDate = formatStartDate(role.start_date)
  const summary = publicSummary(role.description)

  // Schema.org JobPosting — gets the role into Google for Jobs
  const jobPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: role.title,
    description: role.description || `${role.title} role with a private household.`,
    datePosted: role.created_at,
    validThrough: role.application_deadline || (() => {
      const d = new Date(role.created_at)
      d.setDate(d.getDate() + 30)
      return d.toISOString()
    })(),
    employmentType: role.position_type === 'live_in' || role.position_type === 'full_time'
      ? 'FULL_TIME'
      : role.position_type === 'part_time'
        ? 'PART_TIME'
        : 'OTHER',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'HouseHoldTalent',
      sameAs: SITE_URL,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: formatLocation(role.location),
        addressCountry: ['gibraltar'].includes((role.location || '').toLowerCase())
          ? 'GI'
          : 'ES',
      },
    },
    directApply: false,
    industry: 'Private Household Staffing',
  }

  return (
    <main className="min-h-[80vh] py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(jobPostingJsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          All open roles
        </Link>

        <div className="mt-6">
          {role.listing_tier === 'ultra' && (
            <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              <Crown className="h-3 w-3" />
              Featured
            </span>
          )}
          <h1 className="font-heading text-3xl font-light leading-tight text-white sm:text-4xl">
            {role.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              {formatLocation(role.location)}
            </span>
            {role.position_type && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                {formatPositionType(role.position_type)}
              </span>
            )}
            {startDate && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                Starts {startDate}
              </span>
            )}
          </div>
        </div>

        {/* Public summary */}
        <Card className="mt-8 border-border bg-card">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="font-heading text-lg text-white">Role Overview</h2>
            <p className="text-sm leading-relaxed text-white/70 sm:text-base">
              {summary}
            </p>

            <div className="grid gap-3 border-t border-white/5 pt-4 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Salary on application
                  </p>
                  <p className="text-xs text-white/50">
                    Shared with verified candidates
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Full role brief
                  </p>
                  <p className="text-xs text-white/50">
                    Household profile, schedule, requirements
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign-up gate */}
        <Card className="mt-6 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6 sm:p-8">
            <h2 className="font-heading text-xl text-white sm:text-2xl">
              Interested in this role?
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Apply to join the network to view the full brief, salary range and
              request an introduction. Every candidate is personally reviewed.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Complimentary for accepted members
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Confidential, never listed publicly
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Direct introductions to private households
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/register/candidate"
                className="btn-gold rounded-md px-5 py-2.5 text-sm font-medium"
              >
                Apply to Join the Network
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-white/20 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
              >
                Already a member? Log in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Employer side */}
        <p className="mt-8 text-center text-xs text-white/40">
          Looking to hire instead?{' '}
          <Link href="/register/employer" className="text-primary hover:underline">
            Post a confidential role brief
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
