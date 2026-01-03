// src/app/dashboard/layout.tsx

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { isFeatureEnabled } from '@/lib/services/feature-flags'
import { getUserWorkspaces } from '@/lib/services/workspace'
import { WorkspaceProvider } from '@/contexts/workspace-context'
import { cookies } from 'next/headers'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const workspaces = await getUserWorkspaces(user.id)
    const isMultiTenantEnabled = await isFeatureEnabled('multi_tenant')

    // Determine default workspace
    const cookieStore = await cookies()
    const lastWorkspaceId = cookieStore.get('workspaceId')?.value

    let currentWorkspace = workspaces.find(w => w.id === lastWorkspaceId) || workspaces[0]

    // If no workspace exists, we might need to handle onboarding (not covered here, assuming 1 exists from signup)
    // The Signup flow creates one, so it should be fine.

    return (
        <WorkspaceProvider initialWorkspace={currentWorkspace}>
            <div className="flex h-screen bg-white">
                <Sidebar
                    user={user}
                    showWorkspaceSwitcher={isMultiTenantEnabled}
                    workspaces={workspaces}
                />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </WorkspaceProvider>
    )
}
