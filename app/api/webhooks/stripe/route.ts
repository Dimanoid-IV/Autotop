import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle checkout session completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    console.log('Payment successful:', {
      sessionId: session.id,
      metadata: session.metadata
    })
    
    const businessId = session.metadata?.businessId
    const plan = session.metadata?.plan // "1month", "2months", "6months"
    
    if (businessId && plan) {
      // Calculate duration based on plan
      const durationDays = {
        '1month': 30,
        '2months': 60,
        '6months': 180
      }[plan] || 30

      try {
        // Update business to featured
        await prisma.business.update({
          where: { id: businessId },
          data: {
            isFeatured: true,
            featuredUntil: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
            featuredPlan: plan,
            featuredOrder: Math.floor(Math.random() * 1000) // Random order for display
          }
        })

        console.log(`Business ${businessId} set to featured for ${durationDays} days`)
      } catch (error) {
        console.error('Error updating business:', error)
        return NextResponse.json(
          { error: 'Failed to update business' },
          { status: 500 }
        )
      }
    } else {
      console.warn('Missing businessId or plan in session metadata')
    }
  }

  // Handle subscription events
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    
    const businessId = subscription.metadata?.businessId
    
    if (businessId) {
      try {
        await prisma.business.update({
          where: { id: businessId },
          data: {
            isFeatured: false,
            featuredUntil: null,
            featuredPlan: null,
            featuredOrder: null
          }
        })

        console.log(`Business ${businessId} featured status removed`)
      } catch (error) {
        console.error('Error removing featured status:', error)
      }
    }
  }

  return NextResponse.json({ received: true })
}
