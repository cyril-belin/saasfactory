
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

export interface QuickAction {
    label: string
    href: string
    icon: LucideIcon
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
    onClick?: () => void
}

interface QuickActionsWidgetProps {
    title?: string
    actions: QuickAction[]
}

export function QuickActionsWidget({ title = "Actions Rapides", actions }: QuickActionsWidgetProps) {
    if (!actions || actions.length === 0) return null

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
                {actions.map((action, index) => {
                    const Icon = action.icon
                    const isExternal = action.href.startsWith('http')

                    if (action.onClick) {
                        return (
                            <Button
                                key={index}
                                variant={action.variant || "outline"}
                                className="h-auto py-3 flex flex-col gap-2 items-center justify-center text-xs sm:text-sm"
                                onClick={action.onClick}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{action.label}</span>
                            </Button>
                        )
                    }

                    return (
                        <Button
                            key={index}
                            variant={action.variant || "outline"}
                            className="h-auto py-3 flex flex-col gap-2 items-center justify-center text-xs sm:text-sm"
                            asChild
                        >
                            <Link href={action.href} target={isExternal ? "_blank" : undefined}>
                                <Icon className="h-5 w-5" />
                                <span>{action.label}</span>
                            </Link>
                        </Button>
                    )
                })}
            </CardContent>
        </Card>
    )
}
