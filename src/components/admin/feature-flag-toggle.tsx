// src/components/admin/feature-flag-toggle.tsx
'use client'

import { Switch } from "@/components/ui/switch"
import { toggleFeatureFlagAction } from "@/app/admin/actions"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface FeatureFlagToggleProps {
    flagKey: string
    initialValue: boolean
}

export function FeatureFlagToggle({ flagKey, initialValue }: FeatureFlagToggleProps) {
    const [enabled, setEnabled] = useState(initialValue)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleToggle = async (checked: boolean) => {
        // Optimistic update
        setEnabled(checked)
        setIsLoading(true)

        try {
            const result = await toggleFeatureFlagAction(flagKey)
            if (!result.success) {
                throw new Error(result.error)
            }
            toast.success(`Flag ${flagKey} updated`)
            router.refresh()
        } catch (error) {
            // Revert on error
            setEnabled(!checked)
            toast.error("Failed to update flag")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isLoading}
        />
    )
}
