import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-heading text-xl font-bold text-white sm:text-2xl">
            HouseHold<span className="text-primary">Talent</span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            <Link href="/jobs" className="text-sm text-white/70 transition-colors hover:text-white">Open Roles</Link>
            <Link href="/register/employer" className="text-sm text-white/70 transition-colors hover:text-white">Submit a Role Brief</Link>
            <Link href="/register/candidate" className="text-sm text-white/70 transition-colors hover:text-white">Apply to Join</Link>
            <Link href="/pricing" className="text-sm text-white/70 transition-colors hover:text-white">Pricing</Link>
            <Link href="/about" className="text-sm text-white/70 transition-colors hover:text-white">About</Link>
            <Link href="/contact" className="rounded-md border border-white/20 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white/10">Contact Us</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="hidden text-sm text-white/70 hover:text-white sm:block">Dashboard</Link>
            <Link href="/register/employer" className="hidden btn-gold rounded-md px-3 py-1.5 text-xs sm:block sm:px-4 sm:py-2 sm:text-sm">Submit a Role Brief</Link>
            <MobileNav />
          </div>
        </div>
      </header>

      <div className="pt-16">{children}</div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <span className="font-heading text-xl font-bold text-white">
                HouseHold<span className="text-primary">Talent</span>
              </span>
              <p className="mt-3 text-xs text-white/40 sm:text-sm">Exceptional Staff. Exemplary Homes.</p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-white/30 sm:text-xs">
                Access by referral, recommendation or application only.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">Company</h4>
              <ul className="mt-3 space-y-2">
                <li><Link href="/about" className="text-xs text-white/40 hover:text-white sm:text-sm">About</Link></li>
                <li><Link href="/how-it-works" className="text-xs text-white/40 hover:text-white sm:text-sm">How It Works</Link></li>
                <li><Link href="/pricing" className="text-xs text-white/40 hover:text-white sm:text-sm">Pricing</Link></li>
                <li><Link href="/contact" className="text-xs text-white/40 hover:text-white sm:text-sm">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">Legal</h4>
              <ul className="mt-3 space-y-2">
                <li><Link href="/terms" className="text-xs text-white/40 hover:text-white sm:text-sm">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-xs text-white/40 hover:text-white sm:text-sm">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="text-xs text-white/40 hover:text-white sm:text-sm">Cookie Policy</Link></li>
                <li><Link href="/faq" className="text-xs text-white/40 hover:text-white sm:text-sm">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">Apply</h4>
              <ul className="mt-3 space-y-2">
                <li><Link href="/jobs" className="text-xs text-white/40 hover:text-white sm:text-sm">Open Roles</Link></li>
                <li><Link href="/register/employer" className="text-xs text-white/40 hover:text-white sm:text-sm">Submit a Role Brief</Link></li>
                <li><Link href="/register/candidate" className="text-xs text-white/40 hover:text-white sm:text-sm">Apply to Join</Link></li>
                <li><Link href="/login" className="text-xs text-white/40 hover:text-white sm:text-sm">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-[10px] text-white/30 sm:text-xs">
              Need help? Our concierge team is <Link href="/contact" className="text-primary hover:underline">here to assist</Link>.
            </p>
            <p className="mt-1 text-[10px] text-white/30 sm:text-xs">
              &copy; {new Date().getFullYear()} HouseHoldTalent. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
