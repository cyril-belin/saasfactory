// src/app/dashboard/layout.tsx

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { isFeatureEnabled } from '@/lib/services/feature-flags'
import { WorkspaceProvider } from '@/contexts/WorkspaceContext'
import { syncUser } from '@/lib/actions/user'

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

    // Ensure user data is synced in DB (fixes missing data on password login)
    await syncUser()

    const isMultiTenantEnabled = await isFeatureEnabled('multi_tenant')
    const isStorageEnabled = await isFeatureEnabled('storage')
    const isChangelogEnabled = await isFeatureEnabled('changelog_in_app')

    return (
        <WorkspaceProvider>
            <div className="flex h-screen bg-white">
                <Sidebar
                    user={user}
                    showWorkspaceSwitcher={isMultiTenantEnabled}
                    showStorage={isStorageEnabled}
                    showChangelog={isChangelogEnabled}
                />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </WorkspaceProvider>
    )
}
