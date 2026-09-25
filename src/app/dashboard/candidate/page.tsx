import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Handshake, Star, User, FileText, Briefcase, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import type { ContactRequestStatus } from "@/types";
import VerificationCard from "./verification-card";

function getStatusBadge(status: ContactRequestStatus) {
  switch (status) {
    case 'pending':
      return <span className="inline-flex items-center gap-1 rounded-full bg-[#9B7B3C]/10 px-2 py-0.5 text-xs font-medium text-[#9B7B3C]"><Clock className="h-3 w-3" />Pending</span>;
    case 'introduced':
      return <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400"><CheckCircle className="h-3 w-3" />Introduced</span>;
    case 'declined':
      return <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400"><XCircle className="h-3 w-3" />Declined</span>;
    default:
      return <span className="text-xs text-neutral-400">{status}</span>;
  }
}

export default async function CandidateDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    // Profile might not be created yet (race condition with DB trigger)
    // Show a loading state instead of redirecting to login
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#9B7B3C] border-t-transparent" />
          <p className="text-sm text-neutral-400">Setting up your account...</p>
          <p className="mt-2 text-xs text-neutral-600">Refresh the page if this takes more than a few seconds.</p>
        </div>
      </div>
    );
  }

  const { count: viewsCount } = await supabase
    .from("profile_views")
    .select("id", { count: "exact", head: true })
    .eq("candidate_id", profile.id);

  const { count: requestsCount } = await supabase
    .from("contact_requests")
    .select("id", { count: "exact", head: true })
    .eq("candidate_id", profile.id);

  // Fetch recent introductions
  const { data: introductions } = await supabase
    .from("contact_requests")
    .select("id, status, created_at, roles(title)")
    .eq("candidate_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const fields = [
    profile.headline,
    profile.bio,
    profile.roles?.length > 0,
    profile.experience_years,
    profile.location,
    profile.photos?.length > 0,
  ];
  const completion = Math.round(
    (fields.filter(Boolean).length / fields.length) * 100
  );

  const stats = [
    { label: "Profile Completion", value: `${completion}%`, icon: User, color: completion === 100 ? "text-green-500" : "text-[#9B7B3C]" },
    { label: "Profile Views", value: viewsCount ?? 0, icon: Eye, color: "text-blue-400" },
    { label: "Introduction Requests", value: requestsCount ?? 0, icon: Handshake, color: "text-[#9B7B3C]" },
    { label: "Profile Status", value: profile.status === "active" ? "HHT Approved" : profile.status === "pending_review" ? "Under review" : profile.status === "waitlisted" ? "Waitlisted" : profile.status === "draft" ? "Draft" : "Inactive", icon: Star, color: "text-[#9B7B3C]" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back. Here&apos;s your profile overview.</p>
      </div>

      {/* Optional CV services: only offered once a candidate is HHT Approved,
          and kept separate from admission. */}
      {profile.status === 'active' && (
        <Card className="animate-fade-up border-[#9B7B3C]/30 bg-[#9B7B3C]/5">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="font-medium text-white">Optional CV services</h2>
              <p className="mt-1 text-sm text-neutral-400">
                Have your CV professionally restructured and presented by HHT, from £35.
              </p>
            </div>
            <Link href="/dashboard/candidate/subscription" className="shrink-0 self-start rounded-lg bg-[#9B7B3C] px-4 py-2 text-sm font-medium text-black hover:bg-[#7B6535] sm:self-center">
              <FileText className="mr-1 inline h-4 w-4" />View CV services
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-lg bg-muted p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Introduction Activity */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-white">Introduction Activity</h2>
            <Link href="/dashboard/candidate/opportunities" className="flex items-center gap-1 text-xs text-[#9B7B3C] hover:underline">
              <Briefcase className="h-3 w-3" />Browse Opportunities
            </Link>
          </div>
          {(!introductions || introductions.length === 0) ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Handshake className="mb-3 h-8 w-8 text-neutral-600" />
              <p className="text-sm text-muted-foreground">No introductions yet. Browse opportunities to express interest in roles.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {introductions.map((intro: any) => (
                <div key={intro.id} className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
                  <div>
                    <p className="text-sm font-medium text-white">{intro.roles?.title || 'General enquiry'}</p>
                    <p className="text-xs text-neutral-500">{new Date(intro.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  {getStatusBadge(intro.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Status */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h2 className="font-medium text-white">Profile Status</h2>
          <div className="mt-4 flex items-center gap-2">
            <span className={`inline-block h-2 w-2 rounded-full ${profile.status === "active" ? "bg-green-500" : profile.status === "pending_review" ? "bg-amber-600" : "bg-muted-foreground"}`} />
            <span className="text-sm capitalize text-muted-foreground">{profile.status.replace("_", " ")}</span>
          </div>
        </CardContent>
      </Card>

      {/* Reference & Verification */}
      {profile.status === 'active' && (
        <VerificationCard
          candidateId={profile.id}
          userId={user.id}
          referenceStatus={profile.reference_status ?? null}
          goldVerified={!!profile.gold_verified}
          policeCheckUploaded={!!profile.police_check_url}
        />
      )}
    </div>
  );
}
