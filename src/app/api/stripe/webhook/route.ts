// src/app/api/stripe/webhook/route.ts
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { processStripeBusinessLogic } from '@/lib/services/stripe-processing'
import { sendWebhookFailedEmail } from '@/lib/services/email'

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

    // 1. Log event reception (idempotency + audit)
    // Cast to any to handle stale IDE types
    const dbEvent = await prisma.stripeEvent.upsert({
        where: { id: event.id },
        update: {
            // @ts-ignore
            lastAttempt: new Date(),
        },
        create: {
            id: event.id,
            type: event.type,
            // @ts-ignore
            status: 'PENDING',
            payload: event as any,
            retryCount: 0,
            lastAttempt: new Date(),
        }
    }) as any

    // Idempotency: If already SUCCESS, stop.
    if (dbEvent.status === 'SUCCESS') {
        return new NextResponse('Event already processed', { status: 200 })
    }

    try {
        await prisma.stripeEvent.update({
            where: { id: event.id },
            data: {
                // @ts-ignore
                status: 'PROCESSING'
            }
        })

        await processStripeBusinessLogic(event)

        await prisma.stripeEvent.update({
            where: { id: event.id },
            data: {
                // @ts-ignore
                status: 'SUCCESS',
                processed: true,
                retryCount: { increment: 1 }
            }
        })

        return NextResponse.json({ received: true })

    } catch (error: any) {
        console.error('Webhook processing failed:', error)

        const failedEvent = await prisma.stripeEvent.update({
            where: { id: event.id },
            data: {
                // @ts-ignore
                status: 'FAILED',
                error: error.message || 'Unknown error',
                retryCount: { increment: 1 }
            }
        }) as any

        // Alerting: If retry count reaches 3
        if (failedEvent.retryCount >= 3) {
            const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || 'admin@example.com'
            try {
                await sendWebhookFailedEmail(adminEmail, {
                    eventId: failedEvent.id,
                    eventType: failedEvent.type,
                    error: error.message || 'Unknown error',
                    retryCount: failedEvent.retryCount,
                    payloadSummary: JSON.stringify(failedEvent.payload || {}).slice(0, 500)
                })
            } catch (emailErr) {
                console.error('Failed to send alert email', emailErr)
            }
        }

        // We return 500 to let Stripe retry
        return new NextResponse('Webhook handler failed', { status: 500 })
    }
}
