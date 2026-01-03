'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createTicket } from "@/lib/actions/support"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"

const formSchema = z.object({
    subject: z.string().min(2, {
        message: "Le sujet doit contenir au moins 2 caractères.",
    }),
    message: z.string().min(10, {
        message: "Le message doit contenir au moins 10 caractères.",
    }),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
})

export function TicketForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: "",
            message: "",
            priority: "MEDIUM",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            await createTicket(values)
            toast.success("Demande créée avec succès")
            router.push("/dashboard/support")
            router.refresh()
        } catch (error) {
            toast.error("Erreur lors de la création de la demande")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sujet</FormLabel>
                            <FormControl>
                                <Input placeholder="Brève description du problème" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Priorité</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une priorité" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="LOW">Basse</SelectItem>
                                    <SelectItem value="MEDIUM">Moyenne</SelectItem>
                                    <SelectItem value="HIGH">Haute</SelectItem>
                                    <SelectItem value="URGENT">Urgente (Plateforme en panne)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Veuillez décrire votre problème en détail..."
                                    className="min-h-[150px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
                </Button>
            </form>
        </Form>
    )
}
