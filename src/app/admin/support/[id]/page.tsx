import { getTicketById } from "@/lib/actions/support";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TicketPriority, TicketStatus } from "@/lib/actions/support";
import { TicketActions } from "./ticket-actions";

function getPriorityColor(priority: TicketPriority) {
    switch (priority) {
        case 'URGENT': return 'destructive';
        case 'HIGH': return 'secondary';
        default: return 'outline';
    }
}

export default async function AdminTicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ticket = await getTicketById(id);

    if (!ticket) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/support">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Gérer la demande</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle>{ticket.subject}</CardTitle>
                                    <CardDescription>
                                        Soumis par {ticket.user.email} le {new Date(ticket.createdAt).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="whitespace-pre-wrap">{ticket.message}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gestion</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <TicketActions ticketId={ticket.id} currentStatus={ticket.status} />

                            <div className="space-y-4 pt-4 border-t">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Priorité</span>
                                    <div className="mt-1">
                                        <Badge variant={getPriorityColor(ticket.priority) as any}>{ticket.priority}</Badge>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">User ID</span>
                                    <p className="font-mono text-xs mt-1 text-muted-foreground truncate" title={ticket.userId}>{ticket.userId}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Ticket ID</span>
                                    <p className="font-mono text-xs mt-1 text-muted-foreground truncate" title={ticket.id}>{ticket.id}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
