// src/lib/services/announcements.ts

import { prisma } from '@/lib/prisma'
import { Announcement } from '@prisma/client'

export async function getRecentAnnouncements(limit: number = 5): Promise<Announcement[]> {
    return prisma.announcement.findMany({
        where: {
            isPublic: true,
        },
        orderBy: [
            { isPinned: 'desc' },
            { publishedAt: 'desc' },
        ],
        take: limit,
    })
}

export async function getAllPublicAnnouncements(): Promise<Announcement[]> {
    return prisma.announcement.findMany({
        where: {
            isPublic: true,
        },
        orderBy: [
            { isPinned: 'desc' },
            { publishedAt: 'desc' },
        ],
    })
}
