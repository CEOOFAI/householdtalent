import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/config'
import { createClient } from '@/lib/supabase/server'
import { RESOURCE_PRODUCTS, type ResourceProductId } from '@/lib/resources/config'

export async function POST(req: NextRequest) {
  try {
    const { productId } = (await req.json()) as { productId: string }

    if (!productId || !(productId in RESOURCE_PRODUCTS)) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    }

    const product = RESOURCE_PRODUCTS[productId as ResourceProductId]

    // Get current user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const stripe = getStripe()

    // Create a one-time Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: profile.email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
        product_id: productId,
        type: 'resource_purchase',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/employer/resources/success?session_id={CHECKOUT_SESSION_ID}&product=${productId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/employer/resources?cancelled=true`,
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch {
    console.error('resource checkout error')
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
