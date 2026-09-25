import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { Card, CardContent } from '@/components/ui/card'
import {
  Briefcase,
  MapPin,
  Clock,
  Crown,
  ArrowRight,
  Lock,
  Sparkles,
  CheckCircle,
  Calendar,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Open Roles',
  description:
    'Open household roles across Gibraltar, the Costa del Sol and internationally. HHT Approved members can browse suitable roles and request HHT-facilitated introductions.',
}

export const revalidate = 300 // refresh every 5 minutes

interface PublicRoleRow {
  id: string
  title: string
  role_type: string | null
  position_type: string | null
  location: string | null
  description: string | null
  start_date: string | null
  application_deadline: string | null
  closed_at: string | null
  listing_tier: string | null
  status: string
  created_at: string
}

const NEW_BADGE_DAYS = 7
const DEFAULT_DEADLINE_DAYS = 30
const RECENTLY_FILLED_WINDOW_DAYS = 30

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

function brief(text: string | null): string {
  if (!text) return 'A discreet household role. Sign up to view full details.'
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= 160) return trimmed
  return trimmed.slice(0, 157).trimEnd() + '...'
}

function formatPostedAgo(dateStr: string): string {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
  )
  if (days <= 0) return 'Posted today'
  if (days === 1) return 'Posted yesterday'
  if (days < 7) return `Posted ${days} days ago`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `Posted ${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }
  const months = Math.floor(days / 30)
  return `Posted ${months} ${months === 1 ? 'month' : 'months'} ago`
}

function effectiveDeadline(role: PublicRoleRow): Date {
  if (role.application_deadline) return new Date(role.application_deadline)
  const created = new Date(role.created_at)
  return new Date(
    created.getTime() + DEFAULT_DEADLINE_DAYS * 24 * 60 * 60 * 1000,
  )
}

function daysRemaining(role: PublicRoleRow): number {
  const ms = effectiveDeadline(role).getTime() - Date.now()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

function deadlineLabel(role: PublicRoleRow): {
  text: string
  tone: 'urgent' | 'warning' | 'normal'
} {
  const days = daysRemaining(role)
  if (days <= 0) return { text: 'Closing today', tone: 'urgent' }
  if (days === 1) return { text: '1 day left', tone: 'urgent' }
  if (days <= 3) return { text: `${days} days left`, tone: 'urgent' }
  if (days <= 7) return { text: `${days} days left`, tone: 'warning' }
  return { text: `${days} days left`, tone: 'normal' }
}

function isNew(role: PublicRoleRow): boolean {
  const ageDays =
    (Date.now() - new Date(role.created_at).getTime()) /
    (1000 * 60 * 60 * 24)
  return ageDays <= NEW_BADGE_DAYS
}

function RoleCard({ role, closed = false }: { role: PublicRoleRow; closed?: boolean }) {
  const newFlag = !closed && isNew(role)
  const deadline = !closed ? deadlineLabel(role) : null
  const toneClass =
    deadline?.tone === 'urgent'
      ? 'bg-red-500/10 text-red-400'
      : deadline?.tone === 'warning'
        ? 'bg-amber-500/10 text-amber-400'
        : 'bg-white/5 text-white/60'

  return (
    <Link
      href={closed ? '/jobs' : `/jobs/${role.id}`}
      className={`group block ${closed ? 'pointer-events-none' : ''}`}
    >
      <Card
        className={`h-full border-border bg-card transition-all ${closed ? 'opacity-60' : 'hover:border-primary/40 hover:shadow-lg'}`}
      >
        <CardContent className="flex h-full flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-lg text-white transition-colors group-hover:text-primary">
                  {role.title}
                </h3>
                {newFlag && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    <Sparkles className="h-3 w-3" />
                    New
                  </span>
                )}
                {role.listing_tier === 'ultra' && !closed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    <Crown className="h-3 w-3" />
                    Featured
                  </span>
                )}
                {closed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-green-400">
                    <CheckCircle className="h-3 w-3" />
                    Filled
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-white/40">
                {formatPostedAgo(role.created_at)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-white/60">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {formatLocation(role.location)}
            </span>
            {role.position_type && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatPositionType(role.position_type)}
              </span>
            )}
          </div>

          <p className="text-sm text-white/70">{brief(role.description)}</p>

          <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
            {!closed ? (
              <>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${toneClass}`}
                >
                  <Calendar className="h-3 w-3" />
                  {deadline?.text}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-transform group-hover:translate-x-0.5">
                  View role
                  <ArrowRight className="h-3 w-3" />
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1 text-xs text-white/40">
                  <Lock className="h-3 w-3" />
                  Closed to applications
                </span>
                <span className="text-xs text-white/30">
                  {role.closed_at
                    ? formatPostedAgo(role.closed_at)
                    : 'Recently filled'}
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default async function JobsPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClient(url!, key!, { auth: { autoRefreshToken: false, persistSession: false } })

  const { data: roles, error } = await supabase
    .from('roles')
    .select(
      'id, title, role_type, position_type, location, description, start_date, application_deadline, closed_at, listing_tier, status, created_at',
    )
    .in('status', ['active', 'closed'])
    .order('created_at', { ascending: false })

  // If the database can't be reached, fail the render so Vercel keeps serving
  // the last good cached page instead of caching an empty "no roles" page.
  if (error) throw new Error(`jobs fetch failed: ${error.message}`)

  const all = (roles || []) as PublicRoleRow[]

  // Filter out expired (deadline passed) active roles
  const liveActive = all.filter(
    (r) => r.status === 'active' && daysRemaining(r) > 0,
  )

  // Closed within recently-filled window
  const cutoff = Date.now() - RECENTLY_FILLED_WINDOW_DAYS * 24 * 60 * 60 * 1000
  const recentlyFilled = all.filter((r) => {
    if (r.status !== 'closed') return false
    const closedAt = r.closed_at
      ? new Date(r.closed_at).getTime()
      : new Date(r.created_at).getTime()
    return closedAt >= cutoff
  })

  const tierOrder: Record<string, number> = { ultra: 0, priority: 1, standard: 2 }
  liveActive.sort(
    (a, b) =>
      (tierOrder[a.listing_tier || 'standard'] ?? 3) -
      (tierOrder[b.listing_tier || 'standard'] ?? 3),
  )

  const newRoles = liveActive.filter((r) => isNew(r))
  const otherActive = liveActive.filter((r) => !isNew(r))

  return (
    <main className="min-h-[80vh]">
      {/* Header */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-block rounded-full border border-primary/40 bg-black/40 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] font-medium uppercase tracking-widest text-primary sm:text-xs">
              Network Members Only
            </span>
          </div>
          <h1 className="font-heading text-3xl font-light leading-tight text-white sm:text-4xl lg:text-5xl">
            Open Roles
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/60 sm:text-base">
            Active opportunities within the network. HHT Approved members can
            view full details and request an introduction. Access by referral,
            recommendation or application.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register/candidate"
              className="btn-gold rounded-md px-5 py-2.5 text-sm font-medium"
            >
              Apply to Join the Network
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-md border border-white/20 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-14">
          {/* New This Week */}
          {newRoles.length > 0 && (
            <div>
              <div className="mb-5 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-2xl text-white">New This Week</h2>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                  {newRoles.length}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {newRoles.map((r) => (
                  <RoleCard key={r.id} role={r} />
                ))}
              </div>
            </div>
          )}

          {/* Available Now */}
          {otherActive.length > 0 && (
            <div>
              <div className="mb-5 flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-2xl text-white">Available Now</h2>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/70">
                  {otherActive.length}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {otherActive.map((r) => (
                  <RoleCard key={r.id} role={r} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state for live roles */}
          {liveActive.length === 0 && (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center py-16 text-center">
                <Briefcase className="mb-3 h-10 w-10 text-neutral-600" />
                <p className="text-sm text-muted-foreground">
                  No active roles right now. New positions are added regularly.
                </p>
                <Link
                  href="/register/candidate"
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  Apply to join the network and browse new roles as they
                  are added.
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Recently Filled */}
          {recentlyFilled.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <h2 className="font-heading text-2xl text-white">Recently Filled</h2>
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                  {recentlyFilled.length}
                </span>
              </div>
              <p className="mb-5 text-sm text-white/50">
                Roles recently filled through the network. A snapshot of the
                households we work with.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {recentlyFilled.map((r) => (
                  <RoleCard key={r.id} role={r} closed />
                ))}
              </div>
            </div>
          )}

          {/* Final CTA */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center sm:p-8">
            <h3 className="font-heading text-xl text-white sm:text-2xl">
              Don&apos;t see the right role?
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">
              Some roles are shared privately and never reach this page. Apply
              to join the network to browse suitable roles and request
              introductions.
            </p>
            <Link
              href="/register/candidate"
              className="btn-gold mt-5 inline-block rounded-md px-5 py-2.5 text-sm font-medium"
            >
              Apply to Join the Network
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
