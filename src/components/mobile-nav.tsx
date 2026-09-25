'use client'

import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Open Roles', href: '/jobs' },
  { label: 'Submit a Role Brief', href: '/register/employer' },
  { label: 'Apply to Join', href: '/register/candidate' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'For Agencies', href: '/agencies' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Dashboard', href: '/login' },
]

const PANEL_ID = 'public-mobile-menu'
const noopSubscribe = () => () => {}

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  // true only on the client (portal target exists)
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)

  // Close on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>('button')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const items = panel.querySelectorAll<HTMLElement>('a[href], button')
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const trigger = triggerRef.current
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      trigger?.focus({ preventScroll: true })
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={PANEL_ID}
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && open && createPortal(
        <div
          ref={panelRef}
          id={PANEL_ID}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="animate-fade-in fixed inset-0 z-[100] overflow-y-auto bg-black lg:hidden"
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4 sm:px-6">
            <span className="font-heading text-xl font-bold text-white">
              HouseHold<span className="text-primary">Talent</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-col items-center justify-center gap-1 px-6 pb-10 pt-10">
            {NAV_LINKS.map((link, i) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  style={{ ['--stagger-i' as string]: i + 1 }}
                  className={`animate-fade-up stagger-item w-full rounded-lg px-4 py-3.5 text-center text-base transition-colors hover:bg-white/10 hover:text-white ${
                    active ? 'text-primary' : 'text-white/75'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div
              className="animate-fade-up stagger-item mt-4 w-full"
              style={{ ['--stagger-i' as string]: NAV_LINKS.length + 1 }}
            >
              <Link
                href="/register/employer"
                onClick={() => setOpen(false)}
                className="btn-gold flex w-full items-center justify-center rounded-lg px-4 py-3.5 text-base"
              >
                Submit a Role Brief
              </Link>
            </div>
          </nav>
        </div>,
        document.body
      )}
    </>
  )
}
