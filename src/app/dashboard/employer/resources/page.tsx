'use client'

import { useState } from 'react'
import { FileText, Package, Loader2, Check, Star } from 'lucide-react'
import { RESOURCE_PRODUCTS, type ResourceProductId } from '@/lib/resources/config'

const PRODUCT_ORDER: ResourceProductId[] = ['nda', 'job-description', 'full-pack']

const PRODUCT_ICONS: Record<ResourceProductId, typeof FileText> = {
  nda: FileText,
  'job-description': FileText,
  'full-pack': Package,
}

export default function ResourcesPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handlePurchase(productId: ResourceProductId) {
    setLoading(productId)
    try {
      const res = await fetch('/api/resources/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Checkout failed')
      }

      const { url } = await res.json()
      window.location.href = url
    } catch {
      setLoading(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-light text-white">
          Professional Household Templates
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Designed for private households and discreet environments
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {PRODUCT_ORDER.map((id) => {
          const product = RESOURCE_PRODUCTS[id]
          const Icon = PRODUCT_ICONS[id]
          const isHighlighted = 'highlight' in product && product.highlight

          return (
            <div
              key={id}
              className={`relative flex flex-col rounded-xl border p-6 transition-all ${
                isHighlighted
                  ? 'border-[#9B7B3C]/60 bg-[#9B7B3C]/5'
                  : 'border-neutral-800 bg-neutral-900/40'
              }`}
            >
              {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 rounded-full bg-[#9B7B3C] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-black">
                    <Star className="h-3 w-3" /> Best Value
                  </span>
                </div>
              )}

              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#9B7B3C]/10">
                <Icon className="h-5 w-5 text-[#9B7B3C]" />
              </div>

              <h3 className="font-heading text-lg font-medium text-white">
                {product.name}
              </h3>

              <p className="mt-3 font-heading text-3xl font-bold text-white">
                {product.displayPrice}
              </p>

              <ul className="mt-4 flex-1 space-y-2">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-neutral-400"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9B7B3C]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(id)}
                disabled={loading !== null}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50 ${
                  isHighlighted
                    ? 'bg-[#9B7B3C] text-black hover:bg-[#7B6535]'
                    : 'border border-neutral-700 bg-transparent text-white hover:bg-neutral-800'
                }`}
              >
                {loading === id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  'Download'
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Legal Disclaimer */}
      <div className="mt-10 rounded-lg border border-neutral-800/50 bg-neutral-900/20 p-4">
        <p className="text-xs leading-relaxed text-neutral-500">
          These documents are provided as general templates for guidance only and
          do not constitute legal advice. Users should seek independent legal
          advice to ensure documents comply with applicable laws in their
          jurisdiction.
        </p>
      </div>
    </div>
  )
}
