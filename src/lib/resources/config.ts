// Resource products - one-time purchases via Stripe

export const RESOURCE_PRODUCTS = {
  nda: {
    id: 'nda',
    name: 'NDA (Non-Disclosure Agreement)',
    price: 2500, // £25 in pence
    displayPrice: '£25',
    stripePriceId: process.env.STRIPE_PRICE_RESOURCE_NDA || '',
    description: 'Professionally structured template for private households and discreet environments.',
    features: [
      'Professionally structured template',
      'Suitable for domestic staff environments',
      'Editable format',
    ],
  },
  'job-description': {
    id: 'job-description',
    name: 'Job Description Template',
    price: 2500, // £25 in pence
    displayPrice: '£25',
    stripePriceId: process.env.STRIPE_PRICE_RESOURCE_JOB_DESC || '',
    description: 'Structured role format with responsibilities and requirements, ready to use.',
    features: [
      'Structured role format',
      'Responsibilities + requirements',
      'Ready to use',
    ],
  },
  'full-pack': {
    id: 'full-pack',
    name: 'Full Template Pack',
    price: 4500, // £45 in pence
    displayPrice: '£45',
    stripePriceId: process.env.STRIPE_PRICE_RESOURCE_FULL_PACK || '',
    description: 'Both templates at a reduced price.',
    features: [
      'NDA',
      'Job Description Template',
    ],
    highlight: true,
  },
} as const

export type ResourceProductId = keyof typeof RESOURCE_PRODUCTS

// Which templates each product unlocks
export const PRODUCT_TEMPLATES: Record<ResourceProductId, string[]> = {
  nda: ['nda'],
  'job-description': ['job-description'],
  'full-pack': ['nda', 'job-description'],
}
