'use client'

/**
 * Scroll-reveal primitives.
 *
 * Usage:
 *   import { Reveal, RevealGroup } from '@/components/motion/reveal'
 *
 *   <Reveal>…</Reveal>                               // fade + 14px rise once in view
 *   <Reveal delay={120} as="section" className="py-24">…</Reveal>
 *
 *   <RevealGroup stagger={80} className="grid gap-6 md:grid-cols-3">
 *     <Card />  <Card />  <Card />                    // direct children stagger in
 *   </RevealGroup>
 *
 * Behaviour:
 * - SSR / no-JS: content renders fully visible. After mount, only elements that
 *   are still below the viewport are hidden, then revealed once on intersection.
 *   Anything already on screen at mount is never hidden (no flash).
 * - prefers-reduced-motion: nothing is hidden or animated.
 * - After the reveal finishes the transition rules are removed, so children's own
 *   hover transitions (e.g. .card-lift) are unaffected.
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

type RevealState = 'idle' | 'hidden' | 'shown' | 'done'

const REVEAL_MS = 560

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function useRevealState(rootMargin: string) {
  const ref = useRef<HTMLElement | null>(null)
  const [state, setState] = useState<RevealState>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return

    // Already (partly) on screen at mount → leave visible, never hide.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return

    setState('hidden')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          // next frame so the hidden styles are committed before transitioning
          requestAnimationFrame(() => setState('shown'))
        }
      },
      { rootMargin, threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return { ref, state, setState }
}

interface RevealProps {
  children: ReactNode
  /** Delay before the element animates in, in ms. */
  delay?: number
  /** Element to render. Defaults to `div`. */
  as?: ElementType
  className?: string
  style?: CSSProperties
  /** IntersectionObserver rootMargin. Default reveals slightly before fully in view. */
  rootMargin?: string
  id?: string
}

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
  style,
  rootMargin = '0px 0px -8% 0px',
  id,
}: RevealProps) {
  const { ref, state, setState } = useRevealState(rootMargin)

  useEffect(() => {
    if (state !== 'shown') return
    const t = window.setTimeout(() => setState('done'), delay + REVEAL_MS + 50)
    return () => window.clearTimeout(t)
  }, [state, delay, setState])

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      data-reveal={state === 'idle' || state === 'done' ? undefined : state}
      style={
        state === 'shown' && delay ? { ...style, transitionDelay: `${delay}ms` } : style
      }
    >
      {children}
    </Tag>
  )
}

interface RevealGroupProps {
  children: ReactNode
  /** Delay between each direct child, in ms. */
  stagger?: number
  /** Delay before the first child, in ms. */
  delay?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
  rootMargin?: string
  id?: string
}

export function RevealGroup({
  children,
  stagger = 80,
  delay = 0,
  as: Tag = 'div',
  className,
  style,
  rootMargin = '0px 0px -8% 0px',
  id,
}: RevealGroupProps) {
  const { ref, state, setState } = useRevealState(rootMargin)

  useEffect(() => {
    const el = ref.current
    if (!el || state !== 'shown') return
    const kids = Array.from(el.children) as HTMLElement[]
    kids.forEach((kid, i) => {
      kid.style.transitionDelay = `${delay + i * stagger}ms`
    })
    const total = delay + Math.max(0, kids.length - 1) * stagger + REVEAL_MS + 50
    const t = window.setTimeout(() => {
      kids.forEach((kid) => {
        kid.style.transitionDelay = ''
      })
      setState('done')
    }, total)
    return () => window.clearTimeout(t)
  }, [state, stagger, delay, ref, setState])

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={style}
      data-reveal-group={state === 'idle' || state === 'done' ? undefined : state}
    >
      {children}
    </Tag>
  )
}
