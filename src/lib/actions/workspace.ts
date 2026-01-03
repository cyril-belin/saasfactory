// src/lib/actions/workspace.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateWorkspaceAction(
    workspaceId: string,
    data: { name: string; slug?: string }
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Authorization check: Is user owner?
    // Using prisma directly to check ownership
    const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId }
    })

    if (!workspace) {
        throw new Error('Workspace not found')
    }

    if (workspace.ownerId !== user.id) {
        throw new Error('Unauthorized: Only owner can update workspace')
    }

    await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
            name: data.name,
            // Only update slug if provided (and maybe add checks for uniqueness/format)
            ...(data.slug && { slug: data.slug })
        }
    })

    revalidatePath('/dashboard/settings/workspace')
    revalidatePath('/dashboard') // Update sidebar name
}
