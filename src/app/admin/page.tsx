// src/app/admin/page.tsx
import { StatsCard } from "@/components/dashboard/stats-card"
import { prisma } from "@/lib/prisma"
import { Users, Building2, CreditCard, Flag } from "lucide-react"

export const dynamic = 'force-dynamic' // Ensure real-time data

export default async function AdminDashboardPage() {
    // Parallel data fetching
    const [userCount, workspaceCount, featureFlagCount] = await Promise.all([
        prisma.user.count(),
        prisma.workspace.count(),
        prisma.featureFlag.count(),
    ])

    // Mocked MRR for now
    const mrr = 0

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                <p className="text-muted-foreground">
                    Vue d'ensemble de l'activité de la plateforme.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Utilisateurs Totaux"
                    value={userCount}
                    icon={Users}
                    description="Inscrits sur la plateforme"
                />
                <StatsCard
                    title="Workspaces"
                    value={workspaceCount}
                    icon={Building2}
                    description="Espaces de travail actifs"
                />
                <StatsCard
                    title="Revenu Mensuel (MRR)"
                    value={`${mrr} €`}
                    icon={CreditCard}
                    description="Revenu récurrent mensuel"
                />
                <StatsCard
                    title="Feature Flags"
                    value={featureFlagCount}
                    icon={Flag}
                    description="Fonctionnalités gérées"
                />
            </div>
        </div>
    )
}
