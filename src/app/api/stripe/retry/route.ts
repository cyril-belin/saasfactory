import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { processStripeBusinessLogic } from '@/lib/services/stripe-processing'
import { sendWebhookFailedEmail } from '@/lib/services/email'

// We avoid importing UserRole directly if the IDE is having trouble resolving it after generation
// import { UserRole } from '@prisma/client' 

const retrySchema = z.object({
    eventId: z.string().min(1)
})

export async function POST(req: NextRequest) {
    try {
        // 1. Auth check
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // 2. Role check
        // Cast to any to avoid stale type errors in IDE
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email }
        }) as any

        // Check for SUPER_ADMIN role (string comparison to be safe)
        if (!dbUser || dbUser.role !== 'SUPER_ADMIN') {
            return new NextResponse('Forbidden: Webhook management requires SUPER_ADMIN role', { status: 403 })
        }

        // 3. Validation
        const body = await req.json()
        const result = retrySchema.safeParse(body)

        if (!result.success) {
            return new NextResponse('Invalid request body', { status: 400 })
        }

        const { eventId } = result.data

        // 4. Fetch Event
        // Cast to any to access new fields if types are stale
        const event = await prisma.stripeEvent.findUnique({
            where: { id: eventId }
        }) as any

        if (!event) {
            return new NextResponse('Event not found', { status: 404 })
        }

        // 5. Process
        try {
            if (!event.payload) {
                throw new Error('Event payload is missing')
            }

            // Update to PROCESSING
            await prisma.stripeEvent.update({
                where: { id: eventId },
                data: {
                    // @ts-ignore: handling stale types
                    status: 'PROCESSING',
                    lastAttempt: new Date()
                }
            })

            // Process logic
            await processStripeBusinessLogic(event.payload)

            // Update to SUCCESS
            const updatedEvent = await prisma.stripeEvent.update({
                where: { id: eventId },
                data: {
                    // @ts-ignore: handling stale types
                    status: 'SUCCESS',
                    processed: true,
                    retryCount: { increment: 1 }
                }
            })

            return NextResponse.json({ success: true, event: updatedEvent })

        } catch (error: any) {
            console.error('Manual retry failed:', error)

            // Update to FAILED
            const failedEvent = await prisma.stripeEvent.update({
                where: { id: eventId },
                data: {
                    // @ts-ignore: handling stale types
                    status: 'FAILED',
                    error: error.message || 'Unknown error',
                    retryCount: { increment: 1 }
                }
            }) as any

            // Alerting: If retry count reaches threshold (e.g. 3)
            if (failedEvent.retryCount >= 3) {
                try {
                    await sendWebhookFailedEmail(user.email!, {
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

            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

    } catch (error) {
        console.error('Route error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
