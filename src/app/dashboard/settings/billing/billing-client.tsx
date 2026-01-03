
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from "@/components/ui/separator"
import { CreditCard, Zap } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { SubscriptionPlan } from '@prisma/client'

interface BillingClientProps {
    plans: SubscriptionPlan[]
}

export function BillingClient({ plans }: BillingClientProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { activeWorkspace, isLoading: isLoadingWorkspace } = useWorkspace()

    const handleManageSubscription = async () => {
        if (!activeWorkspace) {
            toast.error("Aucun workspace actif")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch('/api/stripe/portal', {
                method: 'POST',
                body: JSON.stringify({ workspaceId: activeWorkspace.id })
            })

            if (!res.ok) throw new Error('Portal error')

            const { url } = await res.json()
            window.location.href = url
        } catch (error) {
            toast.error("Erreur lors de l'accès au portail")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpgrade = async (priceId: string) => {
        if (!activeWorkspace) {
            toast.error("Aucun workspace actif")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    priceId: priceId,
                    workspaceId: activeWorkspace.id
                })
            })

            if (!res.ok) throw new Error('Checkout error')

            const { url } = await res.json()
            window.location.href = url
        } catch (error) {
            toast.error("Erreur lors du checkout")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoadingWorkspace) {
        return <div>Chargement...</div>
    }

    if (!activeWorkspace) {
        return <div>Aucun workspace trouvé.</div>
    }

    const isPro = activeWorkspace.subscriptionStatus === 'ACTIVE'
    const currentPlan = plans.find(p => p.priceId === activeWorkspace.stripePriceId)
    // Filter other plans to show ONLY active ones as upgrade options
    const otherPlans = plans.filter(p => p.priceId !== activeWorkspace.stripePriceId && p.isActive)

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Facturation</h3>
                <p className="text-sm text-muted-foreground">
                    Gérez votre abonnement et vos factures.
                </p>
            </div>
            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Plan actuel
                    </CardTitle>
                    <CardDescription>
                        {isPro
                            ? `Vous êtes abonné au plan ${currentPlan?.name || 'Premium'}.`
                            : "Vous utilisez actuellement le plan gratuit."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-secondary/50 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold">
                                {isPro ? (currentPlan?.name || "Plan Premium") : "Plan Gratuit"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {isPro ? "Merci de votre confiance" : "Idéal pour démarrer"}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-bold block">
                                {isPro
                                    ? `${((currentPlan?.amount || 0) / 100).toFixed(2)}€ / ${currentPlan?.interval === 'month' ? 'mois' : 'an'}`
                                    : "0€ / mois"}
                            </span>
                            {isPro && (
                                <span className="text-xs text-green-600 font-medium">Actif</span>
                            )}
                        </div>
                    </div>

                    {isPro && currentPlan?.features && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Fonctionnalités incluses :</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {currentPlan.features.map((feature, i) => (
                                    <li key={i} className="text-xs flex items-center gap-2 text-muted-foreground">
                                        <Zap className="h-3 w-3 text-primary fill-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {otherPlans.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <h4 className="text-sm font-medium">
                                {isPro ? "Changer de plan" : "Passer au niveau supérieur"}
                            </h4>
                            <div className="grid gap-4">
                                {otherPlans.map(plan => (
                                    <div key={plan.id} className="border border-primary/20 bg-primary/5 p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-primary flex items-center gap-2">
                                                <Zap className="h-4 w-4 fill-primary" /> {plan.name}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">{plan.description}</p>
                                        </div>
                                        <Button size="sm" onClick={() => handleUpgrade(plan.priceId)} disabled={isLoading}>
                                            {isLoading ? '...' : `Choisir (${(plan.amount / 100).toFixed(2)}€)`}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={handleManageSubscription} disabled={isLoading}>
                        Accéder au portail client
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
