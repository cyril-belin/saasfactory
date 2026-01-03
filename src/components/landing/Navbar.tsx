import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar({ hideNavigation = false }: { hideNavigation?: boolean }) {
    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md dark:bg-black/80 border-b border-border">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <span className="text-primary text-2xl">⚡</span>
                    <span>SaaS Factory</span>
                </Link>
            </div>

            {!hideNavigation && (
                <>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</Link>
                        <Link href="#pricing" className="hover:text-foreground transition-colors">Tarifs</Link>
                        <Link href="/demo" className="hover:text-foreground transition-colors">Démo</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                            Connexion
                        </Link>
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-md px-6" asChild>
                            <Link href="/signup">Commencer</Link>
                        </Button>
                    </div>
                </>
            )}
        </nav>
    );
}
