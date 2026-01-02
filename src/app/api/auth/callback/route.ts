// src/app/api/auth/callback/route.ts

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = await createClient()
        await supabase.auth.exchangeCodeForSession(code)

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // Create user in database
            await prisma.user.upsert({
                where: { id: user.id },
                update: { email: user.email! },
                create: {
                    id: user.id,
                    email: user.email!,
                },
            })

            // Auto-create workspace
            const existingWorkspace = await prisma.workspace.findFirst({
                where: { ownerId: user.id },
            })

            if (!existingWorkspace) {
                await prisma.workspace.create({
                    data: {
                        name: `${user.email?.split('@')[0]}'s Workspace`,
                        slug: `workspace-${user.id.slice(0, 8)}`,
                        ownerId: user.id,
                    },
                })
            }
        }
    }

    const next = requestUrl.searchParams.get('next') || '/dashboard'
    return NextResponse.redirect(new URL(next, requestUrl.origin))
}
