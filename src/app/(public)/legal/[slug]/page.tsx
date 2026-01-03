import { getLegalPage } from "@/lib/actions/legal"
import { notFound } from "next/navigation"
import { Metadata } from "next"

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const { data: page } = await getLegalPage(slug)

    if (!page || !page.isPublished) {
        return {
            title: 'Page non trouvée'
        }
    }

    return {
        title: `${page.title} | SaaS Factory`,
        description: `Consultez nos ${page.title}.`
    }
}

export default async function LegalPage({ params }: PageProps) {
    const { slug } = await params
    const { data: page } = await getLegalPage(slug)

    if (!page || !page.isPublished) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl pt-32 pb-20 md:pt-40 md:pb-24 px-6 md:px-8">
                <div className="space-y-4 mb-12 border-b pb-8">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">{page.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <span>Dernière mise à jour :</span>
                        <time dateTime={page.updatedAt.toISOString()} className="font-medium">
                            {new Date(page.updatedAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    </div>
                </div>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-700 dark:text-slate-300">
                        {page.content}
                    </div>
                </div>
            </div>
        </div>
    )
}
