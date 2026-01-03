
import { prisma } from "@/lib/prisma"
import { PrismaClient } from "@prisma/client"

// Force type resolution for the IDE
const db = prisma as PrismaClient

export const SYSTEM_SETTINGS_KEYS = {
    LEGAL_COMPANY_NAME: "LEGAL_COMPANY_NAME",
    LEGAL_SIRET: "LEGAL_SIRET",
    LEGAL_ADDRESS: "LEGAL_ADDRESS",
    LEGAL_EMAIL: "LEGAL_EMAIL",
    LEGAL_PHONE: "LEGAL_PHONE",
    LEGAL_HOST_NAME: "LEGAL_HOST_NAME",
    LEGAL_HOST_ADDRESS: "LEGAL_HOST_ADDRESS",
} as const

export type SystemSettingsKey = keyof typeof SYSTEM_SETTINGS_KEYS

export async function getSystemSetting(key: string, fallback: string = ""): Promise<string> {
    const setting = await db.systemSetting.findUnique({
        where: { key },
    })
    return setting?.value || fallback
}

export async function getLegalSettings() {
    const settings = await db.systemSetting.findMany({
        where: {
            key: {
                in: Object.values(SYSTEM_SETTINGS_KEYS)
            }
        }
    })

    const settingsMap = settings.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
        acc[curr.key] = curr.value
        return acc
    }, {} as Record<string, string>)

    // Helper to get value with Env fallback
    const get = (key: string, envVar?: string) =>
        settingsMap[key] !== undefined ? settingsMap[key] : (envVar || "")

    return {
        companyName: get(SYSTEM_SETTINGS_KEYS.LEGAL_COMPANY_NAME, process.env.LEGAL_COMPANY_NAME),
        siret: get(SYSTEM_SETTINGS_KEYS.LEGAL_SIRET, process.env.LEGAL_SIRET),
        address: get(SYSTEM_SETTINGS_KEYS.LEGAL_ADDRESS, process.env.LEGAL_ADDRESS),
        email: get(SYSTEM_SETTINGS_KEYS.LEGAL_EMAIL, process.env.LEGAL_EMAIL),
        phone: get(SYSTEM_SETTINGS_KEYS.LEGAL_PHONE, process.env.LEGAL_PHONE),
        hostName: get(SYSTEM_SETTINGS_KEYS.LEGAL_HOST_NAME, process.env.LEGAL_HOST_NAME),
        hostAddress: get(SYSTEM_SETTINGS_KEYS.LEGAL_HOST_ADDRESS, process.env.LEGAL_HOST_ADDRESS),
    }
}

export async function updateSystemSetting(key: string, value: string, category: string = "general") {
    return db.systemSetting.upsert({
        where: { key },
        update: { value, category },
        create: { key, value, category },
    })
}
