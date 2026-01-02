// src/app/dashboard/settings/profile/page.tsx
'use client'

import { useState } from 'react'
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
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Separator } from "@/components/ui/separator"

const profileFormSchema = z.object({
    fullName: z.string().min(2, {
        message: "Le nom doit faire au moins 2 caractères.",
    }),
    email: z.string().email().readonly(),
})

export default function ProfileSettingsPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    // Note: specific data fetching should ideally happen in a parent server component or via useEffect
    // For now using empty defaults, assuming user data is fetched
    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: "", // TODO: Populate with real data
            email: "",    // TODO: Populate with real data
        },
    })

    async function onSubmit(values: z.infer<typeof profileFormSchema>) {
        setIsLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Non connecté")

            // Update profile logic here (e.g. call API or update Supabase Auth metadata)
            const { error } = await supabase.auth.updateUser({
                data: { full_name: values.fullName }
            })

            if (error) throw error

            toast.success("Profil mis à jour")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la mise à jour")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Profil</h3>
                <p className="text-sm text-muted-foreground">
                    Gérez vos informations personnelles.
                </p>
            </div>
            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Informations Personnelles</CardTitle>
                    <CardDescription>Mettez à jour votre nom et votre adresse email.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@exemple.com" {...field} disabled />
                                        </FormControl>
                                        <FormDescription>
                                            L'adresse email ne peut pas être modifiée directement.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom complet</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Votre nom" {...field} />
                                        </FormControl>
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
        </div>
    )
}
