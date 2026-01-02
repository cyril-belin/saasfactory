// src/app/dashboard/settings/billing/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from "@/components/ui/separator"
import { CreditCard, Check, Zap } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// Placeholder workspace ID - in real app would come from context/url
const DEMO_WORKSPACE_ID = 'PLACEHOLDER_ID'

export default function BillingSettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleManageSubscription = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/stripe/portal', {
                method: 'POST',
                body: JSON.stringify({ workspaceId: DEMO_WORKSPACE_ID })
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

    const handleUpgrade = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    priceId: 'price_PRO', // Placeholder
                    workspaceId: DEMO_WORKSPACE_ID
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
                        Vous utilisez actuellement le plan gratuit.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-secondary/50 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold">Plan Gratuit</h4>
                            <p className="text-sm text-muted-foreground">Idéal pour démarrer</p>
                        </div>
                        <span className="text-sm font-bold">0€ / mois</span>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Passer au plan PRO</h4>
                        <div className="border border-primary/20 bg-primary/5 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-primary flex items-center gap-2">
                                    <Zap className="h-4 w-4 fill-primary" /> Plan PRO
                                </h4>
                                <p className="text-xs text-muted-foreground">Tout illimité + Support prioritaire</p>
                            </div>
                            <Button size="sm" onClick={handleUpgrade} disabled={isLoading}>
                                {isLoading ? 'Chargement...' : 'Mettre à niveau (29€)'}
                            </Button>
                        </div>
                    </div>
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
