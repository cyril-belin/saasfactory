'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

/**
 * Ensures the authenticated user exists in the Prisma database 
 * and has at least one workspace.
 */
export async function syncUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return

    try {
        // 1. Upsert User
        await prisma.user.upsert({
            where: { id: user.id },
            update: { email: user.email },
            create: {
                id: user.id,
                email: user.email,
            },
        })

        // 2. Check for Workspace
        const existingWorkspace = await prisma.workspace.findFirst({
            where: { ownerId: user.id },
        })

        if (!existingWorkspace) {
            await prisma.workspace.create({
                data: {
                    name: `${user.email.split('@')[0]}'s Workspace`,
                    slug: `workspace-${user.id.slice(0, 8)}`,
                    ownerId: user.id,
                    subscriptionStatus: 'INACTIVE', // Default to Inactive (Free)
                },
            })
            console.log(`[Sync] Created default workspace for ${user.email}`)
        }
    } catch (error) {
        console.error('[Sync] Error syncing user:', error)
    }
}
