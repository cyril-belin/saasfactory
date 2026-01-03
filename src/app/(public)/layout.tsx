import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { isFeatureEnabled } from '@/lib/services/feature-flags'
import { createClient } from '@/lib/supabase/server'
import { MaintenanceMode } from '@/components/maintenance-mode'
import { CookieConsent } from '@/components/legal/cookie-consent'

export const dynamic = 'force-dynamic'

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const isMaintenance = await isFeatureEnabled('maintenance_mode')

    let isAdmin = false
    if (isMaintenance) {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        const adminEmailsString = process.env.ADMIN_EMAILS || ''
        const adminEmails = adminEmailsString.split(',').map(email => email.trim().toLowerCase())
        const userEmail = session?.user?.email?.trim().toLowerCase() || ''

        isAdmin = adminEmails.includes(userEmail)

        if (!isAdmin) {
            return (
                <div className="flex flex-col min-h-screen">
                    <Navbar hideNavigation />
                    <main className="flex-1">
                        <MaintenanceMode />
                    </main>
                    <Footer />
                </div>
            )
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            {isMaintenance && isAdmin && (
                <div className="bg-amber-500 text-white text-center py-2 text-sm font-medium z-[100] sticky top-0 shadow-md">
                    Mode maintenance actif (Visible uniquement par les administrateurs)
                </div>
            )}
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <CookieConsent />
        </div>
    )
}
