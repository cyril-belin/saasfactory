// src/lib/services/auth-server.ts
// Server-side auth functions (can only be used in Server Components)

import { createClient as createServerClient } from '@/lib/supabase/server'

export async function getUser() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function isAdmin(userId: string): Promise<boolean> {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== userId) return false

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    return adminEmails.includes(user.email || '')
}
