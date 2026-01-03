
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ResetPeriod } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const now = new Date()

        // Reset Monthly
        const oneMonthAgo = new Date(now)
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

        const monthlyResult = await prisma.usage.updateMany({
            where: {
                resetPeriod: ResetPeriod.MONTHLY,
                lastResetAt: {
                    lt: oneMonthAgo
                }
            },
            data: {
                currentValue: 0,
                lastResetAt: now
            }
        })

        // Reset Daily
        const oneDayAgo = new Date(now)
        oneDayAgo.setDate(oneDayAgo.getDate() - 1)

        const dailyResult = await prisma.usage.updateMany({
            where: {
                resetPeriod: ResetPeriod.DAILY,
                lastResetAt: {
                    lt: oneDayAgo
                }
            },
            data: {
                currentValue: 0,
                lastResetAt: now
            }
        })

        return NextResponse.json({
            success: true,
            reset: {
                monthly: monthlyResult.count,
                daily: dailyResult.count
            }
        })
    } catch (error) {
        console.error('Cron usage reset error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
