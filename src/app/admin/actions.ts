// src/app/admin/actions.ts
'use server'

import { toggleFeatureFlag } from "@/lib/services/feature-flags"
import { deleteWorkspace } from "@/lib/services/workspace"
import { revalidatePath } from "next/cache"

export async function toggleFeatureFlagAction(key: string) {
    try {
        await toggleFeatureFlag(key)
        revalidatePath('/admin/feature-flags')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to toggle flag' }
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
