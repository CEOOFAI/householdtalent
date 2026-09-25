'use client'

import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'

// Heinz Q5 (May 2026): no real testimonials yet. Replaced placeholder copy with a
// rolling banner of philosophy quotes — large italic gold text, dark background,
// smooth fade transition. No attribution. These should read as the platform's
// philosophy, not quotes from specific people.
const QUOTES = [
  "You don't fall into private service. You earn your place in it.",
  "Not everyone can work in private households. And that's the point.",
  "Luxury isn't what you own. It's who you employ.",
  "The best household staff are never looking for work. They are waiting to be found.",
  "Anyone can hire. Very few know how to place.",
  "Discretion is not a feature of private service. It is the foundation of it.",
  "The right introduction changes everything. The wrong one costs more than money.",
]

const ROTATE_MS = 6500
const FADE_MS = 800

export function TestimonialsMarquee() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % QUOTES.length)
        setVisible(true)
      }, FADE_MS)
    }, ROTATE_MS)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <span className="inline-block rounded-full border border-primary/40 bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-primary">
          Trusted Network
        </span>

        <div className="mt-10 flex min-h-[180px] items-center justify-center sm:min-h-[220px]">
          <p
            className="font-heading text-2xl font-light italic leading-relaxed text-primary transition-opacity duration-700 sm:text-3xl md:text-4xl"
            style={{ opacity: visible ? 1 : 0 }}
            aria-live="polite"
          >
            &ldquo;{QUOTES[index]}&rdquo;
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          {QUOTES.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? 'w-8 bg-primary' : 'w-2 bg-white/20'
              }`}
              aria-hidden
            />
          ))}
        </div>

        <p className="mt-12 text-sm text-white/60">
          Trusted by private households, family offices and estates across the UK, Europe and the Middle East.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Access by referral, recommendation or application only.
        </div>

        <p className="mt-5 text-xs text-white/50">
          We also work with a select group of elite recruitment professionals who share our standards.
        </p>
      </div>
    </section>
  )
}
