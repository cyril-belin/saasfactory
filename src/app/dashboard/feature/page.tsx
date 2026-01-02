// src/app/dashboard/feature/page.tsx
import { MainFeature } from '@/components/feature/main-feature'
import { Separator } from "@/components/ui/separator"

export default function FeaturePage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Ma Super Feature</h3>
                <p className="text-sm text-muted-foreground">
                    C'est ici que la magie opère.
                </p>
            </div>
            <Separator />
            <MainFeature />
        </div>
    )
}
