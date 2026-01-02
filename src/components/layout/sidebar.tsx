// src/components/layout/sidebar.tsx

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { WorkspaceSwitcher } from './workspace-switcher'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    Settings,
    LogOut,
    CreditCard,
    User,
    Building
} from 'lucide-react'
import { signOut } from '@/lib/services/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SidebarProps {
    user: any
    showWorkspaceSwitcher: boolean
}

export function Sidebar({ user, showWorkspaceSwitcher }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    const navigation = [
        { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Ma Feature', href: '/dashboard/feature', icon: LayoutDashboard }, // Placeholder
        { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
    ]

    const handleSignOut = async () => {
        try {
            await signOut()
            toast.success("Déconnexion réussie")
            router.push('/login')
        } catch (error) {
            toast.error("Erreur lors de la déconnexion")
        }
    }

    return (
        <aside className="w-64 border-r bg-gray-50/50 p-4 flex flex-col h-full">
            {/* Logo */}
            <div className="mb-8 px-2 flex items-center gap-2">
                <div className="h-6 w-6 bg-primary rounded-md" />
                <h1 className="text-xl font-bold tracking-tight">SaaS Factory</h1>
            </div>

            {/* Workspace switcher */}
            {showWorkspaceSwitcher && (
                <div className="mb-6">
                    <WorkspaceSwitcher />
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* User menu */}
            <div className="border-t pt-4 mt-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start px-2 py-6 hover:bg-gray-100">
                            <div className="flex items-center gap-3 text-left">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate leading-none">{user.email?.split('@')[0]}</p>
                                    <p className="text-xs text-muted-foreground truncate mt-1">{user.email}</p>
                                </div>
                                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.email?.split('@')[0]}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profil</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings/billing">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Facturation</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings/workspace">
                                    <Building className="mr-2 h-4 w-4" />
                                    <span>Workspace</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Se déconnecter</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    )
}

import { ChevronsUpDown } from 'lucide-react'
