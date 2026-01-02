// src/app/(auth)/verify-email/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyEmailPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Vérifiez vos emails</CardTitle>
                    <CardDescription>
                        Un lien de vérification vous a été envoyé. Veuillez cliquer sur ce lien pour activer votre compte.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col space-y-4">
                    <p className="text-sm text-gray-500">
                        N'oubliez pas de vérifier vos courriers indésirables.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/login">Retour à la connexion</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
