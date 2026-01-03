import { getAllTickets } from "@/lib/actions/support";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TicketPriority, TicketStatus } from "@/lib/actions/support";

function getStatusColor(status: TicketStatus) {
    switch (status) {
        case 'OPEN': return 'default';
        case 'IN_PROGRESS': return 'secondary';
        case 'RESOLVED': return 'outline';
        case 'CLOSED': return 'destructive';
        default: return 'default';
    }
}

function getPriorityColor(priority: TicketPriority) {
    switch (priority) {
        case 'URGENT': return 'destructive';
        case 'HIGH': return 'secondary';
        default: return 'outline';
    }
}

export default async function AdminSupportPage() {
    const tickets = await getAllTickets();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support Tickets (Admin)</h1>
                    <p className="text-muted-foreground">Gérez toutes les demandes utilisateurs</p>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Sujet</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Priorité</TableHead>
                            <TableHead>Date de création</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Aucun ticket trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map((ticket: any) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{ticket.user.email}</span>
                                            <span className="text-xs text-muted-foreground">{ticket.user.id.slice(0, 8)}...</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{ticket.subject}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(ticket.status) as any}>
                                            {ticket.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getPriorityColor(ticket.priority) as any}>
                                            {ticket.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/support/${ticket.id}`}>
                                                Gérer
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
