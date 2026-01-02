// src/app/(public)/pricing/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export default function PricingPage() {
    const plans = [
        {
            name: "Starter",
            description: "Pour démarrer votre projet",
            price: "0€",
            features: [
                "Jusqu'à 100 utilisateurs",
                "Fonctionnalités de base",
                "Support communautaire",
                "1 Workspace"
            ],
            buttonText: "Commencer gratuitement",
            buttonVariant: "outline" as const,
            highlight: false
        },
        {
            name: "Pro",
            description: "Pour les équipes en croissance",
            price: "29€",
            period: "/mois",
            features: [
                "Utilisateurs illimités",
                "Admin Dashboard",
                "Support prioritaire",
                "5 Workspaces",
                "Analytics avancés"
            ],
            buttonText: "Essayer gratuitement",
            buttonVariant: "default" as const,
            highlight: true
        },
        {
            name: "Business",
            description: "Pour les grandes entreprises",
            price: "99€",
            period: "/mois",
            features: [
                "Tout illimité",
                "SSO / SAML",
                "Support dédié 24/7",
                "SLA 99.9%",
                "Formation personnalisée"
            ],
            buttonText: "Nous contacter",
            buttonVariant: "outline" as const,
            highlight: false
        }
    ]

    return (
        <div className="py-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Tarification simple et transparente</h1>
                    <p className="text-xl text-gray-600">
                        Choisissez le plan qui correspond le mieux à vos besoins. Changez à tout moment.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`bg-white rounded-2xl p-8 border hover:shadow-lg transition-all ${plan.highlight ? 'border-primary shadow-md ring-1 ring-primary' : 'border-gray-200'
                                }`}
                        >
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-gray-500 mb-6">{plan.description}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.period && <span className="text-gray-500">{plan.period}</span>}
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className="w-full h-11"
                                variant={plan.buttonVariant}
                                asChild
                            >
                                <Link href="/signup">{plan.buttonText}</Link>
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-gray-600">
                        Vous avez des besoins spécifiques ? <Link href="/contact" className="text-primary font-semibold hover:underline">Contactez-nous</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
