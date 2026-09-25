import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, Handshake, CreditCard } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: candidateCount } = await supabase
    .from("candidate_profiles")
    .select("id", { count: "exact", head: true });

  const { count: employerCount } = await supabase
    .from("employer_profiles")
    .select("id", { count: "exact", head: true });

  const { count: pendingIntroCount } = await supabase
    .from("contact_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: activeSubCount } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  const stats = [
    { label: "Total Candidates", value: candidateCount ?? 0, icon: Users, color: "text-blue-400" },
    { label: "Total Employers", value: employerCount ?? 0, icon: Building2, color: "text-[#9B7B3C]" },
    { label: "Pending Introductions", value: pendingIntroCount ?? 0, icon: Handshake, color: "text-amber-400", href: "/admin/introductions" },
    { label: "Active Subscriptions", value: activeSubCount ?? 0, icon: CreditCard, color: "text-green-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Platform overview and management.</p>
      </div>

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

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/introductions">
          <Card className="border-[#9B7B3C]/20 bg-card transition-colors hover:border-[#9B7B3C]/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Handshake className="h-6 w-6 text-[#9B7B3C]" />
                <div>
                  <h2 className="font-heading text-lg font-semibold text-white">Manage Introductions</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {(pendingIntroCount ?? 0) > 0
                      ? `${pendingIntroCount} introduction${pendingIntroCount !== 1 ? 's' : ''} awaiting your review.`
                      : 'No pending introductions right now.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/candidates">
          <Card className="border-border bg-card transition-colors hover:border-neutral-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-400" />
                <div>
                  <h2 className="font-heading text-lg font-semibold text-white">Review Candidates</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Approve, feature, or suspend candidate profiles.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
