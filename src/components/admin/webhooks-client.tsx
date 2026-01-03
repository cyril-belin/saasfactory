'use client'

import { useState } from 'react'
// We avoid importing StripeEvent directly from @prisma/client if the IDE is having trouble resolving new properties
// import { StripeEvent, StripeEventStatus } from '@prisma/client'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { RefreshCw, Search, Eye, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Define interface locally so we are immune to stale IDE types
interface SerializedStripeEvent {
    id: string
    type: string
    status: string // StripeEventStatus
    payload: any // Json
    error: any // Json
    retryCount: number
    lastAttempt: Date | null
    processed: boolean
    createdAt: Date
    updatedAt: Date
    createdAtString: string
    lastAttemptString: string | null
}

interface WebhooksClientProps {
    // using any allows us to pass valid runtime objects even if IDE thinks they don't match
    initialEvents: SerializedStripeEvent[] | any[]
}

export function WebhooksClient({ initialEvents }: WebhooksClientProps) {
    const [events, setEvents] = useState<SerializedStripeEvent[]>(initialEvents)
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>('ALL')
    const [searchType, setSearchType] = useState('')

    const filteredEvents = events.filter(event => {
        const matchesStatus = filterStatus === 'ALL' || event.status === filterStatus
        const matchesType = event.type.toLowerCase().includes(searchType.toLowerCase())
        return matchesStatus && matchesType
    })

    const handleRetry = async (eventId: string) => {
        setIsLoading(eventId)
        try {
            const res = await fetch('/api/stripe/retry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId })
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text)
            }

            const data = await res.json()
            toast.success('Webhook rejoué avec succès')

            // Update local state
            setEvents(prev => prev.map(e =>
                e.id === eventId ? { ...e, ...data.event, createdAtString: e.createdAtString } : e
            ))

        } catch (error: any) {
            toast.error(`Erreur: ${error.message}`)
        } finally {
            setIsLoading(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SUCCESS': return <Badge className="bg-green-500">Succès</Badge>
            case 'FAILED': return <Badge variant="destructive">Échec</Badge>
            case 'PENDING': return <Badge variant="secondary">En attente</Badge>
            case 'PROCESSING': return <Badge className="bg-blue-500">En cours</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-center">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filtrer par type..."
                        className="pl-8"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tous les statuts</SelectItem>
                        <SelectItem value="SUCCESS">Succès</SelectItem>
                        <SelectItem value="FAILED">Échec</SelectItem>
                        <SelectItem value="PENDING">En attente</SelectItem>
                        <SelectItem value="PROCESSING">En cours</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Retries</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEvents.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.type}</TableCell>
                                <TableCell>{getStatusBadge(event.status)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {format(new Date(event.createdAtString), 'dd/MM/yyyy HH:mm:ss')}
                                </TableCell>
                                <TableCell>
                                    {event.retryCount > 0 && <Badge variant="outline">x{event.retryCount}</Badge>}
                                </TableCell>
                                <TableCell className="text-right flex justify-end gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Détails Webhook</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-bold mb-2">ID</h3>
                                                    <code className="bg-muted p-1 rounded">{event.id}</code>
                                                </div>
                                                {event.error && (
                                                    <div className="bg-red-50 p-4 rounded border border-red-200">
                                                        <h3 className="font-bold text-red-700 flex items-center gap-2">
                                                            <AlertTriangle className="h-4 w-4" />
                                                            Erreur
                                                        </h3>
                                                        <pre className="text-red-600 text-sm mt-2 whitespace-pre-wrap">
                                                            {JSON.stringify(event.error, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-bold mb-2">Payload</h3>
                                                    <pre className="bg-slate-950 text-slate-50 p-4 rounded text-xs overflow-x-auto">
                                                        {JSON.stringify(event.payload, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {event.status === 'FAILED' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRetry(event.id)}
                                            disabled={isLoading === event.id}
                                        >
                                            <RefreshCw className={`h-3 w-3 mr-2 ${isLoading === event.id ? 'animate-spin' : ''}`} />
                                            Retry
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
