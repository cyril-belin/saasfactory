// src/lib/services/storage.ts

import { createClient } from '@/lib/supabase/client'
import { getFeatureFlag } from './feature-flags'

export interface StorageUploadResult {
    path: string
    url: string
    error?: string
}

const DEFAULT_BUCKET = 'uploads'

/**
 * Storage Service to handle file uploads to Supabase Storage.
 * It respects the 'storage' feature flag.
 */
export const StorageService = {
    /**
     * Get the configured bucket name from feature flag or use default.
     */
    async getBucketName(): Promise<string> {
        const flag = await getFeatureFlag('storage')
        return flag?.value || DEFAULT_BUCKET
    },

    /**
     * Check if storage is enabled.
     */
    async isEnabled(): Promise<boolean> {
        const flag = await getFeatureFlag('storage')
        return !!flag?.enabled
    },

    /**
     * Upload a file to Supabase Storage.
     * @param file The file to upload
     * @param path The path in the bucket (e.g., 'avatars/user-1.png')
     */
    async uploadFile(file: File, path: string): Promise<StorageUploadResult> {
        const isEnabled = await this.isEnabled()
        if (!isEnabled) {
            return { path: '', url: '', error: 'Storage feature is disabled' }
        }

        const supabase = createClient()
        const bucket = await this.getBucketName()

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: true,
            })

        if (error) {
            return { path: '', url: '', error: error.message }
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path)

        return {
            path: data.path,
            url: publicUrl,
        }
    },

    /**
     * Delete a file from Supabase Storage.
     */
    async deleteFile(path: string): Promise<{ error?: string }> {
        const supabase = createClient()
        const bucket = await this.getBucketName()

        const { error } = await supabase.storage
            .from(bucket)
            .remove([path])

        if (error) {
            return { error: error.message }
        }

        return {}
    },

    /**
     * Get the public URL for a file.
     */
    async getPublicUrl(path: string): Promise<string> {
        const supabase = createClient()
        const bucket = await this.getBucketName()

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path)

        return publicUrl
    }
}
