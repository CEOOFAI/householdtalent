'use client'

/**
 * Vertical dashboard / admin nav with a sliding gold active indicator.
 * The indicator (a soft pill + gold left bar) is measured from the active link and
 * moved with a CSS transform transition; before measurement (SSR) the active link
 * still gets gold text + background so the current item is always obvious.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef, useState } from 'react'
import { NAV_ICONS, findActiveHref, type NavItem } from './nav-icons'

interface SidebarNavProps {
  items: NavItem[]
  className?: string
  /** Called after a link is clicked (e.g. to close a mobile drawer). */
  onNavigate?: () => void
  label?: string
}

export function SidebarNav({ items, className = '', onNavigate, label = 'Main' }: SidebarNavProps) {
  const pathname = usePathname()
  const activeHref = findActiveHref(pathname, items)
  const listRef = useRef<HTMLUListElement>(null)
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null)
  const [animate, setAnimate] = useState(false)

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const el = list.querySelector<HTMLElement>('[aria-current="page"]')
      setIndicator(el ? { top: el.offsetTop, height: el.offsetHeight } : null)
    }
    measure()
    // enable the slide transition only after first placement
    const raf = requestAnimationFrame(() => setAnimate(true))
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(list)
    return () => {
      cancelAnimationFrame(raf)
      ro?.disconnect()
    }
  }, [activeHref])

  const measured = indicator !== null

  return (
    <nav aria-label={label} className={className}>
      <ul ref={listRef} className="relative space-y-1">
        {/* Sliding indicator */}
        <li
          aria-hidden
          data-motion
          className={`pointer-events-none absolute left-0 right-0 top-0 rounded-md bg-primary/10 ring-1 ring-inset ring-primary/20 ${
            animate ? 'transition-[transform,height,opacity] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]' : ''
          } ${measured ? 'opacity-100' : 'opacity-0'}`}
          style={{
            transform: `translateY(${indicator?.top ?? 0}px)`,
            height: indicator?.height ?? 0,
          }}
        >
          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
        </li>

        {items.map((item) => {
          const active = item.href === activeHref
          const Icon = item.icon ? NAV_ICONS[item.icon] : null
          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                data-motion
                className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors duration-200 ${
                  active
                    ? `font-medium text-primary ${measured ? '' : 'bg-primary/10'}`
                    : 'text-muted-foreground hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {Icon && (
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      active ? 'text-primary' : 'group-hover:translate-x-0.5'
                    }`}
                  />
                )}
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
