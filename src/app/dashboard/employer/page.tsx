import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import {
  FileText,
  Handshake,
  UserCheck,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import type { ContactRequestStatus } from '@/types'

function getStatusBadge(status: ContactRequestStatus) {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#9B7B3C]/10 px-2 py-0.5 text-xs font-medium text-[#9B7B3C]">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      )
    case 'introduced':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
          <CheckCircle className="h-3 w-3" />
          Introduced
        </span>
      )
    case 'declined':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
          <XCircle className="h-3 w-3" />
          Declined
        </span>
      )
    default:
      return (
        <span className="inline-flex rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-400">
          {status}
        </span>
      )
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

export default async function EmployerDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single()

  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!employerProfile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#9B7B3C] border-t-transparent" />
          <p className="text-sm text-neutral-400">Setting up your account...</p>
          <p className="mt-2 text-xs text-neutral-600">Refresh the page if this takes more than a few seconds.</p>
        </div>
      </div>
    )
  }

  const employerId = employerProfile.id

  // Get stats
  const { count: activeRolesCount } = employerId
    ? await supabase
        .from('roles')
        .select('id', { count: 'exact', head: true })
        .eq('employer_id', employerId)
        .eq('status', 'active')
    : { count: 0 }

  const { count: pendingRolesCount } = employerId
    ? await supabase
        .from('roles')
        .select('id', { count: 'exact', head: true })
        .eq('employer_id', employerId)
        .eq('status', 'pending_review')
    : { count: 0 }

  // Get introduction request counts
  const { count: pendingIntroCount } = employerId
    ? await supabase
        .from('contact_requests')
        .select('id', { count: 'exact', head: true })
        .eq('employer_id', employerId)
        .eq('status', 'pending')
    : { count: 0 }

  const { count: totalIntroCount } = employerId
    ? await supabase
        .from('contact_requests')
        .select('id', { count: 'exact', head: true })
        .eq('employer_id', employerId)
    : { count: 0 }

  const { count: introducedCount } = employerId
    ? await supabase
        .from('contact_requests')
        .select('id', { count: 'exact', head: true })
        .eq('employer_id', employerId)
        .eq('status', 'introduced')
    : { count: 0 }

  // Fetch latest 5 introductions with candidate profile + headline
  interface IntroductionRow {
    id: string
    status: ContactRequestStatus
    created_at: string
    candidate_profiles: {
      headline: string | null
      user_id: string
      profiles: { first_name: string | null; last_name: string | null } | null
    } | null
    roles: { title: string } | null
  }

  let recentIntroductions: IntroductionRow[] = []
  if (employerId) {
    const { data: intros } = await supabase
      .from('contact_requests')
      .select(
        `
        id,
        status,
        created_at,
        candidate_profiles!contact_requests_candidate_id_fkey (
          headline,
          user_id,
          profiles!candidate_profiles_user_id_fkey (
            first_name,
            last_name
          )
        ),
        roles (
          title
        )
      `
      )
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false })
      .limit(5)

    recentIntroductions = (intros as unknown as IntroductionRow[]) || []
  }

  // Fetch up to 5 active roles for the My Active Roles section
  interface ActiveRoleRow {
    id: string
    title: string
    location: string | null
    position_type: string | null
    listing_tier: string | null
    created_at: string
  }
  let activeRoles: ActiveRoleRow[] = []
  if (employerId) {
    const { data } = await supabase
      .from('roles')
      .select('id, title, location, position_type, listing_tier, created_at')
      .eq('employer_id', employerId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5)
    activeRoles = (data as ActiveRoleRow[]) || []
  }

  const stats = [
    {
      label: 'Active Roles',
      value: activeRolesCount ?? 0,
      sub: `${pendingRolesCount ?? 0} pending review`,
      icon: FileText,
    },
    {
      label: 'Introduction Requests',
      value: totalIntroCount ?? 0,
      sub: `${pendingIntroCount ?? 0} pending`,
      icon: Handshake,
    },
    {
      label: 'Candidates Introduced',
      value: introducedCount ?? 0,
      sub: 'via our concierge team',
      icon: UserCheck,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Employer Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Your household staffing overview. We handle the introductions for you.
          </p>
        </div>
        <div className="hidden items-center gap-3 rounded-lg border border-border bg-card px-4 py-2 sm:flex">
          <span className="text-sm text-muted-foreground">Welcome back,</span>
          <span className="text-sm font-medium text-white">
            {profile?.first_name}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4 sm:p-6">
              <div className="rounded-lg bg-[#9B7B3C]/10 p-3">
                <stat.icon className="h-5 w-5 text-[#9B7B3C]" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-neutral-500">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Active Roles */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-semibold text-white">
            My Active Roles
          </h2>
          <Link
            href="/dashboard/employer/roles"
            className="text-sm text-[#9B7B3C] hover:underline"
          >
            View all
          </Link>
        </div>

        {activeRoles.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium text-white">
                No active roles yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Submit your first role brief and our team will personally curate
                a shortlist of introductions for you.
              </p>
              <Link
                href="/dashboard/employer/roles/new"
                className="mt-6 flex items-center gap-2 rounded-md bg-[#9B7B3C] px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#9B7B3C]/90"
              >
                <Plus className="h-4 w-4" />
                Submit a Role Brief
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {activeRoles.map((role) => (
              <Link
                key={role.id}
                href={`/dashboard/employer/roles/${role.id}`}
                className="group block"
              >
                <Card className="h-full border-border bg-card transition-colors hover:border-[#9B7B3C]/40">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="rounded-lg bg-[#9B7B3C]/10 p-2">
                      <FileText className="h-4 w-4 text-[#9B7B3C]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white group-hover:text-[#9B7B3C]">
                        {role.title}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {(role.location || 'Location flexible')
                          .split('_')
                          .map((s) => s[0]?.toUpperCase() + s.slice(1))
                          .join(' ')}
                        {role.position_type && ` · ${role.position_type.replace('_', '-')}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Introductions + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-white">
                Recent Introductions
              </h3>
              <Link
                href="/dashboard/employer/roles"
                className="flex items-center gap-1 text-xs text-[#9B7B3C] hover:underline"
              >
                View All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {recentIntroductions.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Handshake className="mb-3 h-8 w-8 text-neutral-600" />
                <p className="text-sm text-muted-foreground">
                  No introduction requests yet. Browse the network or submit a
                  role brief to set the first one in motion.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentIntroductions.map((intro) => {
                  const cp = intro.candidate_profiles
                  const profile = cp?.profiles || null
                  // Pre-introduction: show salutation + initials. Post-intro: full name reveals.
                  let candidateName: string
                  if (intro.status === 'introduced' && profile?.first_name) {
                    candidateName = `${profile.first_name} ${profile.last_name || ''}`.trim()
                  } else if (cp?.headline) {
                    const initial =
                      profile?.first_name?.[0]?.toUpperCase() ||
                      profile?.last_name?.[0]?.toUpperCase() ||
                      'C'
                    candidateName = `${cp.headline} · ${initial}.`
                  } else {
                    candidateName = 'Candidate'
                  }
                  const roleTitle = intro.roles?.title || 'General enquiry'

                  return (
                    <div
                      key={intro.id}
                      className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/50 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {candidateName}
                        </p>
                        <p className="truncate text-xs text-neutral-500">
                          {roleTitle}
                        </p>
                      </div>
                      <div className="ml-3 flex flex-col items-end gap-1">
                        {getStatusBadge(intro.status)}
                        <span className="text-[10px] text-neutral-600">
                          {formatDate(intro.created_at)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <h3 className="mb-4 font-heading text-lg font-semibold text-white">
              How It Works
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#9B7B3C]/10 text-xs font-bold text-[#9B7B3C]">
                  1
                </div>
                <p className="text-sm text-neutral-400">
                  Submit a role brief describing who you need in your household.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#9B7B3C]/10 text-xs font-bold text-[#9B7B3C]">
                  2
                </div>
                <p className="text-sm text-neutral-400">
                  Browse candidates or request introductions directly.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#9B7B3C]/10 text-xs font-bold text-[#9B7B3C]">
                  3
                </div>
                <p className="text-sm text-neutral-400">
                  Our concierge team arranges the introduction within 24 hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
