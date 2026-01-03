// src/contexts/workspace-context.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Define the shape of the workspace object (subset of what we need)
type Workspace = {
    id: string
    name: string
    slug: string
    role?: string // 'OWNER' | 'MEMBER'
}

type WorkspaceContextType = {
    workspace: Workspace | null
    setWorkspace: (workspace: Workspace) => void
    isLoading: boolean
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({
    children,
    initialWorkspace
}: {
    children: React.ReactNode
    initialWorkspace?: Workspace | null
}) {
    const [workspace, setWorkspace] = useState<Workspace | null>(initialWorkspace || null)
    const [isLoading, setIsLoading] = useState(!initialWorkspace)
    const router = useRouter()

    useEffect(() => {
        if (initialWorkspace) {
            setWorkspace(initialWorkspace)
            setIsLoading(false)
        }
    }, [initialWorkspace])

    return (
        <WorkspaceContext.Provider value={{ workspace, setWorkspace, isLoading }}>
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
