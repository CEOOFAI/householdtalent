/**
 * Root template — remounts when navigating between top-level segments / route
 * groups (e.g. marketing → auth → dashboard) and plays a 200ms fade-in.
 *
 * Deliberately opacity-only: this wrapper contains fixed headers/sidebars, and any
 * transform on an ancestor would re-anchor `position: fixed` children for the
 * duration of the animation. The 8px rise is applied to page content only by
 * <PageTransition> inside the public / dashboard / admin / auth layouts, which also
 * animates navigations *within* a route group (where this template does not remount).
 * No fixed heights; `.animate-page-fade` is disabled under prefers-reduced-motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-fade">{children}</div>;
}
