// src/app/admin/workspaces/page.tsx
import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DeleteWorkspaceButton } from "@/components/admin/delete-workspace-button"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function AdminWorkspacesPage() {
    const workspaces = await prisma.workspace.findMany({
        include: { owner: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
    })

    type Workspace = typeof workspaces[number]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Workspaces</h2>
                <p className="text-muted-foreground">
                    Liste des espaces de travail ({workspaces.length}).
                </p>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Propriétaire</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Créé le</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workspaces.map((ws: Workspace) => (
                            <TableRow key={ws.id}>
                                <TableCell className="font-medium">{ws.name}</TableCell>
                                <TableCell>{ws.owner.email}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${ws.subscriptionStatus === 'ACTIVE'
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                        }`}>
                                        {ws.subscriptionStatus === 'ACTIVE' ? 'Actif' : 'Gratuit'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(ws.createdAt), 'PPP', { locale: fr })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DeleteWorkspaceButton workspaceId={ws.id} workspaceName={ws.name} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
