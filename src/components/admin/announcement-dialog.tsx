'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createAnnouncementAction, updateAnnouncementAction } from '@/app/admin/actions'
import { AnnouncementType, Announcement } from '@prisma/client'
import { toast } from 'sonner'
import { Loader2, Plus, Pencil } from 'lucide-react'

interface AnnouncementDialogProps {
    announcement?: Announcement
    trigger?: React.ReactNode
}

export function AnnouncementDialog({ announcement, trigger }: AnnouncementDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Form states
    const [title, setTitle] = useState(announcement?.title ?? '')
    const [content, setContent] = useState(announcement?.content ?? '')
    const [type, setType] = useState<AnnouncementType>(announcement?.type ?? 'UPDATE')
    const [isPublic, setIsPublic] = useState(announcement?.isPublic ?? true)
    const [isPinned, setIsPinned] = useState(announcement?.isPinned ?? false)

    const isEditing = !!announcement

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            const data = {
                title,
                content,
                type,
                isPublic,
                isPinned,
            }

            const result = isEditing
                ? await updateAnnouncementAction(announcement.id, data)
                : await createAnnouncementAction(data)

            if (result.success) {
                toast.success(isEditing ? 'Annonce mise à jour' : 'Annonce créée')
                setOpen(false)
                if (!isEditing) {
                    // Reset form
                    setTitle('')
                    setContent('')
                    setType('UPDATE')
                    setIsPublic(true)
                    setIsPinned(false)
                }
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error('Une erreur est survenue')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvelle Annonce
                    </Button>
                )}
            </DialogTrigger>
            {!mounted ? null : (
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Modifier l\'annonce' : 'Nouvelle Annonce'}</DialogTitle>
                            <DialogDescription>
                                {isEditing ? 'Modifiez les détails de l\'annonce.' : 'Créez une nouvelle annonce visible par les utilisateurs.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Titre</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Titre de l'annonce"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={type} onValueChange={(v) => setType(v as AnnouncementType)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="UPDATE">Mise à jour</SelectItem>
                                        <SelectItem value="FEATURE">Nouvelle fonctionnalité</SelectItem>
                                        <SelectItem value="FIX">Correctif</SelectItem>
                                        <SelectItem value="ANNOUNCEMENT">Annonce</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="content">Contenu</Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Détails de l'annonce..."
                                    className="min-h-[100px]"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="public" className="flex flex-col space-y-1">
                                    <span>Publique</span>
                                    <span className="font-normal text-xs text-muted-foreground">Visible par tous les utilisateurs</span>
                                </Label>
                                <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="pinned" className="flex flex-col space-y-1">
                                    <span>Épinglée</span>
                                    <span className="font-normal text-xs text-muted-foreground">Mettre en avant cette annonce</span>
                                </Label>
                                <Switch id="pinned" checked={isPinned} onCheckedChange={setIsPinned} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            )}
        </Dialog>
    )
}
