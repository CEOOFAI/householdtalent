import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Slim top bar */}
      <header className="border-b border-white/[0.08] bg-black/90">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-heading text-lg font-bold text-white sm:text-xl">
            HouseHold<span className="text-primary">Talent</span>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors duration-200 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />
            Back to site
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-14">
        <PageTransition className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="font-heading text-3xl font-bold text-white">
              HouseHold<span className="text-primary">Talent</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Exceptional Staff. Exemplary Homes.
            </p>
          </div>
          {children}
        </PageTransition>
      </main>

      <footer className="border-t border-white/[0.06] py-5">
        <p className="text-center text-xs text-white/50">
          <Link href="/terms" className="transition-colors duration-200 hover:text-white">
            Terms of Service
          </Link>
          <span className="mx-2 text-white/25" aria-hidden>·</span>
          <Link href="/privacy" className="transition-colors duration-200 hover:text-white">
            Privacy Policy
          </Link>
          <span className="mx-2 text-white/25" aria-hidden>·</span>
          <span>&copy; 2026 HouseHoldTalent</span>
        </p>
      </footer>
    </div>
  );
}
