import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import RoleActions from "./role-actions";

export default async function AdminRolesPage() {
  const supabase = await createClient();

  const { data: roles } = await supabase
    .from("roles")
    .select(`
      id,
      title,
      location,
      plan,
      status,
      created_at,
      employer_profiles!inner (
        company_name,
        user_id,
        profiles!inner (first_name, last_name, email)
      )
    `)
    .order("created_at", { ascending: false });

  type Row = {
    id: string;
    title: string;
    location: string | null;
    plan: string | null;
    status: string;
    created_at: string;
    employer_profiles:
      | {
          company_name: string | null;
          profiles: { first_name: string; last_name: string; email: string } | { first_name: string; last_name: string; email: string }[] | null;
        }
      | Array<{
          company_name: string | null;
          profiles: { first_name: string; last_name: string; email: string } | { first_name: string; last_name: string; email: string }[] | null;
        }>
      | null;
  };

  const rows = ((roles ?? []) as unknown as Row[]).map((r) => {
    const emp = Array.isArray(r.employer_profiles)
      ? r.employer_profiles[0]
      : r.employer_profiles;
    const prof = emp
      ? Array.isArray(emp.profiles)
        ? emp.profiles[0]
        : emp.profiles
      : null;
    return { ...r, employer: emp, employerProfile: prof };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">
            Manage Roles
          </h1>
          <p className="mt-1 text-muted-foreground">
            Review, approve, and manage posted roles.
          </p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          {rows.length} total
        </span>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">
                    Role
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">
                    Employer
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">
                    Location
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">
                    Plan
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Briefcase className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No roles posted yet.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="border-b border-border">
                      <td className="p-4 text-sm text-white">
                        {r.title}
                        <div className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString("en-GB")}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {r.employer?.company_name ||
                          (r.employerProfile
                            ? `${r.employerProfile.first_name} ${r.employerProfile.last_name}`
                            : "—")}
                        <div className="text-xs text-muted-foreground">
                          {r.employerProfile?.email || "—"}
                        </div>
                      </td>
                      <td className="p-4 text-sm capitalize text-muted-foreground">
                        {r.location ? String(r.location).replace(/_/g, " ") : "—"}
                      </td>
                      <td className="p-4 text-sm capitalize text-[#9B7B3C]">
                        {r.plan || "—"}
                      </td>
                      <td className="p-4 text-sm capitalize text-muted-foreground">
                        {r.status.replace(/_/g, " ")}
                      </td>
                      <td className="p-4">
                        <RoleActions id={r.id} status={r.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
