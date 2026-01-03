'use client'

import { updateLegalPage } from "@/lib/actions/legal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface LegalEditorProps {
    slug: string
    initialTitle?: string
    initialContent?: string
    initialPublished?: boolean
}

export function LegalEditor({
    slug,
    initialTitle = '',
    initialContent = '',
    initialPublished = true
}: LegalEditorProps) {
    const [isPending, startTransition] = useTransition()
    const [published, setPublished] = useState(initialPublished)

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            // Ensure the value is correctly set in formData
            formData.set('isPublished', published ? 'on' : 'off')

            const result = await updateLegalPage(slug, formData)

            if (result.error) {
                console.error('Save failed:', result.error)
                toast.error(result.error)
            } else {
                toast.success('Page sauvegardée avec succès')
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Modification : {slug}</CardTitle>
                <CardDescription>
                    Modifiez le contenu de la page légale. Le format Markdown est supporté.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={onSubmit} className="space-y-6">
                    <input type="hidden" name="isPublished" value={published ? 'on' : 'off'} />

                    <div className="space-y-2">
                        <Label htmlFor="title">Titre de la page</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={initialTitle}
                            placeholder="Ex: Conditions Générales d'Utilisation"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="published-toggle"
                            checked={published}
                            onCheckedChange={setPublished}
                        />
                        <Label htmlFor="published-toggle">Publier cette page</Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Contenu (Markdown)</Label>
                        <Textarea
                            id="content"
                            name="content"
                            defaultValue={initialContent}
                            className="min-h-[400px] font-mono text-sm leading-relaxed"
                            placeholder="# Ecrivez votre contenu ici..."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => window.history.back()}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending} className="min-w-[200px]">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                'Sauvegarder les modifications'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
