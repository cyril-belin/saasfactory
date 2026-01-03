// src/app/admin/settings/page.tsx
import { Settings, ShieldAlert } from "lucide-react"
import { FeatureFlagToggle } from "@/components/admin/feature-flag-toggle"
import { isFeatureEnabled } from "@/lib/services/feature-flags"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
    // We assume 'maintenance_mode' is the key for maintenance
    const maintenanceMode = await isFeatureEnabled('maintenance_mode')

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
                <p className="text-muted-foreground">
                    Configuration globale de l'application.
                </p>
            </div>

            <div className="grid gap-6">
                <Card className="border-red-200 bg-red-50/50">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <ShieldAlert className="h-5 w-5 text-red-600" />
                            <CardTitle className="text-red-900">Zone de Danger</CardTitle>
                        </div>
                        <CardDescription className="text-red-700">
                            Actions ayant un impact immédiat sur la disponibilité de la plateforme.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-medium text-red-900">Maintenance Mode</h3>
                                <p className="text-sm text-red-700">
                                    Si activé, l'application ne sera accessible qu'aux administrateurs.
                                </p>
                            </div>
                            <FeatureFlagToggle
                                flagKey="maintenance_mode"
                                initialValue={maintenanceMode}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <ShieldAlert className="h-5 w-5 text-primary" />
                            <CardTitle>Contenu Légal</CardTitle>
                        </div>
                        <CardDescription>
                            Gérez les conditions d'utilisation, la politique de confidentialité et les cookies.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-medium">Pages Légales</h3>
                                <p className="text-sm text-muted-foreground">
                                    Modifier les textes des pages de conditions et cookies.
                                </p>
                            </div>
                            <Button asChild variant="outline">
                                <Link href="/admin/settings/legal">
                                    Gérer les pages
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Settings className="h-5 w-5 text-primary" />
                            <CardTitle>Informations Système</CardTitle>
                        </div>
                        <CardDescription>
                            Détails techniques sur l'instance actuelle.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <span className="text-muted-foreground">Environnement</span>
                                <p className="font-medium">{process.env.NODE_ENV}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-muted-foreground">Region Vercel</span>
                                <p className="font-medium">{process.env.VERCEL_REGION || 'Locale'}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-muted-foreground">URL Base</span>
                                <p className="font-medium truncate">{process.env.NEXT_PUBLIC_APP_URL}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
