'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { SidebarNav } from '@/components/motion/sidebar-nav'
import type { NavItem } from '@/components/motion/nav-icons'

interface DashboardMobileNavProps {
  nav: NavItem[]
  userName: string
  userRole: string
  /** Where the logo links to. */
  homeHref?: string
  /** Small pill shown next to the logo (e.g. "Admin"). */
  badge?: string
  /** Footer action: sign-out form (dashboard) or plain exit link (admin). */
  footerAction?: 'signout' | 'exit-admin'
}

/**
 * Mobile top bar + slide-in drawer for the dashboard and admin areas (md:hidden).
 * Closes on navigation and Esc, locks body scroll while open, traps focus inside
 * the drawer and returns focus to the menu button on close.
 */
export function DashboardMobileNav({
  nav,
  userName,
  userRole,
  homeHref = '/',
  badge,
  footerAction = 'signout',
}: DashboardMobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const drawerId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpen(false), [])

  // Close whenever the route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Scroll lock, Esc, focus trap
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const trigger = triggerRef.current
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      trigger?.focus({ preventScroll: true })
    }
  }, [open])

  const logo = (
    <>
      HouseHold<span className="text-primary">Talent</span>
      {badge && (
        <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 align-middle font-sans text-xs font-medium text-primary">
          {badge}
        </span>
      )}
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md md:hidden">
        <Link href={homeHref} className="font-heading text-lg font-bold text-white">
          {logo}
        </Link>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md p-2 text-white/70 transition-colors hover:bg-muted hover:text-white"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls={drawerId}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Slide-in drawer (kept mounted so it can animate in and out) */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          data-motion
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={close}
        />
        <div
          ref={panelRef}
          id={drawerId}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          data-motion
          className={`absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col border-r border-border bg-card shadow-2xl shadow-black/60 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5">
            <Link href={homeHref} onClick={close} className="font-heading text-lg font-bold text-white">
              {logo}
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="rounded-md p-1.5 text-white/70 transition-colors hover:bg-muted hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <SidebarNav items={nav} onNavigate={close} label="Mobile" />
          </div>

          <div className="shrink-0 border-t border-border p-4">
            <div className="mb-3 px-3">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs capitalize text-muted-foreground">{userRole}</p>
            </div>
            {footerAction === 'signout' ? (
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </form>
            ) : (
              <Link
                href="/"
                onClick={close}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Exit Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
