'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const sidebarNavItems = [
    {
        title: "Profil",
        href: "/dashboard/settings/profile",
    },
    {
        title: "Workspace",
        href: "/dashboard/settings/workspace",
    },
    {
        title: "Facturation",
        href: "/dashboard/settings/billing",
    },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="space-y-6 p-10 pb-16 block">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
                <p className="text-muted-foreground">
                    Gérez les paramètres de votre compte et de votre espace de travail.
                </p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        {sidebarNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-start rounded-md p-2 text-sm font-medium hover:bg-gray-100 px-4 py-2",
                                    pathname === item.href
                                        ? "bg-gray-100 text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
            </div>
        </div>
    )
}
