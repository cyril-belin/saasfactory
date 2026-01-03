import { getAllFeatureFlags } from "@/lib/services/feature-flags"
import { FeatureFlagToggle } from "@/components/admin/feature-flag-toggle"
import { FeatureFlagValueInput } from "@/components/admin/feature-flag-value-input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export const dynamic = 'force-dynamic'

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
                            <TableHead>ID / Configuration</TableHead>
                            <TableHead>État</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {flags.map((flag) => (
                            <TableRow key={flag.key}>
                                <TableCell className="font-medium">{flag.name}</TableCell>
                                <TableCell className="font-mono text-sm">{flag.key}</TableCell>
                                <TableCell className="text-muted-foreground max-w-xs truncate">{flag.description}</TableCell>
                                <TableCell>
                                    {flag.key === 'analytics' ? (
                                        <FeatureFlagValueInput
                                            flagKey={flag.key}
                                            initialValue={(flag as any).value}
                                            placeholder="G-XXXXXXXXXX"
                                        />
                                    ) : (
                                        <span className="text-muted-foreground text-sm">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <FeatureFlagToggle flagKey={flag.key} initialValue={flag.enabled} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {flags.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
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
