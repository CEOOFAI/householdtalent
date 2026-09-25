import Link from "next/link";

// Branded "page not found" content, shared by the root and public 404 pages.
export function NotFoundPanel() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-6 py-24">
      <div className="max-w-md text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">404</p>
        <h1 className="mt-4 font-heading text-4xl text-white sm:text-5xl">
          This page isn&apos;t available
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          The page may have moved, or the role you were looking for has been filled or closed.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/jobs" className="btn-gold rounded-md px-6 py-2.5 text-sm">
            View open roles
          </Link>
          <Link
            href="/"
            className="rounded-md border border-white/20 px-6 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
