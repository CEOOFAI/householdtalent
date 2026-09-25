import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { NavLink } from "@/components/motion/nav-link";

// Shared site chrome for the homepage and all public pages.

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "For Agencies", href: "/agencies" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Candidate Terms", href: "/candidate-terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Open Roles", href: "/jobs" },
      { label: "Submit a Role Brief", href: "/register/employer" },
      { label: "Apply to Join", href: "/register/candidate" },
      { label: "Sign in", href: "/login" },
    ],
  },
];

export function SiteHeader() {
  // Solid near-black so it never turns grey over the cream homepage section
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-black/90 shadow-[0_1px_0_0_rgba(155,123,60,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-black/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-heading text-xl font-bold text-white sm:text-2xl">
          HouseHold<span className="text-primary">Talent</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          <NavLink href="/jobs">Open Roles</NavLink>
          <NavLink href="/register/employer">Submit a Role Brief</NavLink>
          <NavLink href="/register/candidate">Apply to Join</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/about">About</NavLink>
          <Link
            href="/contact"
            className="rounded-md border border-white/20 px-4 py-1.5 text-sm text-white transition-colors duration-200 hover:border-primary/60 hover:bg-white/5"
          >
            Contact Us
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="hidden text-sm text-white/70 transition-colors duration-200 hover:text-white sm:block">Dashboard</Link>
          <Link href="/register/employer" className="hidden btn-gold rounded-md px-3 py-1.5 text-xs sm:block sm:px-4 sm:py-2 sm:text-sm">Submit a Role Brief</Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="font-heading text-xl font-bold text-white">
              HouseHold<span className="text-primary">Talent</span>
            </Link>
            <p className="mt-3 text-sm text-white/60">Exceptional Staff. Exemplary Homes.</p>
            <p className="mt-3 text-xs uppercase leading-relaxed tracking-widest text-white/50">
              Access by referral, recommendation or application only.
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-primary">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-2 border-t border-white/10 pt-6 text-center text-xs text-white/50 sm:flex-row sm:justify-between sm:text-left">
          <p>
            Questions?{" "}
            <a
              href="mailto:hello@householdtalent.com"
              className="text-primary transition-colors duration-200 hover:text-white"
            >
              hello@householdtalent.com
            </a>
          </p>
          <p>&copy; 2026 HouseHoldTalent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
