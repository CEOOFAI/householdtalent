import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

/**
 * Candidate showcase — a slow, two-row marquee of anonymised profile cards.
 *
 * NOTE: These cards are ILLUSTRATIVE ONLY. Replace with real, consenting,
 * anonymised network profiles before presenting them as actual candidates.
 *
 * - Rows scroll in opposite directions (reuses marquee-left / marquee-right
 *   keyframes from globals.css at a slower 90s pace) and pause on hover / focus.
 * - prefers-reduced-motion: the marquee is replaced by a static grid (CSS only).
 * - No photos: each card carries an abstract monogram crest.
 *
 * Usage:
 *   <CandidateShowcase />
 *   <CandidateShowcase
 *     eyebrow="The Network"
 *     heading={<>Private-service professionals, <span className="text-primary">quietly placed</span></>}
 *     description="A glimpse of the calibre of staff in the HHT network."
 *   />
 */

export interface ShowcaseProfile {
  role: string
  location: string
  summary: string
  monogram: string
}

export const SHOWCASE_PROFILES: ShowcaseProfile[] = [
  { role: 'Private PA', location: 'Marbella', monogram: 'PA', summary: '12+ years supporting UHNW principals across international residences.' },
  { role: 'Estate Manager', location: 'Southern Spain', monogram: 'EM', summary: 'Experienced managing large private estates, household teams, contractors and budgets.' },
  { role: 'Private Chef', location: 'London / International', monogram: 'PC', summary: 'Michelin-trained chef specialising in Mediterranean cuisine and private household service.' },
  { role: 'House Manager', location: 'Gibraltar', monogram: 'HM', summary: 'Luxury hospitality background with private household management experience.' },
  { role: 'Executive Assistant', location: 'Monaco', monogram: 'EA', summary: 'Senior EA experienced in complex travel, lifestyle management and confidential family-office support.' },
  { role: 'Butler', location: 'London / Sotogrande', monogram: 'B', summary: 'Formally trained butler with a decade of silver-service and residence management for private families.' },
  { role: 'Housekeeper', location: 'Costa del Sol', monogram: 'H', summary: 'Meticulous housekeeper experienced in fine fabrics, art care and multi-residence standards.' },
  { role: 'Chauffeur', location: 'Gibraltar / Marbella', monogram: 'C', summary: 'Security-aware chauffeur with advanced driving certification and discreet principal support.' },
  { role: 'Nanny', location: 'International', monogram: 'N', summary: 'Maternity-trained nanny with bilingual childcare and extensive travel experience with families.' },
  { role: 'Yacht Stewardess', location: 'Mediterranean', monogram: 'YS', summary: 'Chief stew background on private superyachts, from guest service to interior management.' },
]

function Crest({ letters }: { letters: string }) {
  return (
    <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="#9B7B3C" strokeOpacity="0.55" />
      <circle cx="24" cy="24" r="19" fill="#9B7B3C" fillOpacity="0.07" stroke="#9B7B3C" strokeOpacity="0.25" />
      <path d="M24 3.5v3M24 41.5v3M3.5 24h3M41.5 24h3" stroke="#9B7B3C" strokeOpacity="0.5" />
      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#B8995A"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize={letters.length > 1 ? 16 : 19}
        fontWeight={600}
        letterSpacing="0.5"
      >
        {letters}
      </text>
    </svg>
  )
}

function ShowcaseCard({ profile }: { profile: ShowcaseProfile }) {
  return (
    <article className="card-lift flex h-full w-[300px] shrink-0 flex-col gap-4 rounded-xl border border-white/10 bg-[#111111] p-5 sm:w-[340px]">
      <div className="flex items-center gap-3">
        <Crest letters={profile.monogram} />
        <p className="text-xs font-semibold uppercase leading-snug tracking-[0.14em] text-primary">
          {profile.role} · {profile.location}
        </p>
      </div>
      <p className="font-heading text-lg leading-snug text-white/85">{profile.summary}</p>
    </article>
  )
}

function MarqueeRow({
  profiles,
  direction,
}: {
  profiles: ShowcaseProfile[]
  direction: 'left' | 'right'
}) {
  return (
    <div className="flex overflow-hidden py-2">
      <div
        className={`${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'} marquee-slow flex gap-5 pr-5`}
      >
        {profiles.map((p) => (
          <ShowcaseCard key={p.role} profile={p} />
        ))}
        {/* Duplicate set for a seamless loop — hidden from assistive tech */}
        {profiles.map((p) => (
          <div key={`${p.role}-dup`} aria-hidden="true" className="flex">
            <ShowcaseCard profile={p} />
          </div>
        ))}
      </div>
    </div>
  )
}

interface CandidateShowcaseProps {
  eyebrow?: ReactNode
  heading?: ReactNode
  description?: ReactNode
  profiles?: ShowcaseProfile[]
  className?: string
}

export function CandidateShowcase({
  eyebrow = 'The HHT Network',
  heading = (
    <>
      Exceptional people, <span className="text-primary">discreetly introduced</span>
    </>
  ),
  description = 'An illustrative glimpse of the calibre of private-service professionals in our network. Identities are shared only with consent, at introduction.',
  profiles = SHOWCASE_PROFILES,
  className = '',
}: CandidateShowcaseProps) {
  const half = Math.ceil(profiles.length / 2)
  const rowA = profiles.slice(0, half)
  const rowB = profiles.slice(half)

  return (
    <section className={`relative overflow-hidden bg-background py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        )}
        {heading && (
          <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            {heading}
          </h2>
        )}
        {description && <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">{description}</p>}
      </div>

      {/* Animated marquee (hidden under reduced motion) */}
      <div
        className="marquee-pause mt-12 space-y-5 motion-reduce:hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        role="region"
        aria-label="Example network profiles"
      >
        <MarqueeRow profiles={rowA} direction="left" />
        <MarqueeRow profiles={rowB} direction="right" />
      </div>

      {/* Static grid for reduced motion */}
      <ul className="mx-auto mt-12 hidden max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 motion-reduce:grid [&_article]:w-full">
        {profiles.map((p) => (
          <li key={p.role}>
            <ShowcaseCard profile={p} />
          </li>
        ))}
      </ul>

      <div className="mt-12 flex justify-center px-4">
        <Link
          href="/register/employer"
          className="btn-gold inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm"
        >
          Explore the HHT Network
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  )
}
