
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function Pricing() {
    const plans = await prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { amount: 'asc' }
    });

    return (
        <section id="pricing" className="py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Une tarification <span className="text-primary">simple</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Commencez gratuitement et évoluez selon vos besoins.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`p-8 rounded-2xl border bg-background relative overflow-hidden flex flex-col ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    POPULAIRE
                                </div>
                            )}
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="text-4xl font-bold mb-4">
                                {(plan.amount / 100) === 0 ? "Gratuit" : `${(plan.amount / 100)}€`}
                                {(plan.amount / 100) > 0 && <span className="text-lg font-normal opacity-80 text-muted-foreground">/{plan.interval === 'month' ? 'mo' : plan.interval === 'year' ? 'an' : ''}</span>}
                            </div>
                            <p className="text-muted-foreground mb-6 flex-grow">{plan.description}</p>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                                        <Check className={`h-4 w-4 ${plan.popular ? 'text-primary' : 'text-green-500'}`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className="w-full"
                                variant={plan.popular ? "default" : "outline"}
                                asChild
                            >
                                <Link href="/signup">
                                    {(plan.amount / 100) === 0 ? "Commencer" : "Choisir ce plan"}
                                </Link>
                            </Button>
                        </div>
                    ))}

                    {plans.length === 0 && (
                        <div className="col-span-2 text-center p-8 border border-dashed rounded-xl">
                            <p className="text-muted-foreground">Aucun plan public pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
