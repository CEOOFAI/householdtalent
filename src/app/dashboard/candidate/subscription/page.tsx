'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { CANDIDATE_PLANS } from '@/lib/stripe/config'
import { CreditCard, Check, Crown, Star, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import type { CandidatePlanKey } from '@/lib/stripe/config'

const TIER_ORDER: CandidatePlanKey[] = ['free', 'premium']

const TIER_ICONS: Record<CandidatePlanKey, React.ReactNode> = {
  free: <Star className="h-5 w-5" />,
  premium: <Crown className="h-5 w-5" />,
}

const TIER_LABELS: Record<CandidatePlanKey, string> = {
  free: 'Free',
  premium: 'Premium',
}

const TIER_PRICES: Record<CandidatePlanKey, string> = {
  free: 'Free',
  premium: '£50 / 3 months',
}

const TIER_DESCRIPTIONS: Record<CandidatePlanKey, string> = {
  free: 'A basic profile for accepted members',
  premium: 'The full professional package',
}

export default function CandidateSubscriptionPage() {
  const [currentTier, setCurrentTier] = useState<CandidatePlanKey>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTier() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('candidate_profiles')
        .select('tier')
        .eq('user_id', user.id)
        .single()

      if (data?.tier) {
        setCurrentTier(data.tier as CandidatePlanKey)
      }
      setLoading(false)
    }

    fetchTier()
  }, [])

  function handleUpgrade(tier: CandidatePlanKey) {
    if (tier === currentTier) return
    toast.info(
      'Stripe checkout coming soon. Contact us to upgrade your profile.',
      { duration: 5000 }
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Subscription</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your plan and billing.
        </p>
      </div>

      {/* Current tier banner */}
      <Card className="border-[#9B7B3C]/20 bg-[#9B7B3C]/5">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-lg bg-[#9B7B3C]/10 p-2 text-[#9B7B3C]">
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Current Tier</p>
            <p className="text-lg font-semibold text-white">
              {TIER_LABELS[currentTier]}
            </p>
          </div>
          {currentTier === 'premium' && (
            <Link
              href="/dashboard/candidate/cv-builder"
              className="flex items-center gap-1.5 rounded-lg bg-[#9B7B3C] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#9B7B3C]/90"
            >
              Build Your CV
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Tier cards */}
      <div className="grid gap-6 md:grid-cols-2 max-w-2xl pt-4">
        {TIER_ORDER.map((tierKey) => {
          const plan = CANDIDATE_PLANS[tierKey]
          const isCurrent = tierKey === currentTier
          const isUpgrade =
            TIER_ORDER.indexOf(tierKey) > TIER_ORDER.indexOf(currentTier)

          return (
            <Card
              key={tierKey}
              className={`relative overflow-visible border-border bg-card ${
                isCurrent ? 'ring-2 ring-[#9B7B3C]' : ''
              }`}
            >
              {isCurrent && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-[#9B7B3C] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                  Current
                </span>
              )}
              <CardContent className="p-6">
                <div
                  className={`mb-3 inline-flex rounded-lg p-2 ${
                    isCurrent
                      ? 'bg-[#9B7B3C]/10 text-[#9B7B3C]'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {TIER_ICONS[tierKey]}
                </div>

                <h3 className="font-heading text-lg font-semibold text-white">
                  {TIER_LABELS[tierKey]}
                </h3>
                <p className="mt-1 text-2xl font-bold text-[#9B7B3C]">
                  {TIER_PRICES[tierKey]}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {TIER_DESCRIPTIONS[tierKey]}
                </p>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9B7B3C]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {tierKey === 'premium' && isCurrent && (
                  <Link
                    href="/dashboard/candidate/cv-builder"
                    className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#9B7B3C] transition-colors hover:text-[#9B7B3C]/80"
                  >
                    Build Your CV
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}

                <button
                  onClick={() => handleUpgrade(tierKey)}
                  disabled={isCurrent || !isUpgrade}
                  className={`mt-6 w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    isCurrent
                      ? 'cursor-default bg-neutral-800 text-neutral-500'
                      : isUpgrade
                        ? 'bg-[#9B7B3C] text-black hover:bg-[#9B7B3C]/90'
                        : 'cursor-default bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {isCurrent
                    ? 'Current Plan'
                    : isUpgrade
                      ? 'Upgrade'
                      : 'Included'}
                </button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
