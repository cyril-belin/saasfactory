import { getTicketById } from "@/lib/actions/support";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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

export default async function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ticket = await getTicketById(id);

    if (!ticket) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/support">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Détails de la demande</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle>{ticket.subject}</CardTitle>
                                    <CardDescription>
                                        Créé le {new Date(ticket.createdAt).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                                <Badge variant={getStatusColor(ticket.status) as any}>{ticket.status}</Badge>
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
                            <CardTitle>Informations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">ID</span>
                                <p className="font-mono text-sm mt-1">{ticket.id}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Priorité</span>
                                <div className="mt-1">
                                    <Badge variant="outline">{ticket.priority}</Badge>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Statut</span>
                                <div className="mt-1">
                                    <Badge variant={getStatusColor(ticket.status) as any}>{ticket.status}</Badge>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Dernière mise à jour</span>
                                <p className="text-sm mt-1">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
