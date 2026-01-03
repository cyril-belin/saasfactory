import { getAllLegalPages } from "@/lib/actions/legal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function LegalSettingsPage() {
    const { data: pages } = await getAllLegalPages()

    // Default slugs that should exist
    const defaultPages = [
        { slug: 'conditions', name: "Conditions de Service" },
        { slug: 'confidentialite', name: "Politique de Confidentialité" },
        { slug: 'cookies', name: "Gestion des Cookies" },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Pages Légales</h2>
                <p className="text-muted-foreground">
                    Gérez vos conditions d'utilisation, politique de confidentialité et cookies.
                </p>
            </div>

            <div className="grid gap-6">
                {defaultPages.map((defPage) => {
                    const existingPage = pages?.find((p: any) => p.slug === defPage.slug)

                    return (
                        <Card key={defPage.slug}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">
                                    {existingPage?.title || defPage.name}
                                </CardTitle>
                                {existingPage?.isPublished ? (
                                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">Publié</Badge>
                                ) : (
                                    <Badge variant="secondary">Brouillon</Badge>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <FileText className="mr-2 h-4 w-4" />
                                        /{defPage.slug}
                                    </div>
                                    <Button asChild variant="outline">
                                        <Link href={`/admin/settings/legal/${defPage.slug}`}>
                                            {existingPage ? 'Modifier' : 'Créer'}
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
