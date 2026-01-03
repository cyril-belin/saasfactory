// src/components/maintenance-mode.tsx
import { Hammer } from "lucide-react"

export function MaintenanceMode() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="relative mb-8">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
                    <Hammer className="h-12 w-12 text-primary animate-bounce" />
                </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Maintenance en cours
            </h1>

            <p className="max-w-md text-slate-600 dark:text-slate-400 text-lg mb-8">
                Nous mettons à jour notre plateforme pour vous offrir une meilleure expérience.
                Nous serons de retour très prochainement.
            </p>

            <div className="flex items-center space-x-2 text-sm text-slate-500 animate-pulse">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Nos ingénieurs travaillent dur</span>
            </div>
        </div>
    )
}
