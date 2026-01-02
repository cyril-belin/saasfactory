// src/app/admin/settings/page.tsx
import { Settings } from "lucide-react"

export default function AdminSettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="bg-secondary/20 p-6 rounded-full">
                <Settings className="h-12 w-12 text-secondary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Paramètres Globaux</h2>
            <p className="text-muted-foreground max-w-md">
                Bientôt disponible : Configuration globale de l'application, maintenance, et logs système.
            </p>
        </div>
    )
}
