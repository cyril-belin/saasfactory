export function Features() {
    return (
        <section id="features" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Tout ce dont vous avez  <span className="text-primary">besoin</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Une stack technique moderne et robuste pour partir sur des bases solides.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Feature 1 */}
                    <div className="group rounded-2xl border border-border bg-card hover:shadow-lg transition-all overflow-hidden flex flex-col">
                        <div className="p-8">
                            <h3 className="text-2xl font-semibold mb-3">Développement Rapide</h3>
                            <p className="text-muted-foreground">
                                Next.js 16, Tailwind CSS et des composants UI prêts à l emploi pour aller vite.
                            </p>
                        </div>
                        <div className="mt-auto px-8 pb-8 relative h-64">
                            <div className="absolute right-0 bottom-0 w-4/5 h-full bg-muted/20 rounded-tl-2xl border-t border-l border-border hover:scale-105 transition-transform origin-bottom-right p-4">
                                {/* Mock UI */}
                                <div className="w-full h-full bg-white dark:bg-black rounded-lg shadow-sm p-3 space-y-2">
                                    <div className="h-2 w-1/3 bg-primary/20 rounded"></div>
                                    <div className="h-2 w-1/2 bg-muted rounded"></div>
                                    <div className="h-20 w-full bg-blue-50 dark:bg-blue-900/20 rounded mt-4"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="group rounded-2xl border border-border bg-card hover:shadow-lg transition-all overflow-hidden flex flex-col">
                        <div className="p-8">
                            <h3 className="text-2xl font-semibold mb-3">Authentification Sécurisée</h3>
                            <p className="text-muted-foreground">
                                Système complet avec Supabase Auth, emails transactionnels et protection des routes.
                            </p>
                        </div>
                        <div className="mt-auto px-8 pb-8 relative h-64">
                            <div className="absolute right-0 bottom-0 w-4/5 h-full bg-muted/20 rounded-tl-2xl border-t border-l border-border hover:scale-105 transition-transform origin-bottom-right p-4 flex items-end">
                                {/* Mock UI */}
                                <div className="w-full h-40 bg-white dark:bg-black rounded-lg shadow-sm p-3 flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-2 w-2/3 bg-muted rounded"></div>
                                        <div className="h-2 w-full bg-muted rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="group rounded-2xl border border-border bg-card hover:shadow-lg transition-all overflow-hidden flex flex-col">
                        <div className="p-8">
                            <h3 className="text-2xl font-semibold mb-3">Paiements Intégrés</h3>
                            <p className="text-muted-foreground">
                                Configuration Stripe complète avec gestion des abonnements et portail client.
                            </p>
                        </div>
                        <div className="mt-auto px-8 pb-8 relative h-64">
                            <div className="absolute right-0 bottom-0 w-4/5 h-full bg-muted/20 rounded-tl-2xl border-t border-l border-border hover:scale-105 transition-transform origin-bottom-right p-4">
                                {/* Mock UI */}
                                <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">$</div>
                                <div className="w-full h-full bg-white dark:bg-black rounded-lg shadow-sm p-3">
                                    <div className="space-y-3">
                                        <div className="h-2 w-full bg-muted rounded"></div>
                                        <div className="h-2 w-full bg-muted rounded"></div>
                                        <div className="h-2 w-2/3 bg-muted rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="group rounded-2xl border border-border bg-card hover:shadow-lg transition-all overflow-hidden flex flex-col">
                        <div className="p-8">
                            <h3 className="text-2xl font-semibold mb-3">Admin Dashboard</h3>
                            <p className="text-muted-foreground">
                                Interface d administration complète pour gérer vos utilisateurs et abonnements.
                            </p>
                        </div>
                        <div className="mt-auto px-8 pb-8 relative h-64">
                            <div className="absolute right-0 bottom-0 w-4/5 h-full bg-green-50 dark:bg-green-900/10 rounded-tl-2xl border-t border-l border-border hover:scale-105 transition-transform origin-bottom-right p-4">
                                {/* Mock UI */}
                                <div className="w-full h-full bg-white dark:bg-black rounded-lg shadow-sm p-3 relative overflow-hidden">
                                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-100 to-transparent dark:from-green-900/30"></div>
                                    <svg className="w-full h-full text-green-500" viewBox="0 0 100 50" preserveAspectRatio="none">
                                        <path d="M0 50 L20 40 L40 45 L60 30 L80 35 L100 10" fill="none" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
