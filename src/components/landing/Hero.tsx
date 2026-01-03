import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Users, Settings, Activity, ArrowUpRight, DollarSign } from "lucide-react";

export function Hero() {
    return (
        <section className="pt-32 pb-16 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6 max-w-2xl">
                    <div className="inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary/10 text-primary">
                        Nouveau : Version 2.0 disponible
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                        Lancez votre SaaS <br />
                        <span className="text-primary">à la vitesse de l&apos;éclair</span>
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                        Un template Next.js complet avec authentification, paiements, email et admin dashboard. Économisez des semaines de développement.
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base" asChild>
                            <Link href="/signup">Commencer gratuitement</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base hidden sm:inline-flex" asChild>
                            <Link href="/demo">Voir la démo</Link>
                        </Button>
                    </div>
                </div>

                <div className="relative w-full aspect-[4/3] bg-muted/20 rounded-xl border border-border shadow-2xl p-4 overflow-hidden">
                    {/* Placeholder for Dashboard UI */}
                    <div className="w-full h-full bg-background rounded-lg border border-border flex flex-col overflow-hidden">
                        {/* Mock Window Header */}
                        <div className="h-10 border-b border-border flex items-center px-4 gap-2 bg-muted/40">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="ml-4 px-3 py-1 bg-background rounded text-[10px] text-muted-foreground border border-border flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                                saas-factory-admin.com
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Mock Sidebar */}
                            <div className="w-48 hidden md:flex flex-col gap-1 border-r border-border p-3 bg-muted/10">
                                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50">
                                    <Users className="w-4 h-4" />
                                    <span>Utilisateurs</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50">
                                    <Settings className="w-4 h-4" />
                                    <span>Paramètres</span>
                                </div>

                                <div className="mt-auto p-3 bg-muted/20 rounded-lg border border-border">
                                    <div className="text-xs font-medium mb-1">Stockage</div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div className="h-full w-[70%] bg-primary rounded-full"></div>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground mt-1">70% utilisé</div>
                                </div>
                            </div>

                            {/* Mock Main Content */}
                            <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden bg-background">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">Vue d'ensemble</h3>
                                    <div className="text-xs text-muted-foreground border px-2 py-1 rounded">Derniers 30 jours</div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {/* Stat Card 1 */}
                                    <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-muted-foreground">Revenus</span>
                                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div className="text-2xl font-bold">45.2k€</div>
                                        <div className="flex items-center text-xs text-green-500 mt-1">
                                            <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5%
                                        </div>
                                    </div>

                                    {/* Stat Card 2 */}
                                    <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-muted-foreground">Utilisateurs</span>
                                            <Users className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div className="text-2xl font-bold">2,450</div>
                                        <div className="flex items-center text-xs text-green-500 mt-1">
                                            <ArrowUpRight className="w-3 h-3 mr-1" /> +18.2%
                                        </div>
                                    </div>

                                    {/* Stat Card 3 */}
                                    <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-muted-foreground">Actifs</span>
                                            <Activity className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div className="text-2xl font-bold">+573</div>
                                        <div className="flex items-center text-xs text-green-500 mt-1">
                                            <ArrowUpRight className="w-3 h-3 mr-1" /> +4.3%
                                        </div>
                                    </div>
                                </div>

                                {/* Mock Chart Area */}
                                <div className="flex-1 rounded-xl border border-border bg-muted/5 relative overflow-hidden flex items-end px-4 pt-8 pb-0 gap-2">
                                    {[40, 65, 45, 80, 55, 70, 40, 60, 50, 75, 65, 85].map((h, i) => (
                                        <div key={i} className="flex-1 bg-primary/10 rounded-t-sm relative group">
                                            <div
                                                className="absolute bottom-0 left-0 right-0 bg-primary/60 rounded-t-sm transition-all group-hover:bg-primary"
                                                style={{ height: `${h}%` }}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
