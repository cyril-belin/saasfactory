// src/lib/services/payment.ts
import { prisma } from '@/lib/prisma'

export const hasActiveSubscription = async (workspaceId: string): Promise<boolean> => {
    const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { subscriptionStatus: true },
    })

    return workspace?.subscriptionStatus === 'ACTIVE'
}

export const requireActiveSubscription = async (workspaceId: string) => {
    const isActive = await hasActiveSubscription(workspaceId)

    if (!isActive) {
        throw new Error('Subscription active requise')
    }
}

export const formatAmount = (amount: number, currency: string = 'eur') => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency,
    }).format(amount / 100)
}
