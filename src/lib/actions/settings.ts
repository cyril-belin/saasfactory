'use server'

import { updateSystemSetting, SYSTEM_SETTINGS_KEYS } from "@/lib/services/settings"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const legalSettingsSchema = z.object({
    companyName: z.string().min(1, "Nom de l'entreprise requis"),
    siret: z.string().min(1, "SIRET requis"),
    address: z.string().min(1, "Adresse requise"),
    email: z.string().email("Email invalide"),
    phone: z.string().optional(),
    hostName: z.string().min(1, "Nom de l'hébergeur requis"),
    hostAddress: z.string().min(1, "Adresse de l'hébergeur requise"),
})

export type ActionState = {
    success: boolean
    message?: string
    error?: string
    fieldErrors?: Record<string, string[]>
}

export async function updateLegalSettingsAction(prevState: any, formData: FormData): Promise<ActionState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: "Non autorisé" }
    }

    const adminEmailsString = process.env.ADMIN_EMAILS || ''
    const adminEmails = adminEmailsString.split(',').map(email => email.trim().toLowerCase())
    const userEmail = user.email?.trim().toLowerCase() || ''

    if (!adminEmails.includes(userEmail)) {
        return { success: false, error: "Accès refusé" }
    }

    const data = {
        companyName: formData.get("companyName"),
        siret: formData.get("siret"),
        address: formData.get("address"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        hostName: formData.get("hostName"),
        hostAddress: formData.get("hostAddress"),
    }

    const validated = legalSettingsSchema.safeParse(data)

    if (!validated.success) {
        return {
            success: false,
            error: "Validation failed",
            fieldErrors: validated.error.flatten().fieldErrors,
        }
    }

    try {
        await Promise.all([
            updateSystemSetting(SYSTEM_SETTINGS_KEYS.LEGAL_COMPANY_NAME, validated.data.companyName, "legal"),
            updateSystemSetting(SYSTEM_SETTINGS_KEYS.LEGAL_SIRET, validated.data.siret, "legal"),
            updateSystemSetting(SYSTEM_SETTINGS_KEYS.LEGAL_ADDRESS, validated.data.address, "legal"),
            updateSystemSetting(SYSTEM_SETTINGS_KEYS.LEGAL_EMAIL, validated.data.email, "legal"),
            updateSystemSetting(SYSTEM_SETTINGS_KEYS.LEGAL_PHONE, validated.data.phone || "", "legal"),
            updateSystemSetting(SYSTEM_SETTINGS_KEYS.LEGAL_HOST_NAME, validated.data.hostName, "legal"),
            updateSystemSetting(SYSTEM_SETTINGS_KEYS.LEGAL_HOST_ADDRESS, validated.data.hostAddress, "legal"),
        ])

        revalidatePath("/", "layout") // Revalidate everything
        return { success: true, message: "Paramètres mis à jour avec succès" }
    } catch (error) {
        console.error("Failed to update settings:", error)
        return { success: false, error: "Erreur lors de la mise à jour des paramètres" }
    }
}
