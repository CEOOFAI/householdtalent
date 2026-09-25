'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'

interface DashboardMobileNavProps {
  nav: { label: string; href: string }[]
  userName: string
  userRole: string
}

export function DashboardMobileNav({ nav, userName, userRole }: DashboardMobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <Link href="/" className="font-heading text-lg font-bold text-white">
          HouseHold<span className="text-primary">Talent</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md p-2 text-white/70 transition-colors hover:bg-muted hover:text-white"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Slide-out drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-border bg-card">
            <div className="flex h-14 items-center justify-between border-b border-border px-5">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="font-heading text-lg font-bold text-white"
              >
                HouseHold<span className="text-primary">Talent</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-white/70 transition-colors hover:bg-muted hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1 p-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
              <div className="mb-3 px-3">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs capitalize text-muted-foreground">{userRole}</p>
              </div>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
