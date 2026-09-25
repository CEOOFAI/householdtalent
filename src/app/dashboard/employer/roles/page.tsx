import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, MapPin, Users, UserCheck, Clock } from "lucide-react";
import Link from "next/link";

export default async function MyRolesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: employerProfile } = await supabase
    .from("employer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const { data: roles } = employerProfile
    ? await supabase
        .from("roles")
        .select("*")
        .eq("employer_id", employerProfile.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">My Roles</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your role briefs and review introductions.
          </p>
        </div>
        <Link
          href="/dashboard/employer/roles/new"
          className="btn-gold flex items-center gap-2 rounded-md px-5 py-2.5 text-sm"
        >
          <Plus className="h-4 w-4" />
          Submit a Role Brief
        </Link>
      </div>

      {!roles || roles.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center p-16 text-center">
            <FileText className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h2 className="text-xl font-medium text-white">No role briefs yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Submit your first role brief to start receiving introductions to
              vetted household professionals.
            </p>
            <Link
              href="/dashboard/employer/roles/new"
              className="btn-gold mt-6 flex items-center gap-2 rounded-md px-6 py-3 text-sm"
            >
              <Plus className="h-4 w-4" />
              Post Your First Role
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {roles.map((role) => (
            <Card key={role.id} className="border-border bg-card">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{role.title}</h3>
                    <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {role.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {role.position_type?.replace("_", "-")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>0 applicants</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>0 shortlisted</span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/employer/roles/${role.id}`}
                    className="btn-gold rounded-md px-4 py-2 text-xs"
                  >
                    View Candidates
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
