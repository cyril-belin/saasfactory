// src/app/api/stripe/portal/route.ts
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

        const { workspaceId } = await req.json()

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
        })

        if (!workspace || workspace.ownerId !== user.id) {
            return new NextResponse('Unauthorized Workspace Access', { status: 403 })
        }

        // If no Stripe Customer ID, create one
        let customerId = workspace.stripeCustomerId

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email!,
                name: workspace.name,
                metadata: {
                    workspaceId: workspaceId,
                }
            })

            customerId = customer.id

            await prisma.workspace.update({
                where: { id: workspaceId },
                data: { stripeCustomerId: customerId }
            })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${APP_URL}/dashboard/settings/billing`,
        })

        return NextResponse.json({ url: session.url })

    } catch (error) {
        console.error('Stripe portal error:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
