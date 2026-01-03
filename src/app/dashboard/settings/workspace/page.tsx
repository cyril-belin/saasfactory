// src/app/dashboard/settings/workspace/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Separator } from "@/components/ui/separator"
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { updateWorkspaceAction } from '@/lib/actions/workspace'

const workspaceFormSchema = z.object({
    name: z.string().min(2, {
        message: "Le nom doit faire au moins 2 caractères.",
    }),
    slug: z.string().min(2),
})

export default function WorkspaceSettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const { activeWorkspace, isLoading: isLoadingWorkspace } = useWorkspace()

    const form = useForm<z.infer<typeof workspaceFormSchema>>({
        resolver: zodResolver(workspaceFormSchema),
        defaultValues: {
            name: "",
            slug: "",
        },
    })

    // Load workspace data into form when available
    useEffect(() => {
        if (activeWorkspace) {
            form.reset({
                name: activeWorkspace.name,
                slug: activeWorkspace.slug,
            })
        }
    }, [activeWorkspace, form])

    async function onSubmit(values: z.infer<typeof workspaceFormSchema>) {
        if (!activeWorkspace) {
            toast.error("Aucun workspace actif")
            return
        }

        setIsLoading(true)
        try {
            const result = await updateWorkspaceAction({
                workspaceId: activeWorkspace.id,
                name: values.name,
            })

            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        } catch (error: any) {
            toast.error("Erreur lors de la mise à jour")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoadingWorkspace) {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Workspace</h3>
                    <p className="text-sm text-muted-foreground">
                        Chargement...
                    </p>
                </div>
            </div>
        )
    }

    if (!activeWorkspace) {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Workspace</h3>
                    <p className="text-sm text-muted-foreground">
                        Aucun workspace trouvé.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Workspace</h3>
                <p className="text-sm text-muted-foreground">
                    Gérez les paramètres de votre espace de travail.
                </p>
            </div>
            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Général</CardTitle>
                    <CardDescription>
                        Modifiez le nom et l'identifiant de votre espace de travail.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom du Workspace</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Acme Inc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug (URL)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="acme-inc" {...field} disabled />
                                        </FormControl>
                                        <FormDescription>
                                            Utilisé dans les URLs. Contactez le support pour le changer.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Member Management Placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle>Membres</CardTitle>
                    <CardDescription>
                        Gérez l'accès à votre espace de travail.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">La gestion des membres sera bientôt disponible.</p>
                </CardContent>
            </Card>
        </div>
    )
}
