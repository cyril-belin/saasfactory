
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { HardDrive, UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StorageWidgetProps {
    usedBytes: number
    totalBytes: number
    warningThreshold?: number // Percentage (0-100) to show warning color
    className?: string
}

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function StorageWidget({ usedBytes, totalBytes, warningThreshold = 80, className }: StorageWidgetProps) {
    const usagePercentage = Math.min(100, Math.max(0, (usedBytes / totalBytes) * 100))
    const isWarning = usagePercentage >= warningThreshold

    return (
        <Card className={cn(className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Espace de Stockage
                </CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatBytes(usedBytes)}</div>
                <p className="text-xs text-muted-foreground mb-4">
                    sur {formatBytes(totalBytes)} utilisés
                </p>
                <Progress
                    value={usagePercentage}
                    className={cn("h-2 mb-4", isWarning ? "bg-red-100 [&>div]:bg-red-500" : "")}
                />

                <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/dashboard/storage">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Gérer les fichiers
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
