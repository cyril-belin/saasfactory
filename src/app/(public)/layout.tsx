// src/app/(public)/layout.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b bg-white">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="h-6 w-6 bg-primary rounded-md" />
                        SaaS Factory
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/pricing" className="text-gray-600 hover:text-black transition-colors">
                            Tarifs
                        </Link>
                        <Link href="/changelog" className="text-gray-600 hover:text-black transition-colors">
                            Nouveautés
                        </Link>
                        <Link href="/contact" className="text-gray-600 hover:text-black transition-colors">
                            Contact
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black">
                            Connexion
                        </Link>
                        <Button asChild>
                            <Link href="/signup">Commencer</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="bg-gray-50 border-t py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">SaaS Factory</h3>
                            <p className="text-sm text-gray-500">
                                Lancez votre SaaS en quelques jours, pas en quelques mois.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Produit</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><Link href="/pricing" className="hover:text-black">Tarifs</Link></li>
                                <li><Link href="/changelog" className="hover:text-black">Changelog</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Légal</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><Link href="/legal/mentions" className="hover:text-black">Mentions légales</Link></li>
                                <li><Link href="/legal/cgu" className="hover:text-black">CGU & CGV</Link></li>
                                <li><Link href="/legal/privacy" className="hover:text-black">Confidentialité</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><Link href="/contact" className="hover:text-black">Nous contacter</Link></li>
                                <li>support@saasfactory.fr</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t text-center text-sm text-gray-400">
                        © {new Date().getFullYear()} SaaS Factory. Tous droits réservés.
                    </div>
                </div>
            </footer>
        </div>
    )
}
