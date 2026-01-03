import { getLegalPage } from "@/lib/actions/legal"
import { LegalEditor } from "@/components/admin/legal-editor"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function EditLegalPage({ params }: PageProps) {
    const { slug } = await params
    const { data: page } = await getLegalPage(slug)

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/settings/legal">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Édition : {slug}</h2>
                </div>
            </div>

            <LegalEditor
                slug={slug}
                initialTitle={page?.title}
                initialContent={page?.content}
                initialPublished={page?.isPublished}
            />
        </div>
    )
}
