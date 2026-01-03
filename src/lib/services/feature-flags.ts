// src/lib/services/feature-flags.ts

import { prisma } from '@/lib/prisma'
import { FeatureFlag } from '@prisma/client'

// Cache with TTL to reduce DB load
const CACHE_TTL = 60 * 1000 // 60 seconds
const flagCache = new Map<string, { data: any; expires: number }>()

export async function isFeatureEnabled(key: string): Promise<boolean> {
    // Check cache first
    const cached = flagCache.get(key)
    if (cached && cached.expires > Date.now()) {
        return cached.data.enabled
    }

    // Fetch from DB
    const flag = await prisma.featureFlag.findUnique({
        where: { key },
    })

    const data = flag || { enabled: false, value: null }

    // Update cache
    flagCache.set(key, {
        data,
        expires: Date.now() + CACHE_TTL,
    })

    return data.enabled
}

export async function getFeatureFlag(key: string) {
    // Check cache first
    const cached = flagCache.get(key)
    if (cached && cached.expires > Date.now()) {
        return cached.data
    }

    const flag = await prisma.featureFlag.findUnique({
        where: { key },
    })

    if (flag) {
        flagCache.set(key, {
            data: flag,
            expires: Date.now() + CACHE_TTL,
        })
    }

    return flag
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

export async function updateFeatureFlagValue(key: string, value: string | null) {
    const updated = await prisma.featureFlag.update({
        where: { key },
        data: { value } as any,
    })
    flagCache.delete(key)
    return updated
}

export function clearFeatureFlagCache(key?: string) {
    if (key) {
        flagCache.delete(key)
    } else {
        flagCache.clear()
    }
}
