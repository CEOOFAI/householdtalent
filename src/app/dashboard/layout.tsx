import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  LayoutDashboard, FileText, Users, CreditCard, Briefcase,
  LifeBuoy, LogOut, User, Settings, Plus, Clock, Handshake
} from "lucide-react";

async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");
  return profile;
}

const CANDIDATE_NAV = [
  { label: "Dashboard", href: "/dashboard/candidate", icon: LayoutDashboard },
  { label: "My Profile", href: "/dashboard/candidate/profile", icon: User },
  { label: "Browse Opportunities", href: "/dashboard/candidate/opportunities", icon: Briefcase },
  { label: "Introductions", href: "/dashboard/candidate/introductions", icon: Handshake },
  { label: "CV Builder", href: "/dashboard/candidate/cv-builder", icon: FileText },
  { label: "Plan & Upgrade", href: "/dashboard/candidate/subscription", icon: CreditCard },
  { label: "Settings", href: "/dashboard/candidate/settings", icon: Settings },
];

const EMPLOYER_NAV = [
  { label: "Dashboard", href: "/dashboard/employer", icon: LayoutDashboard },
  { label: "My Roles", href: "/dashboard/employer/roles", icon: FileText },
  { label: "Submit a Role Brief", href: "/dashboard/employer/roles/new", icon: Plus },
  { label: "Browse Network", href: "/dashboard/employer/search", icon: Users },
  { label: "Introductions", href: "/dashboard/employer/introductions", icon: Handshake },
  { label: "Billing", href: "/dashboard/employer/subscription", icon: CreditCard },
  { label: "Support", href: "/dashboard/employer/settings", icon: LifeBuoy },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  const nav = profile.role === "employer" ? EMPLOYER_NAV : CANDIDATE_NAV;
  const isEmployer = profile.role === "employer";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 border-r border-border bg-card md:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/" className="font-heading text-xl font-bold text-white">
            HouseHold<span className="text-primary">Talent</span>
          </Link>
        </div>

        <nav className="space-y-1 p-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Employer: Pending roles + Submit a Role Brief CTA */}
        {isEmployer && (
          <div className="mt-4 px-4">
            <div className="mb-4 rounded-md border border-border bg-muted/50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Pending
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>No pending roles</span>
              </div>
            </div>
            <Link
              href="/dashboard/employer/roles/new"
              className="btn-gold flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm"
            >
              <Plus className="h-4 w-4" />
              Submit a Role Brief
            </Link>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-white">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {profile.role}
            </p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
