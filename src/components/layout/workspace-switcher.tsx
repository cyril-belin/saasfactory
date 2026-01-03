// src/components/layout/workspace-switcher.tsx
'use client'

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useWorkspace } from "@/contexts/workspace-context"
import { toast } from "sonner"

type Workspace = {
    id: string
    name: string
    slug: string
    ownerId: string
    // add other fields as needed
}

interface WorkspaceSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
    workspaces: Workspace[]
}

export function WorkspaceSwitcher({
    className,
    workspaces = []
}: WorkspaceSwitcherProps) {
    const [open, setOpen] = React.useState(false)
    const { workspace: selectedWorkspace, setWorkspace } = useWorkspace()

    const handleSelect = (workspace: Workspace) => {
        setWorkspace(workspace)
        setOpen(false)

        // Persist choice via cookie
        document.cookie = `workspaceId=${workspace.id}; path=/; max-age=31536000` // 1 year

        // Optional: refresh page to ensure server context updates if needed,
        // but since we use Client Context, it might be fine.
        // However, if other server components rely on the cookie, we might want to refresh.
        // router.refresh()
    }

    if (!selectedWorkspace) return null

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a workspace"
                    className={cn("w-full justify-between", className)}
                >
                    <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                            src={`https://avatar.vercel.sh/${selectedWorkspace.slug}.png`}
                            alt={selectedWorkspace.name}
                        />
                        <AvatarFallback>{selectedWorkspace.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{selectedWorkspace.name}</span>
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <div className="p-2">
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                        Workspaces
                    </div>
                    {workspaces.map((workspace) => (
                        <div
                            key={workspace.id}
                            onClick={() => handleSelect(workspace)}
                            className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        >
                            <Avatar className="mr-2 h-5 w-5">
                                <AvatarImage
                                    src={`https://avatar.vercel.sh/${workspace.slug}.png`}
                                    alt={workspace.name}
                                />
                                <AvatarFallback>{workspace.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="truncate flex-1">{workspace.name}</span>
                            {selectedWorkspace.id === workspace.id && (
                                <Check className="ml-auto h-4 w-4" />
                            )}
                        </div>
                    ))}
                    <div className="h-px bg-border my-1" />
                    <div
                        onClick={() => {
                            setOpen(false)
                            toast.info("La création de workspace sera bientôt disponible.")
                        }}
                        className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create Workspace
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
