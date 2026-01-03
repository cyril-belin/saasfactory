import { prisma } from '@/lib/prisma'
import { WebhooksClient } from '@/components/admin/webhooks-client'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminWebhooksPage() {
    // Auth Check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Check Role
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email }
    }) as any

    // In a real app we might redirect to /dashboard or 403 page
    // Using string literal to avoid stale enum import issues
    if (!dbUser || dbUser.role !== 'SUPER_ADMIN') {
        redirect('/dashboard')
    }

    const events = await prisma.stripeEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
    })

    // Serialize Dates
    // Casting event to any to access new fields (lastAttempt) if types are stale
    const serializedEvents = events.map((e: any) => ({
        ...e,
        createdAtString: e.createdAt.toISOString(),
        lastAttemptString: e.lastAttempt ? e.lastAttempt.toISOString() : null
    }))

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Webhooks Stripe</h1>
                <div className="text-sm text-muted-foreground">
                    Derniers 100 événements
                </div>
            </div>

            <WebhooksClient initialEvents={serializedEvents} />
        </div>
    )
}
