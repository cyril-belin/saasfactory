// src/app/dashboard/page.tsx

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ChangelogWidget } from '@/components/dashboard/changelog-widget'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Building, CreditCard, Users, ArrowRight } from 'lucide-react'

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
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsCard
                            title="Workspace"
                            value={currentWorkspace.name}
                            icon={Building}
                            description="Espace de travail actif"
                        />
                        <StatsCard
                            title="Statut Abonnement"
                            value={currentWorkspace.subscriptionStatus === 'ACTIVE' ? 'Actif' : 'Inactif'}
                            icon={CreditCard}
                            description={currentWorkspace.subscriptionStatus === 'ACTIVE' ? 'Plan Pro' : 'Plan Gratuit (ou expiré)'}
                        />
                        <StatsCard
                            title="Membres"
                            value={currentWorkspace.members.length + 1} // +1 for owner (if not in members table logic)
                            icon={Users}
                            description="Utilisateurs dans cet espace"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Main Feature CTA Area */}
                            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 border border-primary/20">
                                <h2 className="text-2xl font-bold mb-2">Prêt à commencer ?</h2>
                                <p className="text-gray-600 mb-6 max-w-xl">
                                    Configurez votre première fonctionnalité ou explorez les réglages de votre workspace dès maintenant.
                                </p>
                                <div className="flex gap-4">
                                    <Button asChild size="lg">
                                        <Link href="/dashboard/feature">
                                            Accéder à ma Feature <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg" asChild>
                                        <Link href="/dashboard/settings/workspace">
                                            Configurer le Workspace
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            {/* Changelog */}
                            <ChangelogWidget userId={user.id} />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
