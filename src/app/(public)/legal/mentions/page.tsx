// src/app/legal/mentions/page.tsx
export default function LegalMentionsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>

            <div className="space-y-8 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Éditeur du site</h2>
                    <p>
                        Le site <strong>{process.env.PROJECT_SLUG || 'SaaS Factory'}</strong> est édité par la société <strong>{process.env.LEGAL_COMPANY_NAME || 'Ma Société'}</strong>.
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>SIRET :</strong> {process.env.LEGAL_SIRET || 'NUMERO SIRET'}</li>
                        <li><strong>Siège social :</strong> {process.env.LEGAL_ADDRESS || 'Adresse de la société'}</li>
                        <li><strong>Email :</strong> {process.env.LEGAL_EMAIL || 'contact@societe.com'}</li>
                        <li><strong>Téléphone :</strong> {process.env.LEGAL_PHONE || '01 02 03 04 05'}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. Hébergement</h2>
                    <p>
                        Ce site est hébergé par :<br />
                        <strong>{process.env.LEGAL_HOST_NAME || 'Vercel Inc.'}</strong><br />
                        {process.env.LEGAL_HOST_ADDRESS || '340 S Lemon Ave #4133, Walnut, CA 91789'}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. Propriété intellectuelle</h2>
                    <p>
                        L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                    </p>
                </section>
            </div>
        </div>
    )
}
