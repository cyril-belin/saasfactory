'use client'

import { updateTicketStatus } from "@/lib/actions/support"
import { TicketStatus } from "@/lib/actions/support";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useState } from "react"

export function TicketActions({ ticketId, currentStatus }: { ticketId: string, currentStatus: TicketStatus }) {
    const [status, setStatus] = useState(currentStatus)
    const [loading, setLoading] = useState(false)

    const handleStatusChange = async (newStatus: TicketStatus) => {
        setLoading(true)
        try {
            await updateTicketStatus({ ticketId, status: newStatus })
            setStatus(newStatus)
            toast.success("Status updated")
        } catch (error) {
            toast.error("Failed to update status")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Statut:</span>
            <Select
                value={status}
                onValueChange={(val) => handleStatusChange(val as TicketStatus)}
                disabled={loading}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="OPEN">Ouvert</SelectItem>
                    <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                    <SelectItem value="RESOLVED">Résolu</SelectItem>
                    <SelectItem value="CLOSED">Fermé</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
