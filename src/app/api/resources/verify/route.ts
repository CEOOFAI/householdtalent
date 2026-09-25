import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/config'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  // Verify the user is authenticated
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Verify payment was successful and belongs to this user
    if (
      session.payment_status !== 'paid' ||
      session.metadata?.user_id !== user.id ||
      session.metadata?.type !== 'resource_purchase'
    ) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 403 })
    }

    return NextResponse.json({ verified: true, product: session.metadata.product_id })
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
