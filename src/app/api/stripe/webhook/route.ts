// src/app/api/stripe/webhook/route.ts
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { sendPaymentSuccessEmail, sendPaymentFailedEmail } from '@/lib/services/email'

// Helper to get raw body buffer for signature verification
async function getRawBody(request: Request): Promise<Buffer> {
    const blob = await request.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

export async function POST(req: Request) {
    const body = await getRawBody(req)
    const headersList = await headers()
    const signature = headersList.get('Stripe-Signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event: Stripe.Event

    try {
        if (!signature || !webhookSecret) {
            return new NextResponse('Webhook signature or secret missing', { status: 400 })
        }

        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    // Idempotency check
    const existingEvent = await prisma.stripeEvent.findUnique({
        where: { id: event.id }
    })

    if (existingEvent) {
        console.log(`Event ${event.id} already processed`)
        return new NextResponse('Event already processed', { status: 200 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const workspaceId = session.metadata?.workspaceId

                if (workspaceId) {
                    await prisma.workspace.update({
                        where: { id: workspaceId },
                        data: {
                            subscriptionStatus: 'ACTIVE',
                            stripeCustomerId: session.customer as string,
                            stripeSubscriptionId: session.subscription as string
                        }
                    })
                }
                break
            }
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice
                const email = invoice.customer_email || ''

                // Find workspace by subscription or customer to be safe
                // Optional: Update workspace status explicitly to ACTIVE

                if (email && invoice.hosted_invoice_url) {
                    await sendPaymentSuccessEmail(
                        email,
                        'Abonnement Pro', // Can be dynamic based on price ID
                        (invoice.amount_paid / 100).toFixed(2) + ' €'
                    )
                }
                break
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice
                const email = invoice.customer_email || ''

                // Find workspace and mark as PAST_DUE or CANCELLED if needed

                if (email) {
                    await sendPaymentFailedEmail(email, (invoice.amount_due / 100).toFixed(2) + ' €')
                }
                break
            }
            // Handle cancellation
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription

                await prisma.workspace.updateMany({
                    where: { stripeSubscriptionId: subscription.id },
                    data: { subscriptionStatus: 'CANCELED' }
                })
                break
            }
        }

        // Log event
        await prisma.stripeEvent.create({
            data: {
                id: event.id,
                type: event.type,
                processed: true
            }
        })

        return NextResponse.json({ received: true })

    } catch (error) {
        console.error('Webhook processing failed:', error)
        return new NextResponse('Webhook handler failed', { status: 500 })
    }
}
