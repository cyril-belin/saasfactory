'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Temporary local types to bypass Prisma generation delay issues
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export type CreateTicketData = {
    subject: string
    message: string
    priority: TicketPriority
}

export type UpdateTicketStatusData = {
    ticketId: string
    status: TicketStatus
}

export async function createTicket(data: CreateTicketData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const ticket = await (prisma as any).supportTicket.create({
        data: {
            userId: user.id,
            subject: data.subject,
            message: data.message,
            priority: data.priority,
        },
    })

    revalidatePath('/dashboard/support')
    return ticket
}

export async function getUserTickets() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    return await (prisma as any).supportTicket.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
    })
}

export async function getAllTickets() {
    // TODO: Add admin check here
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Basic admin check (should match middleware or centralized admin check)
    if (user.email !== 'ecupower@gmail.com') {
        throw new Error('Forbidden')
    }

    return await (prisma as any).supportTicket.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { email: true, id: true }
            }
        }
    })
}

export async function getTicketById(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const ticket = await (prisma as any).supportTicket.findUnique({
        where: { id },
        include: {
            user: {
                select: { email: true }
            }
        }
    })

    if (!ticket) return null

    // Authorization check: User must own ticket OR be admin
    const isAdmin = user.email === 'ecupower@gmail.com'
    if (ticket.userId !== user.id && !isAdmin) {
        throw new Error('Forbidden')
    }

    return ticket
}

export async function updateTicketStatus(data: UpdateTicketStatusData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== 'ecupower@gmail.com') {
        throw new Error('Forbidden')
    }

    const ticket = await (prisma as any).supportTicket.update({
        where: { id: data.ticketId },
        data: { status: data.status },
    })

    revalidatePath(`/dashboard/support/${data.ticketId}`)
    revalidatePath(`/admin/support/${data.ticketId}`)
    revalidatePath('/admin/support')
    revalidatePath('/dashboard/support')

    return ticket
}
