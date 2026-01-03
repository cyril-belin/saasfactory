import { LifeBuoy, Bell, CreditCard, ToggleLeft, MessageSquare, FileText, Activity, ShieldCheck } from "lucide-react";

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
                    {/* Feature 1: Support System */}
                    <div className="group rounded-2xl border border-border bg-card hover:shadow-lg transition-all overflow-hidden flex flex-col">
                        <div className="p-8">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                <LifeBuoy className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">Support Client Intégré</h3>
                            <p className="text-muted-foreground">
                                Un système de ticketing complet pour gérer les demandes de vos utilisateurs, avec statuts et priorités.
                            </p>
                        </div>
                        <div className="mt-auto px-8 pb-8 relative h-64">
                            <div className="absolute right-0 bottom-0 w-4/5 h-full bg-muted/20 rounded-tl-2xl border-t border-l border-border hover:scale-105 transition-transform origin-bottom-right p-4">
                                {/* Mock UI: Support Ticket */}
                                <div className="w-full h-full bg-background rounded-lg shadow-sm p-4 border border-border/50 flex flex-col gap-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-border">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            <span className="text-xs font-medium">Ticket #1203</span>
                                        </div>
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">En cours</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <div className="w-6 h-6 rounded-full bg-muted flex-shrink-0"></div>
                                            <div className="bg-muted/30 p-2 rounded-lg text-xs w-[80%]">
                                                J'ai un problème avec ma facture du mois de juin.
                                            </div>
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <div className="bg-primary/10 text-primary p-2 rounded-lg text-xs w-[80%] text-right">
                                                Bonjour, je regarde ça tout de suite pour vous !
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Changelog */}
                    <div className="group rounded-2xl border border-border bg-card hover:shadow-lg transition-all overflow-hidden flex flex-col">
                        <div className="p-8">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                                <Bell className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">Changelog & Nouveautés</h3>
                            <p className="text-muted-foreground">
                                Tenez vos utilisateurs informés des dernières mises à jour directement dans l'application avec le widget Changelog.
                            </p>
                        </div>
                        <div className="mt-auto px-8 pb-8 relative h-64">
                            <div className="absolute right-0 bottom-0 w-4/5 h-full bg-muted/20 rounded-tl-2xl border-t border-l border-border hover:scale-105 transition-transform origin-bottom-right p-4">
                                {/* Mock UI: Changelog */}
                                <div className="w-full h-full bg-background rounded-lg shadow-sm p-4 border border-border/50 relative">
                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <h4 className="font-bold text-sm mb-3">Quoi de neuf ?</h4>
                                    <div className="space-y-4 relative pl-4 border-l border-border ml-1">
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background"></div>
                                            <div className="text-xs font-bold">Version 2.0</div>
                                            <div className="text-[10px] text-muted-foreground">Nouveau design complet</div>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-muted border-2 border-background"></div>
                                            <div className="text-xs font-bold text-muted-foreground">Version 1.9</div>
                                            <div className="text-[10px] text-muted-foreground">Corrections de bugs...</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: Feature Flags & Maintenance */}
                    <div className="group rounded-2xl border border-border bg-card hover:shadow-lg transition-all overflow-hidden flex flex-col">
                        <div className="p-8">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                                <ToggleLeft className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">Contrôle Total</h3>
                            <p className="text-muted-foreground">
                                Activez ou désactivez des fonctionnalités en temps réel, ou passez en mode maintenance sans redéployer.
                            </p>
                        </div>
                        <div className="mt-auto px-8 pb-8 relative h-64">
                            <div className="absolute right-0 bottom-0 w-4/5 h-full bg-muted/20 rounded-tl-2xl border-t border-l border-border hover:scale-105 transition-transform origin-bottom-right p-4">
                                {/* Mock UI: Feature Flags */}
                                <div className="w-full h-full bg-background rounded-lg shadow-sm p-4 border border-border/50 flex flex-col gap-3">
                                    <div className="flex items-center justify-between p-2 rounded border border-border bg-muted/20">
                                        <span className="text-xs font-medium">Mode Maintenance</span>
                                        <div className="w-8 h-4 rounded-full bg-primary relative cursor-pointer">
                                            <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded border border-border opacity-60">
                                        <span className="text-xs font-medium">Beta Features</span>
                                        <div className="w-8 h-4 rounded-full bg-muted relative">
                                            <div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 4: Payments (Optimized) */}
                    <div className="group rounded-2xl border border-border bg-card hover:shadow-lg transition-all overflow-hidden flex flex-col">
                        <div className="p-8">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">Paiements Intégrés</h3>
                            <p className="text-muted-foreground">
                                Configuration Stripe complète avec gestion des abonnements, factures et portail client prêt à l'emploi.
                            </p>
                        </div>
                        <div className="mt-auto px-8 pb-8 relative h-64">
                            <div className="absolute right-0 bottom-0 w-4/5 h-full bg-green-50 dark:bg-green-900/10 rounded-tl-2xl border-t border-l border-border hover:scale-105 transition-transform origin-bottom-right p-4">
                                {/* Mock UI: Payment */}
                                <div className="w-full h-full bg-background rounded-lg shadow-sm p-3 flex flex-col items-center justify-center border border-border/50">
                                    <div className="text-3xl font-bold mb-1">99.00€</div>
                                    <div className="text-xs text-muted-foreground mb-4">/ mois</div>
                                    <div className="w-full h-8 bg-black text-white rounded flex items-center justify-center text-xs font-medium cursor-pointer">S'abonner</div>
                                    <div className="mt-4 flex gap-2">
                                        <div className="w-6 h-4 bg-muted rounded"></div>
                                        <div className="w-6 h-4 bg-muted rounded"></div>
                                        <div className="w-6 h-4 bg-muted rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
