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

        if (!workspace.stripeCustomerId) {
            return new NextResponse('No Stripe Customer Found', { status: 400 })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: workspace.stripeCustomerId,
            return_url: `${APP_URL}/dashboard/settings/billing`,
        })

        return NextResponse.json({ url: session.url })

    } catch (error) {
        console.error('Stripe portal error:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
