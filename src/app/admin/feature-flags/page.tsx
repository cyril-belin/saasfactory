// src/app/admin/feature-flags/page.tsx
import { getAllFeatureFlags } from "@/lib/services/feature-flags"
import { FeatureFlagToggle } from "@/components/admin/feature-flag-toggle"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export const dynamic = 'force-dynamic'

type FeatureFlag = Awaited<ReturnType<typeof getAllFeatureFlags>>[number]

export default async function FeatureFlagsPage() {
    const flags = await getAllFeatureFlags()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Feature Flags</h2>
                <p className="text-muted-foreground">
                    Gérez les fonctionnalités de l'application en temps réel.
                </p>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Clé</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>État</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {flags.map((flag: FeatureFlag) => (
                            <TableRow key={flag.key}>
                                <TableCell className="font-medium">{flag.name}</TableCell>
                                <TableCell className="font-mono text-sm">{flag.key}</TableCell>
                                <TableCell className="text-muted-foreground">{flag.description}</TableCell>
                                <TableCell>
                                    <FeatureFlagToggle flagKey={flag.key} initialValue={flag.enabled} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {flags.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                    Aucun feature flag trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
