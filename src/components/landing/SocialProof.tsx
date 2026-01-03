
export function SocialProof() {
    return (
        <section className="py-20 bg-background text-center">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-lg font-medium text-muted-foreground mb-12">
                    Ils nous font confiance
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Logo Placeholders */}
                    <div className="flex items-center justify-center font-bold text-xl">EDISEN.</div>
                    <div className="flex items-center justify-center font-bold text-xl">BuzzFeed</div>
                    <div className="flex items-center justify-center font-bold text-xl">M&CSAATCHI</div>
                    <div className="flex items-center justify-center font-bold text-xl">BULLETPROOF</div>
                    <div className="flex items-center justify-center font-bold text-xl">Deloitte.</div>
                    <div className="flex items-center justify-center font-bold text-xl lg:hidden">ATLASSIAN</div>
                    <div className="flex items-center justify-center font-bold text-xl lg:hidden">KPMG</div>
                    <div className="flex items-center justify-center font-bold text-xl lg:hidden">Ogilvy</div>
                </div>

                <div className="hidden lg:grid lg:grid-cols-3 gap-12 items-center justify-center mt-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 max-w-3xl mx-auto">
                    <div className="flex items-center justify-center font-bold text-xl">ATLASSIAN</div>
                    <div className="flex items-center justify-center font-bold text-xl">KPMG</div>
                    <div className="flex items-center justify-center font-bold text-xl">Ogilvy</div>
                </div>
            </div>
        </section>
    );
}
