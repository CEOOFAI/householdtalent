import Link from "next/link";
import { LogOut } from "lucide-react";
import { SidebarNav } from "@/components/motion/sidebar-nav";
import { PageTransition } from "@/components/motion/page-transition";
import { DashboardMobileNav } from "@/components/dashboard-mobile-nav";
import type { NavItem } from "@/components/motion/nav-icons";

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Candidates", href: "/admin/candidates", icon: "users" },
  { label: "Employers", href: "/admin/employers", icon: "building" },
  { label: "Roles", href: "/admin/roles", icon: "briefcase" },
  { label: "Introductions", href: "/admin/introductions", icon: "handshake" },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: "card" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile top bar + drawer */}
      <DashboardMobileNav
        nav={ADMIN_NAV}
        userName="Admin"
        userRole="Super Admin"
        homeHref="/admin"
        badge="Admin"
        footerAction="exit-admin"
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 border-r border-border bg-card md:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="font-heading text-xl font-bold text-white">
            HouseHold<span className="text-primary">Talent</span>
            <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 font-sans text-xs font-medium text-primary">
              Admin
            </span>
          </Link>
        </div>

        <SidebarNav items={ADMIN_NAV} className="p-4" label="Admin" />

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
      <main className="min-w-0 flex-1 pt-14 md:ml-64 md:pt-0">
        <PageTransition className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {children}
        </PageTransition>
      </main>
    </div>
  );
}
