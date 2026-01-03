// src/app/dashboard/changelog/page.tsx

import { getAllPublicAnnouncements } from '@/lib/services/announcements'
import { isFeatureEnabled } from '@/lib/services/feature-flags'
import { redirect } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Calendar, Bell } from 'lucide-react'

export default async function ChangelogPage() {
    const isEnabled = await isFeatureEnabled('changelog_in_app')
    if (!isEnabled) {
        redirect('/dashboard')
    }

    const announcements = await getAllPublicAnnouncements()

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Bell className="h-8 w-8 text-primary" />
                    Changelog & Nouveautés
                </h1>
                <p className="text-muted-foreground">
                    Restez informé des dernières mises à jour et fonctionnalités de la plateforme.
                </p>
            </div>

            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {announcements.map((item) => (
                    <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Dot */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <Calendar className="h-5 w-5" />
                        </div>
                        {/* Content */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-slate-900">{item.title}</div>
                                <time className="font-medium text-primary text-xs whitespace-nowrap">
                                    {item.publishedAt.toLocaleDateString('fr-FR')}
                                </time>
                            </div>
                            <div className="mb-2">
                                <Badge variant="secondary" className="text-[10px] uppercase">
                                    {item.type}
                                </Badge>
                            </div>
                            <div className="text-slate-600 prose prose-sm max-w-none">
                                {item.content}
                            </div>
                        </div>
                    </div>
                ))}

                {announcements.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">Aucune annonce pour le moment</h3>
                        <p className="text-slate-500">Revenez plus tard pour découvrir nos nouveautés.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
