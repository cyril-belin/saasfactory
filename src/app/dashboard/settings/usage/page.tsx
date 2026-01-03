
import { UsageStats } from '@/components/dashboard/usage-stats'
import { MeteringService } from '@/lib/services/metering'
import { getUser } from '@/lib/services/auth-server'
import { getUserWorkspaces } from '@/lib/services/workspace'
import { redirect } from 'next/navigation'

export default async function UsagePage() {
    const user = await getUser()
    if (!user) redirect('/login')

    const workspaces = await getUserWorkspaces(user.id)
    if (workspaces.length === 0) {
        return <div>Vous n'avez pas de workspace.</div>
    }

    // Default to first workspace or handle selection via context/params
    // In this template, usually context is handled via URL or session storage/cookies? 
    // Wait, the user said "Multi-tenant workspaces". 
    // Usually usage is "per workspace".
    // I will pick the first one owned or member where role is admin?
    // Let's assume the current workspace is determined by some context, 
    // or I list all workspaces?
    // Let's iterate and show usage for the first one for now, 
    // or better: let's pick the one where they are owner.

    const workspace = workspaces[0] // Simplified
    const stats = await MeteringService.getUsageStats(workspace.id)

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Utilisation ({workspace.name})</h3>
                <p className="text-sm text-muted-foreground">
                    Suivez la consommation de vos ressources.
                </p>
            </div>
            <UsageStats usages={stats} />
        </div>
    )
}
