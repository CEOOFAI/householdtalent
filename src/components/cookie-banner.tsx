'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'

const STORAGE_KEY = 'hht_cookie_consent_v1'

type Choice = 'all' | 'essential' | null

function readChoice(): Choice {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    if (v === 'all' || v === 'essential') return v
  } catch {
    // localStorage may be blocked
  }
  return null
}

function writeChoice(choice: 'all' | 'essential') {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice)
    window.localStorage.setItem(`${STORAGE_KEY}_at`, new Date().toISOString())
  } catch {
    // ignore
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (readChoice() === null) setVisible(true)
  }, [])

  function accept(choice: 'all' | 'essential') {
    writeChoice(choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="animate-fade-up fixed inset-x-3 bottom-3 z-50 flex max-h-[40vh] flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/95 shadow-2xl shadow-black/60 backdrop-blur-md sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-h-[70vh] sm:w-full sm:max-w-md"
    >
      <div className="overflow-y-auto p-4">
        <div className="flex gap-3">
          <Cookie className="mt-0.5 h-4 w-4 shrink-0 text-[#9B7B3C]" aria-hidden />
          <div className="space-y-1 text-sm">
            <p className="font-medium text-white">We use cookies</p>
            <p className="text-xs leading-relaxed text-neutral-400 sm:text-sm">
              Essential cookies keep you signed in. Optional analytics help us improve
              the site.{' '}
              <Link href="/cookies" className="text-[#9B7B3C] hover:underline">
                Cookie policy
              </Link>
              .
            </p>
            {showDetails && (
              <div
                id="cookie-details"
                className="animate-fade-in mt-3 space-y-2 rounded-md border border-neutral-800 bg-black/40 p-3 text-xs text-neutral-400"
              >
                <p>
                  <span className="font-medium text-white">Essential</span> — Supabase auth
                  session cookies, required for sign in. Cannot be disabled.
                </p>
                <p>
                  <span className="font-medium text-white">Analytics</span> — Vercel Web
                  Analytics. Tracks anonymised page views and performance. Off
                  unless you accept all.
                </p>
                <p>
                  <span className="font-medium text-white">Payments</span> — Stripe sets
                  cookies only when you reach checkout, regardless of your
                  choice (required for fraud prevention).
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              aria-controls="cookie-details"
              className="text-xs text-neutral-400 underline-offset-2 hover:text-neutral-200 hover:underline"
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 gap-2 border-t border-neutral-800/80 px-4 py-3">
        <button
          type="button"
          onClick={() => accept('essential')}
          className="flex-1 rounded-md border border-neutral-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-900"
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => accept('all')}
          className="flex-1 rounded-md bg-[#9B7B3C] px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-[#AB8B4C]"
        >
          Accept all
        </button>
      </div>
    </div>
  )
}
