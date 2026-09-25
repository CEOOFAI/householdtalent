import Link from "next/link";
import {
  LayoutDashboard, Users, Building2, CreditCard, Settings, LogOut, Handshake, Briefcase
} from "lucide-react";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Candidates", href: "/admin/candidates", icon: Users },
  { label: "Employers", href: "/admin/employers", icon: Building2 },
  { label: "Roles", href: "/admin/roles", icon: Briefcase },
  { label: "Introductions", href: "/admin/introductions", icon: Handshake },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 border-r border-border bg-card md:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="font-heading text-xl font-bold text-white">
            HouseHold<span className="text-primary">Talent</span>
            <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Admin
            </span>
          </Link>
        </div>

        <nav className="space-y-1 p-4">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Exit Admin
          </Link>
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
