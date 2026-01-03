'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getUserWorkspacesAction } from '@/lib/actions/workspace'

interface Workspace {
    id: string
    name: string
    slug: string
    ownerId: string
    subscriptionStatus: string
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    stripePriceId: string | null
    stripeCurrentPeriodEnd: Date | null
}

interface WorkspaceContextType {
    activeWorkspace: Workspace | null
    workspaces: Workspace[]
    setActiveWorkspace: (workspace: Workspace) => void
    isLoading: boolean
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
    const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null)
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadWorkspaces() {
            try {
                // Fetch user's workspaces using server action
                const result = await getUserWorkspacesAction()

                if (result.success && result.data) {
                    setWorkspaces(result.data as Workspace[])

                    // Set first workspace as active by default
                    if (result.data.length > 0 && !activeWorkspace) {
                        setActiveWorkspace(result.data[0] as Workspace)
                    }
                }
            } catch (error) {
                console.error('Error loading workspaces:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadWorkspaces()
    }, [])


    return (
        <WorkspaceContext.Provider
            value={{
                activeWorkspace,
                workspaces,
                setActiveWorkspace,
                isLoading,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    )
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext)
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider')
    }
    return context
}
