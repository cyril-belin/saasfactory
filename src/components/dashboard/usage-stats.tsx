
'use client'

import React from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { MetricType, Usage } from '@prisma/client'

interface UsageStatsProps {
    usages: Usage[]
}

const METRIC_LABELS: Record<MetricType, string> = {
    MEMBERS: 'Membres de l\'équipe',
    API_CALLS: 'Appels API (mensuel)',
    STORAGE_MB: 'Stockage (MB)'
}

export function UsageStats({ usages }: UsageStatsProps) {
    // Check global status (e.g. if any limit is reached)
    const isOverLimit = usages.some(u => u.maxValue > 0 && u.currentValue >= u.maxValue)
    const isNearLimit = usages.some(u => u.maxValue > 0 && u.currentValue >= u.maxValue * 0.8)

    return (
        <div className="space-y-6">
            {isOverLimit && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Limite atteinte</AlertTitle>
                    <AlertDescription>
                        Vous avez atteint les limites de votre plan. Certaines fonctionnalités peuvent être restreintes.
                    </AlertDescription>
                </Alert>
            )}

            {!isOverLimit && isNearLimit && (
                <Alert variant="default" className="border-yellow-500 text-yellow-700">
                    <AlertCircle className="h-4 w-4 text-yellow-700" />
                    <AlertTitle>Attention</AlertTitle>
                    <AlertDescription>
                        Vous approchez des limites de votre plan. Pensez à mettre à niveau.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {usages.map((usage) => {
                    const max = usage.maxValue
                    const current = usage.currentValue
                    const percent = max > 0 ? Math.min(100, (current / max) * 100) : 0

                    return (
                        <Card key={usage.id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {METRIC_LABELS[usage.metricType] || usage.metricType}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {current} <span className="text-muted-foreground text-sm font-normal">/ {max === 0 ? '∞' : max}</span>
                                </div>
                                {max > 0 ? (
                                    <Progress value={percent} className="mt-2" />
                                ) : (
                                    <div className="mt-2 text-xs text-muted-foreground">Illimité</div>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">
                                    {max > 0 ? `${percent.toFixed(0)}% utilisé` : 'Pas de limite'}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="flex justify-end">
                <Button variant="default" onClick={() => window.location.href = '/dashboard/settings/billing'}>
                    Mettre à niveau mon plan
                </Button>
            </div>
        </div>
    )
}
