'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Open Roles', href: '/jobs' },
  { label: 'Submit a Role Brief', href: '/register/employer' },
  { label: 'Apply to Join', href: '/register/candidate' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Dashboard', href: '/login' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[100] bg-black lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4 sm:px-6">
            <span className="font-heading text-xl font-bold text-white">
              HouseHold<span className="text-primary">Talent</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center gap-2 px-6 pt-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="w-full rounded-lg px-4 py-3.5 text-center text-base text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 w-full">
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
