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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export type Workspace = {
    id: string
    name: string
    slug: string
    logo?: string
    plan?: string
}

interface WorkspaceSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
    workspaces?: Workspace[]
    currentWorkspace?: Workspace
}

export function WorkspaceSwitcher({
    className,
    workspaces = [],
    currentWorkspace
}: WorkspaceSwitcherProps) {
    const [open, setOpen] = React.useState(false)
    const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = React.useState(false)
    const [selectedWorkspace, setSelectedWorkspace] = React.useState<Workspace | undefined>(
        currentWorkspace || workspaces[0]
    )
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!selectedWorkspace) {
        return null // Or a loading state
    }

    return (
        <Dialog open={showNewWorkspaceDialog} onOpenChange={setShowNewWorkspaceDialog}>
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
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        {selectedWorkspace.name}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                {mounted && (
                    <PopoverContent className="w-[200px] p-0">
                        {/* Note: Command components need to be installed or replaced with simple list if cmbk not used */}
                        <div className="p-2">
                            <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                                Workspaces
                            </div>
                            {workspaces.map((workspace) => (
                                <div
                                    key={workspace.id}
                                    onClick={() => {
                                        setSelectedWorkspace(workspace)
                                        setOpen(false)
                                    }}
                                    className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                >
                                    <Avatar className="mr-2 h-5 w-5">
                                        <AvatarImage
                                            src={`https://avatar.vercel.sh/${workspace.slug}.png`}
                                            alt={workspace.name}
                                        />
                                        <AvatarFallback>SC</AvatarFallback>
                                    </Avatar>
                                    {workspace.name}
                                    {selectedWorkspace.id === workspace.id && (
                                        <Check className="ml-auto h-4 w-4" />
                                    )}
                                </div>
                            ))}
                            <div className="h-px bg-border my-1" />
                            <div
                                onClick={() => {
                                    setOpen(false)
                                    setShowNewWorkspaceDialog(true)
                                }}
                                className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            >
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create Workspace
                            </div>
                        </div>
                    </PopoverContent>
                )}
            </Popover>
            {mounted && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create workspace</DialogTitle>
                        <DialogDescription>
                            Add a new workspace to manage products and customers.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2 pb-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Workspace name</Label>
                            <Input id="name" placeholder="Acme Inc." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="plan">Subscription plan</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free">
                                        <span className="font-medium">Free</span> -{" "}
                                        <span className="text-muted-foreground">
                                            Trial for two weeks
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="pro">
                                        <span className="font-medium">Pro</span> -{" "}
                                        <span className="text-muted-foreground">
                                            $9/month per user
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewWorkspaceDialog(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Continue</Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    )
}
