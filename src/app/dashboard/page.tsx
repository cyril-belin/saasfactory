// src/app/dashboard/page.tsx

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ChangelogWidget } from '@/components/dashboard/changelog-widget'
import { DashboardGrid } from '@/components/dashboard/dashboard-grid'
import { QuickActionsWidget, QuickAction } from '@/components/dashboard/widgets/quick-actions-widget'
import { StorageWidget } from '@/components/dashboard/widgets/storage-widget'
import { Building, CreditCard, Users, UserPlus, FileText, Settings, UploadCloud } from 'lucide-react'
import { isFeatureEnabled } from '@/lib/services/feature-flags'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Get workspaces
    const workspaces = await prisma.workspace.findMany({
        where: {
            OR: [
                { ownerId: user.id },
                {
                    members: {
                        some: { userId: user.id },
                    },
                },
            ],
        },
        include: {
            members: true
        }
    })

    const currentWorkspace = workspaces[0]

    // Fetch Feature Flags
    const isChangelogEnabled = await isFeatureEnabled('changelog_in_app')
    const isStorageEnabled = await isFeatureEnabled('storage')

    // Fetch Current Plan details if exists
    let planName = 'Plan Gratuit'
    if (currentWorkspace?.stripePriceId) {
        const plan = await prisma.subscriptionPlan.findUnique({
            where: { priceId: currentWorkspace.stripePriceId }
        })
        if (plan) planName = plan.name
    }

    // Quick Actions Configuration
    const quickActions: QuickAction[] = [
        {
            label: "Gérer l'équipe",
            href: "/dashboard/settings/workspace",
            icon: UserPlus,
            variant: "outline"
        },
        {
            label: "Mon Abonnement",
            href: "/dashboard/settings/billing",
            icon: CreditCard,
            variant: "outline"
        },
        {
            label: "Paramètres",
            href: "/dashboard/settings",
            icon: Settings,
            variant: "ghost"
        }
    ]

    // Add storage action if enabled
    if (isStorageEnabled) {
        quickActions.unshift({
            label: "Mes Fichiers",
            href: "/dashboard/storage",
            icon: UploadCloud,
            variant: "default"
        })
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Bonjour, {user.email?.split('@')[0]}
                </h1>
                <p className="text-muted-foreground">
                    Voici un aperçu de vos activités récentes.
                </p>
            </div>

            {!currentWorkspace ? (
                <div className="p-10 border border-dashed rounded-xl flex flex-col items-center justify-center text-center gap-4">
                    <Building className="h-10 w-10 text-muted-foreground" />
                    <div>
                        <h3 className="font-semibold text-lg">Aucun workspace</h3>
                        <p className="text-sm text-muted-foreground">Vous n'appartenez à aucun workspace pour le moment.</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsCard
                            title="Workspace"
                            value={currentWorkspace.name}
                            icon={Building}
                            description="Espace de travail actif"
                        />
                        <StatsCard
                            title="Abonnement"
                            value={currentWorkspace.subscriptionStatus === 'ACTIVE' ? planName : 'Gratuit'}
                            icon={CreditCard}
                            description={currentWorkspace.subscriptionStatus === 'ACTIVE' ? 'Abonnement actif' : 'Pas d\'abonnement actif'}
                        />
                        <StatsCard
                            title="Membres"
                            value={currentWorkspace.members.length + 1}
                            icon={Users}
                            description="Utilisateurs dans cet espace"
                        />
                    </div>

                    {/* Modular Widget Grid */}
                    <DashboardGrid>
                        {/* Quick Actions - Always visible */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                            <QuickActionsWidget actions={quickActions} />
                        </div>

                        {/* Storage Widget - Conditional */}
                        {isStorageEnabled && (
                            <div className="col-span-1">
                                <StorageWidget
                                    usedBytes={1024 * 1024 * 350} // TODO: Fetch real usage
                                    totalBytes={1024 * 1024 * 1024} // 1GB Limit
                                />
                            </div>
                        )}

                        {/* Changelog Widget - Conditional */}
                        {isChangelogEnabled && (
                            <div className="col-span-1 md:col-span-2 lg:col-span-1">
                                <ChangelogWidget userId={user.id} />
                            </div>
                        )}
                    </DashboardGrid>
                </>
            )}
        </div>
    )
}
