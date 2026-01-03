import { getUserTickets } from "@/lib/actions/support";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TicketPriority, TicketStatus } from "@/lib/actions/support";

function getStatusColor(status: TicketStatus) {
    switch (status) {
        case 'OPEN': return 'default'; // default usually black/primary
        case 'IN_PROGRESS': return 'secondary'; // blue-ish usually
        case 'RESOLVED': return 'outline'; // green maybe? using generic variants for now
        case 'CLOSED': return 'destructive';
        default: return 'default';
    }
}

function getPriorityColor(priority: TicketPriority) {
    switch (priority) {
        case 'URGENT': return 'destructive';
        case 'HIGH': return 'secondary'; // Orange?
        default: return 'outline';
    }
}

export default async function SupportPage() {
    const tickets = await getUserTickets();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support Technique</h1>
                    <p className="text-muted-foreground">Gérez vos demandes de support</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/support/new">Nouvelle demande</Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
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
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Aucun ticket trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map((ticket: any) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">{ticket.subject}</TableCell>
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
                                            <Link href={`/dashboard/support/${ticket.id}`}>
                                                Voir
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
