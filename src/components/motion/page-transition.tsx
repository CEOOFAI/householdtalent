'use client'

/**
 * Wraps page content inside a persistent layout (below a fixed header/sidebar) and
 * plays a 200ms fade + 8px rise whenever the pathname changes — without remounting
 * the subtree. First paint uses the CSS `.animate-page-in` class. Respects
 * prefers-reduced-motion.
 *
 *   <PageTransition>{children}</PageTransition>
 */

import { useEffect, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransition({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const el = ref.current
    if (!el || typeof el.animate !== 'function') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    el.animate(
      [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 200, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' },
    )
  }, [pathname])

  return (
    <div ref={ref} className={['animate-page-in', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
