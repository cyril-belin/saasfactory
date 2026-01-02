// src/lib/services/feature-flags.ts

import { prisma } from '@/lib/prisma'

// Cache with TTL to reduce DB load
const CACHE_TTL = 60 * 1000 // 60 seconds
const flagCache = new Map<string, { value: boolean; expires: number }>()

export async function isFeatureEnabled(key: string): Promise<boolean> {
    // Check cache first
    const cached = flagCache.get(key)
    if (cached && cached.expires > Date.now()) {
        return cached.value
    }

    // Fetch from DB
    const flag = await prisma.featureFlag.findUnique({
        where: { key },
    })

    const value = flag?.enabled ?? false

    // Update cache
    flagCache.set(key, {
        value,
        expires: Date.now() + CACHE_TTL,
    })

    return value
}

export async function getAllFeatureFlags() {
    return prisma.featureFlag.findMany({
        orderBy: { name: 'asc' },
    })
}

export async function toggleFeatureFlag(key: string): Promise<boolean> {
    const flag = await prisma.featureFlag.findUnique({ where: { key } })

    if (!flag) {
        throw new Error(`Feature flag ${key} not found`)
    }

    const updated = await prisma.featureFlag.update({
        where: { key },
        data: { enabled: !flag.enabled },
    })

    // Clear cache for this key
    flagCache.delete(key)

    return updated.enabled
}

export function clearFeatureFlagCache(key?: string) {
    if (key) {
        flagCache.delete(key)
    } else {
        flagCache.clear()
    }
}
