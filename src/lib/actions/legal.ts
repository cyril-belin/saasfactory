'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const legalPageSchema = z.object({
    title: z.string().min(1, "Required"),
    content: z.string().min(1, "Required"),
    isPublished: z.boolean().default(true),
})

export async function getLegalPage(slug: string) {
    try {
        const page = await (prisma as any).legalPage.findUnique({
            where: { slug },
        })
        return { data: page }
    } catch (error) {
        return { error: "Failed to fetch page" }
    }
}

export async function getAllLegalPages() {
    try {
        const pages = await (prisma as any).legalPage.findMany({
            orderBy: { title: 'asc' }
        })
        return { data: pages }
    } catch (error) {
        return { error: "Failed to fetch pages" }
    }
}

export async function updateLegalPage(slug: string, formData: FormData) {
    console.log(`UPDATING LEGAL PAGE: ${slug}`)
    try {
        const title = formData.get('title') as string
        const content = formData.get('content') as string
        const isPublished = formData.get('isPublished') === 'on'

        console.log(`FIELDS: title=${title}, published=${isPublished}`)

        const validatedFields = legalPageSchema.safeParse({
            title,
            content,
            isPublished,
        })

        if (!validatedFields.success) {
            console.error('Validation error:', validatedFields.error.flatten())
            return { error: "Champs invalides" }
        }

        const data = validatedFields.data

        const result = await (prisma as any).legalPage.upsert({
            where: { slug },
            update: {
                title: data.title,
                content: data.content,
                isPublished: data.isPublished,
            },
            create: {
                slug,
                title: data.title,
                content: data.content,
                isPublished: data.isPublished,
            },
        })

        console.log(`SUCCESSFULLY SAVED: ${result.slug}`)

        revalidatePath('/admin/settings/legal')
        revalidatePath(`/admin/settings/legal/${slug}`)
        revalidatePath(`/legal/${slug}`)

        return { success: true }
    } catch (error) {
        console.error('Update error detail:', error)
        return { error: "Erreur lors de la sauvegarde" }
    }
}
