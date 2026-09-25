import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/config'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Missing signature or secret' },
      { status: 400 }
    )
  }

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch {
    console.error('stripe webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Webhooks arrive with no user session, so writes go through the service role.
  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const tier = session.metadata?.tier

      if (userId && tier) {
        await supabase
          .from('candidate_profiles')
          .update({ tier })
          .eq('user_id', userId)

        await supabase.from('subscriptions').upsert(
          {
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            tier,
            status: 'active',
            current_period_start: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )

        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'subscription_activated',
          title: 'Subscription Activated',
          body: `Your ${tier} plan is now active. Enjoy your upgraded profile!`,
          action_url: '/dashboard/candidate/subscription',
        })
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const newStatus =
        subscription.status === 'active' ? 'active' : 'past_due'

      await supabase
        .from('subscriptions')
        .update({ status: newStatus })
        .eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single()

      if (sub) {
        // Downgrade to free
        await supabase
          .from('candidate_profiles')
          .update({ tier: 'free' })
          .eq('user_id', sub.user_id)

        await supabase
          .from('subscriptions')
          .update({ status: 'expired' })
          .eq('stripe_subscription_id', subscription.id)

        // Notify user
        await supabase.from('notifications').insert({
          user_id: sub.user_id,
          type: 'subscription_expired',
          title: 'Subscription Ended',
          body: 'Your subscription has ended. Upgrade again to regain access to premium features.',
          action_url: '/dashboard/candidate/subscription',
        })
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (sub) {
        await supabase.from('notifications').insert({
          user_id: sub.user_id,
          type: 'payment_failed',
          title: 'Payment Failed',
          body: 'Your latest payment failed. Please update your payment method.',
          action_url: '/dashboard/candidate/subscription',
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
