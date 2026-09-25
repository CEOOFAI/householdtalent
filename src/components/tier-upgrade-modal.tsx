'use client'

import { X, Check, Crown, Star } from 'lucide-react'
import { toast } from 'sonner'
import { CANDIDATE_PLANS } from '@/lib/stripe/config'
import type { CandidatePlanKey } from '@/lib/stripe/config'

interface TierUpgradeModalProps {
  currentTier: CandidatePlanKey
  isOpen: boolean
  onClose: () => void
}

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

export function TierUpgradeModal({
  currentTier,
  isOpen,
  onClose,
}: TierUpgradeModalProps) {
  if (!isOpen) return null

  function handleUpgrade(tier: CandidatePlanKey) {
    if (tier === currentTier) return
    toast.info(
      'Stripe checkout coming soon. Contact us to upgrade your profile.',
      { duration: 5000 }
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative mx-4 w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="font-heading text-2xl font-semibold text-white">
          Upgrade Your Profile
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          Choose the plan that fits your needs. All paid plans are billed
          quarterly.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {TIER_ORDER.map((tierKey) => {
            const plan = CANDIDATE_PLANS[tierKey]
            const isCurrent = tierKey === currentTier
            const isUpgrade =
              TIER_ORDER.indexOf(tierKey) > TIER_ORDER.indexOf(currentTier)

            return (
              <div
                key={tierKey}
                className={`relative rounded-xl border p-5 transition-all ${
                  isCurrent
                    ? 'border-[#9B7B3C] bg-[#9B7B3C]/5'
                    : 'border-neutral-800 bg-neutral-800/30 hover:border-neutral-700'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-[#9B7B3C] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                    Current
                  </span>
                )}

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

                <p className="mt-1 text-xl font-bold text-[#9B7B3C]">
                  {TIER_PRICES[tierKey]}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {TIER_DESCRIPTIONS[tierKey]}
                </p>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs text-neutral-300"
                    >
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#9B7B3C]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(tierKey)}
                  disabled={isCurrent || !isUpgrade}
                  className={`mt-5 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
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
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
