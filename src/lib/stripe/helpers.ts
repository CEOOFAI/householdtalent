import { getStripe } from './config'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types'

/**
 * Get or create a Stripe customer for a user.
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name: string
): Promise<string> {
  const supabase = await createClient()

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .not('stripe_customer_id', 'is', null)
    .limit(1)
    .single()

  if (sub?.stripe_customer_id) {
    return sub.stripe_customer_id
  }

  const customer = await getStripe().customers.create({
    email,
    name,
    metadata: { user_id: userId },
  })

  return customer.id
}

/**
 * Create a Stripe Checkout session for candidate or employer subscription.
 */
export async function createCheckoutSession(
  userId: string,
  role: UserRole,
  priceId: string
): Promise<string> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, first_name, last_name')
    .eq('id', userId)
    .single()

  if (!profile) throw new Error('Profile not found')

  const customerId = await getOrCreateCustomer(
    userId,
    profile.email,
    `${profile.first_name} ${profile.last_name}`
  )

  const dashboardPath = role === 'candidate'
    ? '/dashboard/candidate/subscription'
    : '/dashboard/employer/subscription'

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}${dashboardPath}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}${dashboardPath}?cancelled=true`,
    metadata: { user_id: userId, role },
    subscription_data: {
      metadata: { user_id: userId, role },
    },
  })

  if (!session.url) throw new Error('Failed to create checkout session URL')
  return session.url
}

/**
 * Create a Stripe Billing Portal session.
 */
export async function createBillingPortalSession(
  customerId: string,
  role: UserRole
): Promise<string> {
  const returnPath = role === 'candidate'
    ? '/dashboard/candidate/subscription'
    : '/dashboard/employer/subscription'

  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}${returnPath}`,
  })

  return session.url
}
