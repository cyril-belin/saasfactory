// src/app/dashboard/settings/profile/page.tsx
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
    const [isFetching, setIsFetching] = useState(true)
    const supabase = createClient()

    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
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

    // Fetch user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    form.reset({
                        email: user.email || "",
                        fullName: user.user_metadata?.full_name || "",
                    })
                }
            } finally {
                setIsFetching(false)
            }
        }
        fetchUser()
    }, [form, supabase.auth])

    if (isFetching) {
        return <div className="p-8 text-center text-muted-foreground">Chargement du profil...</div>
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
