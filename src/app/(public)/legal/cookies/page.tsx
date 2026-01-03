// src/app/legal/cookies/page.tsx
export default function CookiesPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Politique des Cookies</h1>

            <div className="space-y-8 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Qu'est-ce qu'un cookie ?</h2>
                    <p>
                        Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou mobile) lors de la visite d'un site.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. Cookies utilisés</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (authentification, sécurité).</li>
                        <li><strong>Cookies analytiques :</strong> Pour mesurer l'audience et améliorer le site (optionnel).</li>
                        <li><strong>Cookies fonctionnels :</strong> Pour mémoriser vos préférences.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. Gestion des cookies</h2>
                    <p>
                        Vous pouvez à tout moment configurer votre navigateur pour accepter ou refuser les cookies.
                    </p>
                </section>
            </div>
        </div>
    )
}
