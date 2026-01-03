// src/app/legal/privacy/page.tsx
export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>

            <div className="space-y-8 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Collecte des données</h2>
                    <p>
                        Nous collectons les informations suivantes lors de votre inscription : adresse email, nom (optionnel).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. Utilisation des données</h2>
                    <p>
                        Les données collectées sont utilisées pour la fourniture du service, la gestion de la relation client, et l'envoi d'informations sur nos services (avec votre consentement).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. Protection des données</h2>
                    <p>
                        Nous mettons en œuvre des mesures de sécurité pour protéger vos données personnelles. Vos données sont hébergées dans l'Union Européenne ou dans des pays offrant un niveau de protection adéquat.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">4. Vos droits</h2>
                    <p>
                        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à : {process.env.LEGAL_EMAIL}.
                    </p>
                </section>
            </div>
        </div>
    )
}
