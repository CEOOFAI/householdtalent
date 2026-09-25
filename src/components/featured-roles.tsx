import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, ArrowRight, Lock, Briefcase } from 'lucide-react'

interface FeaturedRoleRow {
  id: string
  title: string
  position_type: string | null
  location: string | null
  description: string | null
  listing_tier: string | null
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

function brief(text: string | null): string {
  if (!text) return 'A discreet household role with a private family.'
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= 120) return trimmed
  return trimmed.slice(0, 117).trimEnd() + '...'
}

function formatPostedAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
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

export async function FeaturedRoles() {
  // Visitors are anonymous and RLS hides roles from the anon key, so read the
  // (public, non-sensitive) listing columns with the service role.
  const supabase = createAdminClient()
  const { data: roles } = await supabase
    .from('roles')
    .select(
      'id, title, position_type, location, description, listing_tier, created_at',
    )
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6)

  const tierOrder: Record<string, number> = { ultra: 0, priority: 1, standard: 2 }
  const rows = ((roles || []) as FeaturedRoleRow[])
    .sort(
      (a, b) =>
        (tierOrder[a.listing_tier || 'standard'] ?? 3) -
        (tierOrder[b.listing_tier || 'standard'] ?? 3),
    )
    .slice(0, 3)

  if (rows.length === 0) {
    return null
  }

  return (
    <section className="relative bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <span className="inline-block rounded-full border border-primary/40 bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-primary">
            Currently Hiring
          </span>
          <h2 className="mt-3 font-heading text-3xl font-light text-white sm:text-4xl">
            Open Roles
          </h2>
          <div className="mx-auto mt-2 h-px w-16 bg-primary" />
          <p className="mt-4 max-w-xl text-sm text-white/60">
            A glimpse of households currently looking for exceptional staff.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-3">
          {rows.map((role) => (
            <Link
              key={role.id}
              href={`/jobs/${role.id}`}
              className="group block"
            >
              <Card className="h-full border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <h3 className="font-heading text-lg text-white transition-colors group-hover:text-primary">
                      {role.title}
                    </h3>
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
                    <span className="inline-flex items-center gap-1 text-xs text-white/50">
                      <Lock className="h-3 w-3" />
                      Salary on application
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-transform group-hover:translate-x-0.5">
                      View
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
          >
            View All Open Roles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
