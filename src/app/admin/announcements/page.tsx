// src/app/admin/announcements/page.tsx
import { Button } from "@/components/ui/button"
import { Megaphone } from "lucide-react"

export default function AdminAnnouncementsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="bg-primary/10 p-6 rounded-full">
                <Megaphone className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Annonces & Changelog</h2>
            <p className="text-muted-foreground max-w-md">
                Bientôt disponible : Interface de gestion pour publier des nouveautés et des annonces importantes aux utilisateurs.
            </p>
            <Button disabled>
                Créer une annonce (Bientôt)
            </Button>
        </div>
    )
}
