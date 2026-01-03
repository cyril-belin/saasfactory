"use client"

import { useFormState } from "react-dom"
import { updateLegalSettingsAction } from "@/lib/actions/settings"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect } from "react"

const initialState = {
    message: "",
    success: false,
    error: "",
}

type Props = {
    settings: {
        companyName: string
        siret: string
        address: string
        email: string
        phone: string
        hostName: string
        hostAddress: string
    }
}

export function CompanySettingsForm({ settings }: Props) {
    const [state, formAction] = useFormState(updateLegalSettingsAction, initialState)

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message)
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Informations de l'entreprise</CardTitle>
                    <CardDescription>
                        Ces informations sont utilisées dans les mentions légales et le pied de page.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Nom de l'entreprise</Label>
                            <Input id="companyName" name="companyName" defaultValue={settings.companyName} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="siret">SIRET</Label>
                            <Input id="siret" name="siret" defaultValue={settings.siret} required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Adresse du siège social</Label>
                            <Input id="address" name="address" defaultValue={settings.address} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email de contact</Label>
                            <Input id="email" name="email" type="email" defaultValue={settings.email} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Téléphone (optionnel)</Label>
                            <Input id="phone" name="phone" defaultValue={settings.phone} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Hébergeur</CardTitle>
                    <CardDescription>
                        Informations obligatoires sur l'hébergeur du site.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="hostName">Nom de l'hébergeur</Label>
                            <Input id="hostName" name="hostName" defaultValue={settings.hostName} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hostAddress">Adresse de l'hébergeur</Label>
                            <Input id="hostAddress" name="hostAddress" defaultValue={settings.hostAddress} required />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit">Enregistrer les modifications</Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
