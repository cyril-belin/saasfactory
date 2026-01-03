// src/components/storage/FileUploader.tsx

'use client'

import { useState, useRef } from 'react'
import { Upload, X, File, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { StorageService } from '@/lib/services/storage'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { incrementStorageUsage } from '@/lib/actions/storage'

interface FileUploaderProps {
    onUploadComplete?: (url: string, path: string) => void
    onUploadError?: (error: string) => void
    maxSize?: number // in MB
    accept?: string
    bucket?: string
    directory?: string
    className?: string
    workspaceId?: string
}

export function FileUploader({
    onUploadComplete,
    onUploadError,
    maxSize = 5,
    accept = '*/*',
    bucket,
    directory = 'uploads',
    className,
    workspaceId
}: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            validateAndSetFile(selectedFile)
        }
    }

    const validateAndSetFile = (selectedFile: File) => {
        setError(null)
        setUploadedUrl(null)

        if (selectedFile.size > maxSize * 1024 * 1024) {
            const errorMsg = `File size too large. Maximum size is ${maxSize}MB.`
            setError(errorMsg)
            onUploadError?.(errorMsg)
            return
        }

        setFile(selectedFile)
    }

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)
        setUploadProgress(10) // Start progress

        try {
            const path = `${directory}/${Date.now()}-${file.name}`
            const supabase = createClient()
            const bucketName = bucket || await StorageService.getBucketName()

            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: true,
                })

            if (error) {
                setError(error.message)
                onUploadError?.(error.message)
                toast.error(error.message)
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(data!.path)

                setUploadedUrl(publicUrl)
                setUploadProgress(100)

                // Update usage in background if workspaceId is provided
                if (workspaceId) {
                    incrementStorageUsage(file.size, workspaceId).catch(console.error)
                }

                onUploadComplete?.(publicUrl, data!.path)
                toast.success('File uploaded successfully!')
            }
        } catch (err: any) {
            const errorMsg = err.message || 'An unexpected error occurred'
            setError(errorMsg)
            onUploadError?.(errorMsg)
            toast.error(errorMsg)
        } finally {
            setIsUploading(false)
        }
    }

    const clearFile = () => {
        setFile(null)
        setUploadedUrl(null)
        setError(null)
        setUploadProgress(0)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className={cn("grid gap-4 w-full", className)}>
            {!file ? (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault()
                        setIsDragging(false)
                        const droppedFile = e.dataTransfer.files?.[0]
                        if (droppedFile) validateAndSetFile(droppedFile)
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-8 transition-all hover:bg-muted/10 cursor-pointer",
                        isDragging && "border-primary bg-primary/5 scale-[1.01]"
                    )}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                        <div className="rounded-full bg-muted p-2 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Upload className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-medium">
                            <span className="text-foreground">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs uppercase">
                            {accept === '*/*' ? 'ANY FILE' : accept.replace('.', '')} (MAX {maxSize}MB)
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 transition-all animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3">
                        <div className="rounded-md bg-primary/10 p-2 text-primary">
                            <File className="h-5 w-5" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>
                        {!isUploading && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={clearFile}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Uploading...
                                </span>
                                <span className="font-medium">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-1" />
                        </div>
                    )}

                    {uploadedUrl && (
                        <div className="flex items-center gap-2 text-xs text-green-600 font-medium bg-green-500/10 p-2 rounded-md transition-all">
                            <CheckCircle2 className="h-4 w-4" />
                            File uploaded successfully
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-destructive font-medium bg-destructive/10 p-2 rounded-md transition-all">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {!isUploading && !uploadedUrl && (
                        <Button
                            className="w-full h-9"
                            onClick={handleUpload}
                        >
                            Start Upload
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
