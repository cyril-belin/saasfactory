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
    // Admin check using env vars
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const adminEmailsString = process.env.ADMIN_EMAILS || ''
    const adminEmails = adminEmailsString.split(',').map(email => email.trim().toLowerCase())
    const userEmail = user.email?.trim().toLowerCase() || ''

    if (!adminEmails.includes(userEmail)) {
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

    const adminEmailsString = process.env.ADMIN_EMAILS || ''
    const adminEmails = adminEmailsString.split(',').map(email => email.trim().toLowerCase())
    const userEmail = user.email?.trim().toLowerCase() || ''
    const isAdmin = adminEmails.includes(userEmail)

    // Authorization check: User must own ticket OR be admin
    if (ticket.userId !== user.id && !isAdmin) {
        throw new Error('Forbidden')
    }

    return ticket
}

export async function updateTicketStatus(data: UpdateTicketStatusData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const adminEmailsString = process.env.ADMIN_EMAILS || ''
    const adminEmails = adminEmailsString.split(',').map(email => email.trim().toLowerCase())
    const userEmail = user.email?.trim().toLowerCase() || ''

    if (!adminEmails.includes(userEmail)) {
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
