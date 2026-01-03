
import { prisma } from '@/lib/prisma'
import { BillingClient } from './billing-client'

export default async function BillingSettingsPage() {
    const plans = await prisma.subscriptionPlan.findMany({
        orderBy: { amount: 'asc' }
    })

    return <BillingClient plans={plans} />
}
