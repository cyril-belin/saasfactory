'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Cookie } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check local storage on mount
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 0)
            return () => clearTimeout(timer)
        }
    }, [])

    const accept = () => {
        localStorage.setItem('cookie-consent', 'accepted')
        setIsVisible(false)
    }

    const declined = () => {
        localStorage.setItem('cookie-consent', 'declined')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-in slide-in-from-bottom duration-500">
            <Card className="container max-w-5xl mx-auto p-4 md:p-6 shadow-lg border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-full mt-1 hidden md:block">
                            <Cookie className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg flex items-center md:hidden">
                                <Cookie className="h-4 w-4 mr-2 text-primary" />
                                Utilisation des cookies
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Nous utilisons des cookies pour améliorer votre expérience utilisateur et analyser notre trafic.
                                Vous pouvez modifier vos préférences à tout moment dans les <Link href="/legal/cookies" className="underline underline-offset-4 hover:text-primary">paramètres des cookies</Link>.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto min-w-[300px]">
                        <Button variant="outline" onClick={declined} className="flex-1">
                            Refuser
                        </Button>
                        <Button onClick={accept} className="flex-1">
                            Accepter tout
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
