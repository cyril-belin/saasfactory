// src/app/dashboard/feature/storage/page.tsx

import { Suspense } from 'react'
import { FileUploader } from '@/components/storage/FileUploader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { isFeatureEnabled } from '@/lib/services/feature-flags'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default async function StoragePage() {
    const isEnabled = await isFeatureEnabled('storage')

    if (!isEnabled) {
        return (
            <div className="container mx-auto py-10">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Feature Disabled</AlertTitle>
                    <AlertDescription>
                        The File Storage feature is currently disabled. Please enable it in the admin settings.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">File Storage</h1>
                <p className="text-muted-foreground">
                    Manage your files and media assets.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload File</CardTitle>
                        <CardDescription>
                            Upload a document, image, or any other file to the cloud.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<div className="h-40 w-full animate-pulse bg-muted rounded-lg" />}>
                            <FileUploader
                                directory="user-uploads"
                                maxSize={10}
                            />
                        </Suspense>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Storage Information</CardTitle>
                        <CardDescription>
                            Details about your storage configuration.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="font-medium">Service</div>
                            <div className="text-muted-foreground">Supabase Storage</div>

                            <div className="font-medium">Default Bucket</div>
                            <div className="text-muted-foreground">uploads</div>

                            <div className="font-medium">Quota</div>
                            <div className="text-muted-foreground">500 MB (Free Plan)</div>

                            <div className="font-medium">Max File Size</div>
                            <div className="text-muted-foreground">10 MB</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
