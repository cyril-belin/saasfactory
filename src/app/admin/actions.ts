// src/app/admin/actions.ts
'use server'

import { toggleFeatureFlag, updateFeatureFlagValue } from "@/lib/services/feature-flags"
import { deleteWorkspace } from "@/lib/services/workspace"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { AnnouncementType } from "@prisma/client"
import { z } from "zod"

export async function toggleFeatureFlagAction(key: string) {
    try {
        await toggleFeatureFlag(key)
        revalidatePath('/admin/feature-flags')
        revalidatePath('/', 'layout')
        return { success: true }
    } catch (error) {
        console.error('Error toggling feature flag:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to toggle flag' }
    }
}

export async function updateFeatureFlagValueAction(key: string, value: string | null) {
    try {
        await updateFeatureFlagValue(key, value)
        revalidatePath('/admin/feature-flags')
        revalidatePath('/', 'layout')
        return { success: true }
    } catch (error) {
        console.error('Error updating feature flag value:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to update flag value' }
    }
}

export async function deleteWorkspaceAction(workspaceId: string) {
    try {
        await deleteWorkspace(workspaceId)
        revalidatePath('/admin/workspaces')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete workspace' }
    }
}

// Announcements
const announcementSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    type: z.nativeEnum(AnnouncementType),
    isPublic: z.boolean(),
    isPinned: z.boolean(),
})

export async function createAnnouncementAction(data: z.infer<typeof announcementSchema>) {
    try {
        const validated = announcementSchema.parse(data)
        await prisma.announcement.create({
            data: validated
        })
        revalidatePath('/admin/announcements')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: 'Failed to create announcement' }
    }
}

export async function updateAnnouncementAction(id: string, data: z.infer<typeof announcementSchema>) {
    try {
        const validated = announcementSchema.parse(data)
        await prisma.announcement.update({
            where: { id },
            data: validated
        })
        revalidatePath('/admin/announcements')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: 'Failed to update announcement' }
    }
}

export async function deleteAnnouncementAction(id: string) {
    try {
        await prisma.announcement.delete({
            where: { id }
        })
        revalidatePath('/admin/announcements')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete announcement' }
    }
}
