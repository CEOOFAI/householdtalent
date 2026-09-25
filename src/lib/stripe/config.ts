import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      apiVersion: '2026-02-25.clover',
    })
  }
  return _stripe
}

// All prices are in pence (GBP minor unit)

// Employer: role access plans (one-time, 30-day access)
export const EMPLOYER_PLANS = {
  standard: {
    name: 'Standard',
    price: 16500, // £165
    displayPrice: '£165',
    subtitle: '30 days access',
    liveRoles: 1,
    duration: '30 days',
    stripePriceId: process.env.STRIPE_PRICE_EMPLOYER_STANDARD || '',
    features: [
      '1 live role at any time',
      'Replace roles as filled within 30 days',
      'Professionally structured role',
      'Access to curated candidates',
      'Filtered introductions',
    ],
    cta: 'Submit a Role Brief',
  },
  priority: {
    name: 'Ongoing Hiring',
    price: 29500, // £295
    displayPrice: '£295',
    subtitle: '30 days access',
    liveRoles: 2,
    duration: '30 days',
    stripePriceId: process.env.STRIPE_PRICE_EMPLOYER_PRIORITY || '',
    features: [
      'Up to 2 live roles at any time',
      'Replace roles as filled within 30 days',
      'Increased visibility',
      'Faster candidate exposure',
    ],
    cta: 'Submit Role Briefs',
    popular: true,
  },
  professional: {
    name: 'Priority Search',
    price: 44500, // £445
    displayPrice: '£445',
    subtitle: '30 days access',
    liveRoles: 3,
    duration: '30 days',
    stripePriceId: process.env.STRIPE_PRICE_EMPLOYER_PROFESSIONAL || '',
    features: [
      'Everything in Ongoing Hiring',
      'Featured placement across platform',
      'Curated shortlist delivered',
      'Role profile + NDA templates included',
    ],
    cta: 'Request Talent Search',
  },
  extended: {
    name: 'Professional / Agency',
    price: 67500, // £675
    displayPrice: '£675',
    subtitle: '30 days access',
    liveRoles: 5,
    duration: '30 days',
    stripePriceId: process.env.STRIPE_PRICE_EMPLOYER_EXTENDED || '',
    features: [
      'Up to 5 live roles at any time',
      'Replace roles as filled within 30 days',
      'Designed for agencies & multi-role hiring',
      'Priority visibility across all roles',
    ],
    footnote: 'Live roles can be replaced at any time within your 30-day access period',
    cta: 'Request Access',
  },
} as const

// Candidate: profile tiers
export const CANDIDATE_PLANS = {
  free: {
    name: 'Standard Profile',
    price: 0,
    displayPrice: 'Complimentary',
    interval: null,
    stripePriceId: null,
    features: [
      'Complimentary for accepted members',
      'Submit your application and supporting CV',
      'Basic profile (photo, job title, location, languages)',
      'Considered for current and upcoming introductions',
    ],
  },
  premium: {
    name: 'Premium Profile',
    price: 5000, // £50
    displayPrice: '£50',
    interval: '3_months' as const,
    stripePriceId: process.env.STRIPE_PRICE_CANDIDATE_PREMIUM || '',
    features: [
      'Enhanced profile (more detailed information)',
      'Gold-highlighted profile',
      'Increased visibility to employers',
      'Professionally structured CV',
      'Downloadable CV',
    ],
    tagline: 'A professionally structured profile ensures you are presented at the highest standard.',
  },
} as const

export type EmployerPlanKey = keyof typeof EMPLOYER_PLANS
export type CandidatePlanKey = keyof typeof CANDIDATE_PLANS

// Legacy exports for backwards compatibility
export const EMPLOYER_ROLE_PLANS = EMPLOYER_PLANS
export type EmployerRolePlanKey = EmployerPlanKey
