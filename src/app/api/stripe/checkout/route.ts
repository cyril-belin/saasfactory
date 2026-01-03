// src/app/api/stripe/checkout/route.ts
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { priceId, workspaceId } = await req.json()

        // 1. Verify workspace access
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: { owner: true } // Need email for stripe customer
        })

        if (!workspace || workspace.ownerId !== user.id) {
            return new NextResponse('Unauthorized Workspace Access', { status: 403 })
        }

        // 2. Create or retrieve Stripe customer
        let stripeCustomerId = workspace.stripeCustomerId

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: workspace.owner.email,
                name: workspace.name,
                metadata: {
                    workspaceId: workspace.id,
                }
            })
            stripeCustomerId = customer.id

            await prisma.workspace.update({
                where: { id: workspace.id },
                data: { stripeCustomerId: stripeCustomerId }
            })
        }

        // 3. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${APP_URL}/dashboard?success=true`,
            cancel_url: `${APP_URL}/dashboard/settings/billing?canceled=true`,
            metadata: {
                workspaceId: workspace.id,
            },
            subscription_data: {
                metadata: {
                    workspaceId: workspace.id
                }
            }
        })

        return NextResponse.json({ url: session.url })

    } catch (error) {
        console.error('Stripe checkout error:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
