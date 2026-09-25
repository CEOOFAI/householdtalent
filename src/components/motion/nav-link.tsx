'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/** True when `href` is the current page or a parent section of it. */
export function isActivePath(pathname: string | null, href: string, exact = false) {
  if (!pathname) return false
  if (href === '/') return pathname === '/'
  if (exact) return pathname === href
  return pathname === href || pathname.startsWith(href + '/')
}

/**
 * Header nav link with an animated gold underline on hover and when active.
 *
 *   <NavLink href="/pricing">Pricing</NavLink>
 */
export function NavLink({
  href,
  children,
  className = '',
  exact = false,
}: {
  href: string
  children: ReactNode
  className?: string
  exact?: boolean
}) {
  const pathname = usePathname()
  const active = isActivePath(pathname, href, exact)
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`link-underline text-sm transition-colors duration-200 ${
        active ? 'text-white' : 'text-white/70 hover:text-white'
      } ${className}`}
    >
      {children}
    </Link>
  )
}
