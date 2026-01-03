import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

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
                    <div className="w-full h-full bg-white dark:bg-black rounded-lg border border-border flex flex-col">
                        <div className="h-12 border-b border-border flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 p-6 flex gap-6">
                            <div className="w-48 hidden md:flex flex-col gap-4 border-r border-border pr-6">
                                <div className="w-full h-4 bg-muted rounded"></div>
                                <div className="w-3/4 h-4 bg-muted rounded"></div>
                                <div className="w-full h-4 bg-muted rounded"></div>
                                <div className="mt-auto w-full h-24 bg-primary/10 rounded-lg"></div>
                            </div>
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="w-full h-32 bg-muted/30 rounded-lg border border-border dashed"></div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-24 bg-muted/20 rounded-lg"></div>
                                    <div className="h-24 bg-muted/20 rounded-lg"></div>
                                    <div className="h-24 bg-muted/20 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
