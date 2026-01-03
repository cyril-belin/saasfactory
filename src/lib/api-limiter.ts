
import { NextRequest, NextResponse } from 'next/server'
import { MeteringService } from '@/lib/services/metering'
import { MetricType } from '@prisma/client'

export async function withApiLimit(
    req: NextRequest,
    workspaceId: string,
    handler: () => Promise<NextResponse>
) {
    const allowed = await MeteringService.checkLimit(workspaceId, MetricType.API_CALLS)

    if (!allowed) {
        return NextResponse.json(
            { error: 'API_LIMIT_EXCEEDED', message: 'You have exhausted your API calls quota.' },
            { status: 402 }
        )
    }

    const response = await handler()

    // Async increment (fire and forget vs await? Await to ensure consistency)
    // To avoid latency, we could not await, but Vercel functions might kill checking.
    // Using waitUntil if available or just await.
    await MeteringService.incrementUsage(workspaceId, MetricType.API_CALLS, 1)

    return response
}
