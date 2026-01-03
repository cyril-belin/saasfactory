// src/app/legal/cgu/page.tsx
export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Conditions Générales d'Utilisation et de Vente (CGU/CGV)</h1>

            <div className="space-y-8 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Objet</h2>
                    <p>
                        Les présentes Conditions Générales ont pour objet de définir les modalités de mise à disposition des services du site <strong>{process.env.PROJECT_SLUG}</strong> et les conditions d'utilisation du Service par l'Utilisateur.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. Accès au service</h2>
                    <p>
                        Le Service est accessible gratuitement à tout Utilisateur disposant d'un accès à internet. Tous les coûts afférents à l'accès au Service sont exclusivement à la charge de l'Utilisateur.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. Abonnements et Paiements</h2>
                    <p>
                        L'accès à certaines fonctionnalités nécessite la souscription à un abonnement payant. Les paiements sont sécurisés et gérés par notre prestataire Stripe.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">4. Données personnelles</h2>
                    <p>
                        Les informations demandées à l’inscription au site sont nécessaires et obligatoires pour la création du compte de l'Utilisateur. En particulier, l'adresse email pourra être utilisée par le site pour l'administration, la gestion et l'animation du service.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">5. Responsabilité</h2>
                    <p>
                        Les sources des informations diffusées sur le site sont réputées fiables mais le site ne garantit pas qu’il soit exempt de défauts, d’erreurs ou d’omissions.
                    </p>
                </section>
            </div>
        </div>
    )
}
