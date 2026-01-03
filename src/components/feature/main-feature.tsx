// src/components/feature/main-feature.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wand2 } from 'lucide-react'
import { toast } from 'sonner'

export function MainFeature() {
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const handleAction = async () => {
        if (!inputValue) return

        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setResult(`Résultat généré pour : ${inputValue}`)
            toast.success("Action effectuée avec succès !")
            setIsLoading(false)
        }, 1500)
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-primary" />
                        Fonctionnalité Principale (Template)
                    </CardTitle>
                    <CardDescription>
                        C&apos;est ici que vous implémenterez le cœur de votre SaaS.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Entrez quelque chose..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="max-w-md"
                        />
                        <Button onClick={handleAction} disabled={isLoading || !inputValue}>
                            {isLoading ? "Traitement..." : "Générer"}
                        </Button>
                    </div>

                    {result && (
                        <div className="mt-6 p-4 bg-muted rounded-lg border animate-in fade-in-50">
                            <h4 className="font-semibold mb-2">Résultat :</h4>
                            <p className="text-sm text-muted-foreground">{result}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="bg-muted/30 p-4 rounded-b-lg">
                    <p className="text-xs text-muted-foreground">
                        Astuce : Vous pouvez personnaliser ce composant dans <code>src/components/feature/main-feature.tsx</code>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
