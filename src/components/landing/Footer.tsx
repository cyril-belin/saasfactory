import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-12 border-t border-border bg-muted/30">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <span className="text-primary text-2xl">⚡</span>
                    <span>SaaS Factory</span>
                </div>

                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                    <Link href="/legal/conditions" className="hover:text-foreground">Conditions</Link>
                    <Link href="/legal/confidentialite" className="hover:text-foreground">Confidentialité</Link>
                    <Link href="/legal/cookies" className="hover:text-foreground">Cookies</Link>
                </div>

                <div className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} SaaS Factory. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
}
