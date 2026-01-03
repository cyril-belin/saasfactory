
import { prisma } from '@/lib/prisma'
import { createPlan, deletePlan, togglePlanStatus } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, Trash2, Plus, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function AdminPlansPage() {
    const plans = await prisma.subscriptionPlan.findMany({
        orderBy: { amount: 'asc' }
    })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Abonnements</h1>
                <p className="text-muted-foreground">
                    Gérez vos plans tarifaires et leurs fonctionnalités.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Create Plan Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Nouveau Plan</CardTitle>
                        <CardDescription>Ajouter un plan abonnement lié à Stripe.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={createPlan} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom du Plan</Label>
                                <Input id="name" name="name" placeholder="ex: Pro, Enterprise" required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input id="description" name="description" placeholder="Courte phrase d'accroche" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="priceId">Stripe Price ID</Label>
                                    <Input id="priceId" name="priceId" placeholder="price_..." required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Prix (EUR)</Label>
                                    <Input id="amount" name="amount" type="number" step="0.01" placeholder="29.00" required />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="interval">Intervalle</Label>
                                <select name="interval" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <option value="month">Mensuel</option>
                                    <option value="year">Annuel</option>
                                    <option value="one_time">Paiement unique</option>
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="features">Fonctionnalités (une par ligne)</Label>
                                <Textarea id="features" name="features" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" rows={5} />
                            </div>

                            <div className="flex items-center gap-8 pt-2">
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="isActive" name="isActive" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                                    <Label htmlFor="isActive">Actif</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="popular" name="popular" className="h-4 w-4 rounded border-gray-300" />
                                    <Label htmlFor="popular">Populaire</Label>
                                </div>
                            </div>

                            <Button type="submit" className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Créer le Plan
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Existing Plans List */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Plans Existants</h2>
                    {plans.length === 0 ? (
                        <p className="text-muted-foreground italic">Aucun plan configuré.</p>
                    ) : (
                        plans.map(plan => (
                            <Card key={plan.id} className={plan.isActive ? "" : "opacity-60 bg-muted"}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {plan.name}
                                                {plan.popular && <Badge variant="secondary" className="text-xs"><Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" /> Populaire</Badge>}
                                                {!plan.isActive && <Badge variant="destructive" className="text-xs">Inactif</Badge>}
                                            </CardTitle>
                                            <CardDescription>{plan.description}</CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold">{(plan.amount / 100).toFixed(2)}€</div>
                                            <div className="text-xs text-muted-foreground">/{plan.interval}</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-3">
                                    <div className="text-xs font-mono bg-muted p-2 rounded mb-3 flex justify-between">
                                        <span>ID: {plan.priceId}</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="text-sm flex items-center gap-2">
                                                <Check className="h-3 w-3 text-green-500" /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2 pt-0">
                                    <form action={togglePlanStatus.bind(null, plan.id, !plan.isActive)}>
                                        <Button variant="outline" size="sm">
                                            {plan.isActive ? 'Désactiver' : 'Activer'}
                                        </Button>
                                    </form>
                                    <form action={deletePlan.bind(null, plan.id)}>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
