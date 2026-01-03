import { CompanySettingsForm } from "@/components/admin/company-settings-form"
import { getLegalSettings } from "@/lib/services/settings"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Paramètres Entreprise | Admin",
}

export default async function CompanySettingsPage() {
    const settings = await getLegalSettings()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Informations Entreprise</h2>
                <p className="text-muted-foreground">
                    Gérez l'identité juridique et les coordonnées de l'entreprise.
                </p>
            </div>

            <CompanySettingsForm settings={settings} />
        </div>
    )
}
