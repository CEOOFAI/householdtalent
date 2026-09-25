'use client'

import Link from 'next/link'
import { X, Check, FileText, ShieldCheck } from 'lucide-react'
import type { CandidatePlanKey } from '@/lib/stripe/config'

interface TierUpgradeModalProps {
  /** Retained for compatibility. Membership is complimentary at launch. */
  currentTier?: CandidatePlanKey
  isOpen: boolean
  onClose: () => void
}

const CV_SERVICES = [
  {
    name: 'HHT CV Polish',
    price: '£35',
    description:
      'Your CV professionally restructured and presented, with a discreet "Prepared by HouseHoldTalent" footer.',
  },
  {
    name: 'Professional CV',
    price: '£59',
    description:
      'Professionally restructured and presented, fully unbranded for unrestricted use.',
  },
]

/**
 * Informational "CV services" modal. Candidate membership is complimentary;
 * CV services are optional, for approved members only, and have no effect on
 * admission.
 */
export function TierUpgradeModal({ isOpen, onClose }: TierUpgradeModalProps) {
  if (!isOpen) return null

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
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="font-heading text-2xl font-semibold text-white">
          CV Services
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          Your Standard HHT Approved profile is complimentary. The optional
          services below are available to approved members only.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {CV_SERVICES.map((service) => (
            <div
              key={service.name}
              className="relative rounded-xl border border-neutral-800 bg-neutral-800/30 p-5"
            >
              <div className="mb-3 inline-flex rounded-lg bg-[#9B7B3C]/10 p-2 text-[#9B7B3C]">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-white">
                {service.name}
              </h3>
              <p className="mt-1 text-xl font-bold text-[#9B7B3C]">
                {service.price}
              </p>
              <p className="mt-3 flex items-start gap-2 text-xs text-neutral-300">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#9B7B3C]" />
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-lg border border-neutral-800 bg-neutral-800/30 p-4 text-xs text-neutral-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9B7B3C]" />
          <p>
            CV services are kept completely separate from admission. Paying for
            a CV has no effect on whether an application is approved, or on how
            a profile is presented to employers.
          </p>
        </div>

        <div className="mt-5 text-right">
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-[#9B7B3C] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#9B7B3C]/90"
          >
            Enquire About CV Services
          </Link>
        </div>
      </div>
    </div>
  )
}
