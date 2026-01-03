'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface UpdateWorkspaceInput {
    workspaceId: string
    name: string
}

interface ActionResponse {
    success: boolean
    message: string
    data?: any
}

/**
 * Secure server action to update workspace
 * Includes authentication and ownership verification
 */
export async function updateWorkspaceAction(
    input: UpdateWorkspaceInput
): Promise<ActionResponse> {
    try {
        // 1. Verify user is authenticated
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return {
                success: false,
                message: 'Non authentifié. Veuillez vous connecter.',
            }
        }

        // 2. Fetch workspace from database
        const workspace = await prisma.workspace.findUnique({
            where: { id: input.workspaceId },
            include: {
                members: {
                    where: { userId: user.id },
                },
            },
        })

        if (!workspace) {
            return {
                success: false,
                message: 'Workspace introuvable.',
            }
        }

        // 3. Verify user is owner or has appropriate permissions
        const isOwner = workspace.ownerId === user.id
        const isMember = workspace.members.length > 0

        if (!isOwner && !isMember) {
            return {
                success: false,
                message: 'Non autorisé. Vous n\'avez pas accès à ce workspace.',
            }
        }

        // 4. Only owners can update workspace settings
        if (!isOwner) {
            return {
                success: false,
                message: 'Seul le propriétaire peut modifier les paramètres du workspace.',
            }
        }

        // 5. Validate input
        if (!input.name || input.name.trim().length < 2) {
            return {
                success: false,
                message: 'Le nom doit faire au moins 2 caractères.',
            }
        }

        // 6. Update workspace (only allow updating name, slug is immutable)
        const updatedWorkspace = await prisma.workspace.update({
            where: { id: input.workspaceId },
            data: {
                name: input.name.trim(),
            },
        })

        // 7. Revalidate the settings page
        revalidatePath('/dashboard/settings/workspace')

        return {
            success: true,
            message: 'Workspace mis à jour avec succès.',
            data: updatedWorkspace,
        }
    } catch (error) {
        console.error('Error updating workspace:', error)
        return {
            success: false,
            message: 'Erreur lors de la mise à jour du workspace.',
        }
    }
}

/**
 * Get workspace by ID with ownership verification
 */
export async function getWorkspaceAction(workspaceId: string): Promise<ActionResponse> {
    try {
        // 1. Verify user is authenticated
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return {
                success: false,
                message: 'Non authentifié.',
            }
        }

        // 2. Fetch workspace with access verification
        const workspace = await prisma.workspace.findFirst({
            where: {
                id: workspaceId,
                OR: [
                    { ownerId: user.id },
                    {
                        members: {
                            some: {
                                userId: user.id,
                            },
                        },
                    },
                ],
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        })

        if (!workspace) {
            return {
                success: false,
                message: 'Workspace introuvable ou accès non autorisé.',
            }
        }

        return {
            success: true,
            message: 'Workspace récupéré.',
            data: workspace,
        }
    } catch (error) {
        console.error('Error fetching workspace:', error)
        return {
            success: false,
            message: 'Erreur lors de la récupération du workspace.',
        }
    }
}

/**
 * Get all workspaces for the authenticated user
 */
export async function getUserWorkspacesAction(): Promise<ActionResponse> {
    try {
        // 1. Verify user is authenticated
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return {
                success: false,
                message: 'Non authentifié.',
            }
        }

        // 2. Fetch user's workspaces
        const workspaces = await prisma.workspace.findMany({
            where: {
                OR: [
                    { ownerId: user.id },
                    {
                        members: {
                            some: {
                                userId: user.id,
                            },
                        },
                    },
                ],
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        })

        return {
            success: true,
            message: 'Workspaces récupérés.',
            data: workspaces,
        }
    } catch (error) {
        console.error('Error fetching workspaces:', error)
        return {
            success: false,
            message: 'Erreur lors de la récupération des workspaces.',
        }
    }
}
