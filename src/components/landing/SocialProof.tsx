
export function SocialProof() {
    return (
        <section className="py-20 bg-background text-center">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-lg font-medium text-muted-foreground mb-12">
                    Propulsé par les meilleures technologies
                </p>

                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-2xl">▲</span> Next.js
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-blue-500 text-2xl">⚛</span> React
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-sky-500 text-2xl">≋</span> Tailwind
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-emerald-500 text-2xl">⚡</span> Supabase
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-purple-600 text-2xl">S</span> Stripe
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-blue-600 text-2xl">TS</span> TypeScript
                    </div>
                </div>
            </div>
        </section>
    );
}
