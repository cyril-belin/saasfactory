// src/app/(public)/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Zap, Shield, Rocket } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="pt-20 pb-32 px-4 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto max-w-5xl text-center space-y-8">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                        Nouveau : Version 2.0 disponible
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900">
                        Lancez votre SaaS <br className="hidden md:block" />
                        <span className="text-primary">à la vitesse de l'éclair</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Un template Next.js complet avec authentification, paiements, email et admin dashboard.
                        Économisez des semaines de développement et concentrez-vous sur votre produit.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button size="lg" className="h-12 px-8 text-lg" asChild>
                            <Link href="/signup">
                                Commencer gratuitement <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
                            <Link href="/demo">Voir la démo</Link>
                        </Button>
                    </div>

                    <div className="pt-12 flex items-center justify-center gap-8 text-sm text-gray-400 grayscale opacity-70">
                        <div>ACME Corp</div>
                        <div>Stark Industries</div>
                        <div>Wayne Enterprises</div>
                        <div>Cyberdyne</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold">Tout ce dont vous avez besoin</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Une stack technique moderne et robuste pour partir sur des bases solides.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Zap,
                            title: "Développement Rapide",
                            description: "Next.js 14, Tailwind CSS et des composants UI prêts à l'emploi pour aller vite."
                        },
                        {
                            icon: Shield,
                            title: "Authentification Sécurisée",
                            description: "Système complet avec Supabase Auth, emails transactionnels et protection des routes."
                        },
                        {
                            icon: Rocket,
                            title: "Paiements Intégrés",
                            description: "Configuration Stripe complète avec gestion des abonnements et portail client."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                            <feature.icon className="h-10 w-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-500">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="bg-gray-900 text-white py-24 px-4">
                <div className="container mx-auto max-w-4xl text-center space-y-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Une tarification simple</h2>
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                            <h3 className="text-xl font-bold mb-2">Starter</h3>
                            <div className="text-4xl font-bold mb-4">Gratuit</div>
                            <p className="text-gray-400 mb-6">Pour démarrer votre projet sans risque.</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-400" /> Jusqu'à 100 utilisateurs</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-400" /> Fonctionnalités de base</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-400" /> Support communautaire</li>
                            </ul>
                            <Button className="w-full" variant="secondary" asChild>
                                <Link href="/signup">Commencer</Link>
                            </Button>
                        </div>
                        <div className="bg-primary p-8 rounded-2xl border border-primary relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-white text-primary text-xs font-bold px-3 py-1 rounded-bl-lg">
                                POPULAIRE
                            </div>
                            <h3 className="text-xl font-bold mb-2">Pro</h3>
                            <div className="text-4xl font-bold mb-4">29€<span className="text-lg font-normal opacity-80">/mo</span></div>
                            <p className="text-white/80 mb-6">Pour les projets en pleine croissance.</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-white" /> Utilisateurs illimités</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-white" /> Admin Dashboard</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-white" /> Support prioritaire</li>
                            </ul>
                            <Button className="w-full bg-white text-primary hover:bg-gray-100" asChild>
                                <Link href="/signup">Essayer gratuitement</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ / CTA */}
            <section className="container mx-auto px-4 text-center max-w-2xl space-y-6">
                <h2 className="text-3xl font-bold">Prêt à lancer votre projet ?</h2>
                <p className="text-gray-500">
                    Rejoignez les développeurs qui gagnent du temps avec SaaS Factory.
                </p>
                <Button size="lg" className="h-12 px-8" asChild>
                    <Link href="/signup">Créer mon compte</Link>
                </Button>
            </section>
        </div>
    )
}
