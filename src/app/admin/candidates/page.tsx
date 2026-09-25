import { createClient } from "@/lib/supabase/server";
import { CandidatesTable, type CandidateRow } from "./candidates-table";
import { Clock, Inbox, UserCheck } from "lucide-react";

export default async function AdminCandidatesPage() {
  const supabase = await createClient();

  const { data: candidates } = await supabase
    .from("candidate_profiles")
    .select(`
      id,
      headline,
      location,
      tier,
      status,
      reference_status,
      verification_notes,
      gold_verified,
      police_check_url,
      police_check_uploaded_at,
      profiles:user_id!inner (first_name, last_name, email, role)
    `)
    .order("created_at", { ascending: false });

  type ServerRow = CandidateRow & {
    profiles: (CandidateRow["profiles"] & { role: string }) | null;
  };
  const rows: CandidateRow[] = ((candidates ?? []) as unknown as ServerRow[])
    .map((c) => ({
      ...c,
      profiles: Array.isArray(c.profiles) ? (c.profiles[0] ?? null) : c.profiles,
    }))
    // Only show users whose profile is actually a candidate. Employers / admins
    // sometimes get an orphan candidate_profiles row from the auto-create
    // trigger; filtering by profiles.role keeps the queue clean.
    .filter((c) => c.profiles?.role === "candidate")
    .map(({ profiles, ...rest }) => ({
      ...rest,
      profiles: profiles
        ? {
            first_name: profiles.first_name,
            last_name: profiles.last_name,
            email: profiles.email,
          }
        : null,
    }));

  const pendingCount = rows.filter((r) => r.status === "pending_review").length;
  const waitlistedCount = rows.filter((r) => r.status === "waitlisted").length;
  const activeCount = rows.filter((r) => r.status === "active").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">
            Manage Candidates
          </h1>
          <p className="mt-1 text-muted-foreground">
            Review applications, accept members into the network, manage
            existing candidate profiles and run reference verification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {rows.length} total
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Inbox className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">
              Applications Pending Review
            </p>
          </div>
          <p className="mt-2 font-heading text-3xl font-bold text-white">
            {pendingCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            New applications awaiting your decision.
          </p>
        </div>
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
          <div className="flex items-center gap-2 text-blue-400">
            <Clock className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">
              Waitlisted
            </p>
          </div>
          <p className="mt-2 font-heading text-3xl font-bold text-white">
            {waitlistedCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Promising but not yet ready. Door stays open.
          </p>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
          <div className="flex items-center gap-2 text-green-400">
            <UserCheck className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">
              Active Members
            </p>
          </div>
          <p className="mt-2 font-heading text-3xl font-bold text-white">
            {activeCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Accepted into the network and visible to employers.
          </p>
        </div>
      </div>

      <CandidatesTable rows={rows} />
    </div>
  );
}
