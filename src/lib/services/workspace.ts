// src/lib/services/workspace.ts
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const getWorkspace = async (id: string) => {
    return prisma.workspace.findUnique({
        where: { id },
        include: {
            members: {
                include: {
                    user: true,
                },
            },
        },
    })
}

export const getUserWorkspaces = async (userId: string) => {
    return prisma.workspace.findMany({
        where: {
            OR: [
                { ownerId: userId },
                {
                    members: {
                        some: {
                            userId: userId,
                        },
                    },
                },
            ],
        },
        include: {
            owner: true,
        },
    })
}

export const createWorkspace = async (data: {
    name: string
    slug: string
    ownerId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
}) => {
    return prisma.workspace.create({
        data,
    })
}

export const updateWorkspace = async (
    id: string,
    data: {
        name?: string
        slug?: string
        subscriptionStatus?: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'UNPAID' | 'INACTIVE'
        stripeCustomerId?: string | null
        stripeSubscriptionId?: string | null
        stripePriceId?: string | null
        stripeCurrentPeriodEnd?: Date | null
    }
) => {
    return prisma.workspace.update({
        where: { id },
        data,
    })
}

export const deleteWorkspace = async (id: string) => {
    return prisma.workspace.delete({
        where: { id },
    })
}

import { MeteringService } from './metering'
import { MetricType } from '@prisma/client'

export const addMember = async (
    workspaceId: string,
    email: string,
    role: 'MEMBER' | 'OWNER' = 'MEMBER'
) => {
    // Check limit
    const canAdd = await MeteringService.checkLimit(workspaceId, MetricType.MEMBERS)
    if (!canAdd) {
        throw new Error('MEMBERS_LIMIT_REACHED')
    }

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        throw new Error('User not found')
    }

    const member = await prisma.workspaceMember.create({
        data: {
            workspaceId,
            userId: user.id,
            role,
        },
    })

    // Increment usage
    await MeteringService.incrementUsage(workspaceId, MetricType.MEMBERS, 1)

    return member
}

export const removeMember = async (workspaceId: string, userId: string) => {
    const result = await prisma.workspaceMember.delete({
        where: {
            workspaceId_userId: {
                workspaceId,
                userId,
            },
        },
    })

    // Decrement usage
    await MeteringService.incrementUsage(workspaceId, MetricType.MEMBERS, -1)

    return result
}
