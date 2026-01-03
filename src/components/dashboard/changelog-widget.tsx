// src/components/dashboard/changelog-widget.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { getRecentAnnouncements } from '@/lib/services/announcements'
import { isFeatureEnabled } from '@/lib/services/feature-flags'

export async function ChangelogWidget({ userId: _userId }: { userId: string }) {
    const isEnabled = await isFeatureEnabled('changelog_in_app')

    if (!isEnabled) return null

    const announcements = await getRecentAnnouncements()

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                    Nouveautés
                </CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {announcements.map((item) => (
                        <div key={item.id} className="border-b pb-3 last:border-0 last:pb-0">
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <p className="text-xs text-muted-foreground mb-1">
                                {item.publishedAt.toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {item.content}
                            </p>
                        </div>
                    ))}
                    {announcements.length === 0 && (
                        <p className="text-sm text-muted-foreground">Aucune nouveauté récente.</p>
                    )}
                </div>
                <div className="mt-4 pt-2 border-t text-center">
                    <Link href="/dashboard/changelog" className="text-xs text-primary hover:underline">
                        Voir tout l&apos;historique
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

