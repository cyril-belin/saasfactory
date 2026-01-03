// src/components/admin/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Users,
    Building2,
    Megaphone,
    Settings,
    Shield,
    Flag,
    CreditCard
} from 'lucide-react'

const adminRoutes = [
    {
        label: 'Vue d\'ensemble',
        icon: LayoutDashboard,
        href: '/admin',
        color: 'text-sky-500',
    },
    {
        label: 'Utilisateurs',
        icon: Users,
        href: '/admin/users',
        color: 'text-violet-500',
    },
    {
        label: 'Workspaces',
        icon: Building2,
        href: '/admin/workspaces',
        color: 'text-pink-700',
    },
    {
        label: 'Annonces',
        icon: Megaphone,
        href: '/admin/announcements',
        color: 'text-orange-700',
    },
    {
        label: 'Feature Flags',
        icon: Flag,
        href: '/admin/feature-flags',
        color: 'text-emerald-500',
    },
    {
        label: 'Abonnements',
        icon: CreditCard,
        href: '/admin/plans',
        color: 'text-blue-500',
    },
    {
        label: 'Paramètres',
        icon: Settings,
        href: '/admin/settings',
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/admin" className="flex items-center pl-3 mb-14">
                    <div className="relative h-8 w-8 mr-4">
                        <Shield className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Admin
                    </h1>
                </Link>
                <div className="space-y-1">
                    {adminRoutes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <Link href="/dashboard" className="text-sm flex p-3 w-full justify-start font-medium cursor-pointer text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition">
                    Retour au Dashboard
                </Link>
            </div>
        </div>
    )
}
