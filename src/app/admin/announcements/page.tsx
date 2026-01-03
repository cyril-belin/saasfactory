// src/app/admin/announcements/page.tsx
import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from "@/components/ui/badge"
import { AnnouncementDialog } from "@/components/admin/announcement-dialog"
import { AnnouncementActions } from "@/components/admin/announcement-actions"
import { Megaphone, Pin } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminAnnouncementsPage() {
    const announcements = await prisma.announcement.findMany({
        orderBy: [
            { isPinned: 'desc' },
            { publishedAt: 'desc' },
        ],
    })

    const typeLabels: Record<string, string> = {
        UPDATE: 'Mise à jour',
        FEATURE: 'Nouveauté',
        FIX: 'Correctif',
        ANNOUNCEMENT: 'Annonce',
    }

    const typeColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        UPDATE: 'secondary',
        FEATURE: 'default',
        FIX: 'destructive',
        ANNOUNCEMENT: 'outline',
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Annonces</h2>
                    <p className="text-muted-foreground">
                        Gérez les nouveautés et les communications ({announcements.length}).
                    </p>
                </div>
                <AnnouncementDialog />
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[30px]"></TableHead>
                            <TableHead>Titre</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Visibilité</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {announcements.map((announcement: any) => (
                            <TableRow key={announcement.id}>
                                <TableCell>
                                    {announcement.isPinned && (
                                        <Pin className="h-4 w-4 text-orange-500 rotate-45" />
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{announcement.title}</span>
                                        <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                            {announcement.content}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={typeColors[announcement.type]}>
                                        {typeLabels[announcement.type]}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {announcement.isPublic ? (
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                            Publique
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-stone-500">
                                            Brouillon
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(announcement.publishedAt), 'PPP', { locale: fr })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <AnnouncementActions announcement={announcement} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {announcements.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <Megaphone className="h-8 w-8 text-muted-foreground/50" />
                                        <p>Aucune annonce pour le moment.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
