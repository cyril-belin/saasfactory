// src/app/dashboard/layout.tsx

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { isFeatureEnabled } from '@/lib/services/feature-flags'

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

    const isMultiTenantEnabled = await isFeatureEnabled('multi_tenant')

    return (
        <div className="flex h-screen bg-white">
            <Sidebar user={user} showWorkspaceSwitcher={isMultiTenantEnabled} />
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}
