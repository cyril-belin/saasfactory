
import { prisma } from '@/lib/prisma'
import { MetricType, ResetPeriod } from '@prisma/client'

// Helper to parse features list from SubscriptionPlan
// Expected format: ["5 members max", "1000 API calls/mois", "1GB storage"]
// Returns a map of MetricType -> Limit (Int)
export function parsePlanFeatures(features: string[]): Record<MetricType, number> {
    const limits: Record<MetricType, number> = {
        [MetricType.MEMBERS]: 0,
        [MetricType.API_CALLS]: 0,
        [MetricType.STORAGE_MB]: 0
    }

    features.forEach(feature => {
        const lower = feature.toLowerCase()

        // Members
        if (lower.includes('members') || lower.includes('membres')) {
            const match = lower.match(/(\d+)\s*(members|membres)/)
            if (match) limits[MetricType.MEMBERS] = parseInt(match[1])
        }

        // API Calls
        if (lower.includes('api calls') || lower.includes('api requests')) {
            const match = lower.match(/(\d+)\s*api/)
            if (match) limits[MetricType.API_CALLS] = parseInt(match[1])
        }

        // Storage
        if (lower.includes('gb storage') || lower.includes('go stockage')) {
            const match = lower.match(/(\d+)\s*(gb|go)/)
            if (match) limits[MetricType.STORAGE_MB] = parseInt(match[1]) * 1024
        } else if (lower.includes('mb storage') || lower.includes('mo stockage')) {
            const match = lower.match(/(\d+)\s*(mb|mo)/)
            if (match) limits[MetricType.STORAGE_MB] = parseInt(match[1])
        }
    })

    return limits
}

export const MeteringService = {
    /**
     * Check if a workspace has reached its limit for a metric.
     * Creates usage record if it doesn't exist.
     */
    async checkLimit(workspaceId: string, metric: MetricType): Promise<boolean> {
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: {
                // We need the subscription plan to know the max value
                // Assuming we can get it via stripeSubscriptionId -> Subscription -> Plan
                // Or maybe we have a direct relation or we fetch it from Stripe?
                // For now, let's look up the plan manually or via relation if it exists.
                // The schema shows no direct link to SubscriptionPlan, but likely enforced via Stripe or a 'plan' field.
                // Wait, schema has 'stripePriceId'. We can map Price ID to SubscriptionPlan.
            }
        })

        if (!workspace) return false // Fail safe? Or block?

        // Find the plan based on stripePriceId
        let limit = 0
        if (workspace.stripePriceId) {
            const plan = await prisma.subscriptionPlan.findUnique({
                where: { priceId: workspace.stripePriceId }
            })
            if (plan) {
                const limits = parsePlanFeatures(plan.features)
                limit = limits[metric]
            }
        } else {
            // Free tier logic or default?
            // Assuming 0 means unlimited or blocked?
            // Let's assume a default strict limit if no plan.
            limit = 0
        }

        // Get or Create Usage record
        let usage = await prisma.usage.findUnique({
            where: {
                workspaceId_metricType: {
                    workspaceId,
                    metricType: metric
                }
            }
        })

        if (!usage) {
            usage = await prisma.usage.create({
                data: {
                    workspaceId,
                    metricType: metric,
                    currentValue: 0,
                    maxValue: limit,
                    resetPeriod: ResetPeriod.MONTHLY, // Default
                    lastResetAt: new Date()
                }
            })
        } else {
            // Update max value in case plan changed (lazy sync)
            if (usage.maxValue !== limit) {
                usage = await prisma.usage.update({
                    where: { id: usage.id },
                    data: { maxValue: limit }
                })
            }
        }

        // Check reset (lazy reset if cron missed it, though cron is preferred)
        // We can do a quick check here if needed, but let's rely on Cron for now or strict enforcement.
        // If we want lazy reset:
        // const now = new Date()
        // if (shouldReset(usage.lastResetAt, usage.resetPeriod)) { ... }

        return usage.currentValue < usage.maxValue
    },

    async incrementUsage(workspaceId: string, metric: MetricType, amount = 1) {
        // Upsert not easy with dependent limit logic, so we do find/create then update
        // But to be atomic on increment, we use update with increment.

        // Ensure record exists first (light check)
        // We can't easily valid existence without a read.
        // Let's try update, if fails, create.
        try {
            await prisma.usage.update({
                where: {
                    workspaceId_metricType: {
                        workspaceId,
                        metricType: metric
                    }
                },
                data: {
                    currentValue: { increment: amount }
                }
            })
        } catch (e) {
            // Record likely missing, create it
            // We need the limit to create it properly.
            // Calling checkLimit first would ensure it exists.
            await this.checkLimit(workspaceId, metric) // This ensures it exists
            await prisma.usage.update({
                where: {
                    workspaceId_metricType: {
                        workspaceId,
                        metricType: metric
                    }
                },
                data: {
                    currentValue: { increment: amount }
                }
            })
        }
    },

    async getUsageStats(workspaceId: string) {
        // Ensure all metrics exist
        const metrics = Object.values(MetricType)
        for (const m of metrics) {
            await this.checkLimit(workspaceId, m)
        }

        return prisma.usage.findMany({
            where: { workspaceId }
        })
    },

    async resetUsage(workspaceId: string, metric: MetricType) {
        await prisma.usage.update({
            where: {
                workspaceId_metricType: {
                    workspaceId,
                    metricType: metric
                }
            },
            data: {
                currentValue: 0,
                lastResetAt: new Date()
            }
        })
    }
}
