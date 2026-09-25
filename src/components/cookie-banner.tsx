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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3 sm:max-w-2xl">
            <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-[#9B7B3C]" />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-white">We use cookies</p>
              <p className="text-neutral-400">
                Essential cookies keep you signed in and the site running. Optional
                analytics cookies help us understand how the site is used. Choose
                what you are comfortable with.{' '}
                <Link href="/cookies" className="text-[#9B7B3C] hover:underline">
                  Cookie policy
                </Link>
                .
              </p>
              {showDetails && (
                <div className="mt-3 space-y-2 rounded-md border border-neutral-800 bg-black/40 p-3 text-xs text-neutral-400">
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
                className="text-xs text-neutral-500 underline-offset-2 hover:text-neutral-300 hover:underline"
              >
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => accept('essential')}
              className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-900"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={() => accept('all')}
              className="rounded-md bg-[#9B7B3C] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#7B6535]"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
