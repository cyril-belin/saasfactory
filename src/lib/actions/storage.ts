'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { MetricType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function incrementStorageUsage(bytes: number, workspaceId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Verify user is member of workspace
    const member = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId,
            userId: user.id
        }
    })

    const owner = await prisma.workspace.findFirst({
        where: {
            id: workspaceId,
            ownerId: user.id
        }
    })

    if (!member && !owner) {
        throw new Error('Unauthorized access to workspace')
    }

    await updateUsage(workspaceId, bytes)
}

async function updateUsage(workspaceId: string, bytes: number) {
    const mb = bytes / (1024 * 1024)

    // Upsert usage record
    const usage = await prisma.usage.upsert({
        where: {
            workspaceId_metricType: {
                workspaceId,
                metricType: MetricType.STORAGE_MB
            }
        },
        create: {
            workspaceId,
            metricType: MetricType.STORAGE_MB,
            currentValue: Math.ceil(mb),
            maxValue: 1000 // Default limit, should come from plan
        },
        update: {
            currentValue: {
                increment: Math.ceil(mb)
            }
        }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/feature/storage')
    return usage
}
