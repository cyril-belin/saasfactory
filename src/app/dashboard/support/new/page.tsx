import { TicketForm } from "./ticket-form";

export default function NewTicketPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Nouvelle Demande</h1>
                <p className="text-muted-foreground">
                    Soumettez une nouvelle demande de support et nous vous répondrons dès que possible.
                </p>
            </div>
            <div className="rounded-md border p-6">
                <TicketForm />
            </div>
        </div>
    )
}
