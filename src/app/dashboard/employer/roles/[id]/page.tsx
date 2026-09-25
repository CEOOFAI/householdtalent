import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Briefcase, Clock, Banknote, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: role } = await supabase
    .from("roles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!role) {
    notFound();
  }

  const statusLabel = String(role.status).replace(/_/g, " ");
  const positionLabel = role.position_type === "live_in" ? "Live-in" : "Live-out";
  const employmentLabel = role.employment_type
    ? String(role.employment_type).replace("_", "-")
    : null;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/employer/roles"
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Roles
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-white">
              {role.title}
            </h1>
            <p className="mt-1 text-sm capitalize text-muted-foreground">
              {statusLabel}
            </p>
          </div>
          <span className="rounded-full border border-[#9B7B3C]/40 bg-[#9B7B3C]/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#9B7B3C]">
            {role.plan || "Standard"}
          </span>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-[#9B7B3C]" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm text-white capitalize">
                  {String(role.location).replace(/_/g, " ")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase className="mt-0.5 h-4 w-4 text-[#9B7B3C]" />
              <div>
                <p className="text-xs text-muted-foreground">Position</p>
                <p className="text-sm text-white">
                  {positionLabel}
                  {employmentLabel ? ` • ${employmentLabel}` : ""}
                </p>
              </div>
            </div>
            {role.hours_per_week && (
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-[#9B7B3C]" />
                <div>
                  <p className="text-xs text-muted-foreground">Hours</p>
                  <p className="text-sm text-white capitalize">
                    {role.hours_type || "—"} • {role.hours_per_week} hrs/week
                  </p>
                </div>
              </div>
            )}
            {role.salary_band && (
              <div className="flex items-start gap-3">
                <Banknote className="mt-0.5 h-4 w-4 text-[#9B7B3C]" />
                <div>
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <p className="text-sm text-white">{role.salary_band}</p>
                </div>
              </div>
            )}
          </div>

          {role.responsibilities && role.responsibilities.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#9B7B3C]/80">
                Responsibilities
              </p>
              <div className="flex flex-wrap gap-2">
                {role.responsibilities.map((r: string) => (
                  <span
                    key={r}
                    className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {role.requirements && role.requirements.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#9B7B3C]/80">
                Requirements
              </p>
              <div className="flex flex-wrap gap-2">
                {role.requirements.map((r: string) => (
                  <span
                    key={r}
                    className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {role.languages && role.languages.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#9B7B3C]/80">
                Languages
              </p>
              <div className="flex flex-wrap gap-2">
                {role.languages.map((l: string) => (
                  <span
                    key={l}
                    className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {role.description && (
            <div className="border-t border-border pt-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9B7B3C]/80">
                <FileText className="h-3.5 w-3.5" /> Description
              </p>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {role.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9B7B3C]/80">
            Introductions
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            When a candidate expresses interest in this role, they&apos;ll
            appear here for your review. The HouseHoldTalent team also
            introduces curated candidates directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
