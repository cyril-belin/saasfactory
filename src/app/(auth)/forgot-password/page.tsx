// src/app/(auth)/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { resetPassword } from '@/lib/services/auth-client'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const formSchema = z.object({
    email: z.string().email({
        message: "Email invalide.",
    }),
})

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isDone, setIsDone] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            await resetPassword(values.email)
            setIsDone(true)
            toast.success("Email de réinitialisation envoyé !")
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la demande")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Mot de passe oublié</CardTitle>
                    <CardDescription>
                        {isDone
                            ? `Un lien a été envoyé à ${form.getValues('email')}.`
                            : "Entrez votre email pour réinitialiser votre mot de passe"}
                    </CardDescription>
                </CardHeader>
                {!isDone && (
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
                                                <Input placeholder="nom@exemple.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Envoi..." : "Réinitialiser"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                )}
                <CardFooter>
                    <Button variant="ghost" className="w-full" asChild>
                        <Link href="/login">Retour à la connexion</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
