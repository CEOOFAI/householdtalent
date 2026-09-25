import { Card, CardContent } from "@/components/ui/card";
import { Building2, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEmployersPage() {
  const supabase = await createClient();

  const { data: employers } = await supabase
    .from("employer_profiles")
    .select(`
      id,
      company_name,
      created_at,
      profiles:user_id (first_name, last_name, email)
    `)
    .order("created_at", { ascending: false });

  type Row = {
    id: string;
    company_name: string | null;
    created_at: string;
    profiles: { first_name: string; last_name: string; email: string } | null;
  };
  const rows = ((employers ?? []) as unknown as Row[]).map((e) => ({
    ...e,
    profiles: Array.isArray(e.profiles) ? (e.profiles[0] ?? null) : e.profiles,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">
            Manage Employers
          </h1>
          <p className="mt-1 text-muted-foreground">
            View and manage employer accounts and subscriptions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {rows.length} total
          </span>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search employers by name, company, or email..."
                disabled
                className="w-full rounded-md border border-border bg-muted py-2 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground"
              />
            </div>
            <select
              disabled
              className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
            >
              <option>All Plans</option>
              <option>Standard</option>
              <option>Ongoing Hiring</option>
              <option>Priority Search</option>
              <option>Professional / Agency</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Name</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Company</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Email</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No employers registered yet. They will appear here
                          once users start signing up.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((e) => (
                    <tr key={e.id} className="border-b border-border">
                      <td className="p-4 text-sm text-white">
                        {e.profiles ? `${e.profiles.first_name} ${e.profiles.last_name}` : "—"}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {e.company_name || "—"}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {e.profiles?.email || "—"}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(e.created_at).toLocaleDateString("en-GB")}
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
