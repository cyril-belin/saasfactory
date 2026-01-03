// src/components/admin/feature-flag-value-input.tsx
'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateFeatureFlagValueAction } from "@/app/admin/actions"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"

interface FeatureFlagValueInputProps {
    flagKey: string
    initialValue: string | null
    placeholder?: string
}

export function FeatureFlagValueInput({ flagKey, initialValue, placeholder }: FeatureFlagValueInputProps) {
    const [value, setValue] = useState(initialValue || "")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const result = await updateFeatureFlagValueAction(flagKey, value || null)
            if (!result.success) {
                throw new Error(result.error)
            }
            toast.success(`Valeur pour ${flagKey} mise à jour`)
            router.refresh()
        } catch (error) {
            toast.error("Échec de la mise à jour")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2 max-w-sm">
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder || "Valeur..."}
                className="h-8 text-xs font-mono"
                disabled={isLoading}
            />
            <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 shrink-0"
                onClick={handleSave}
                disabled={isLoading || value === (initialValue || "")}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Check className="h-4 w-4" />
                )}
            </Button>
        </div>
    )
}
