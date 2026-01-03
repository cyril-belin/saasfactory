
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation Schemas
const PlanSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    priceId: z.string().min(1, "Stripe Price ID is required"),
    amount: z.number().min(0, "Amount must be positive"),
    currency: z.string().default('eur'),
    interval: z.enum(['month', 'year', 'one_time']).default('month'),
    features: z.string().transform(str => str.split('\n').filter(Boolean)), // Split by newline
    isActive: z.boolean().default(true),
    popular: z.boolean().default(false),
})

export async function createPlan(formData: FormData) {
    const data = Object.fromEntries(formData.entries())
    const featuresRaw = formData.get('features') as string

    // Manual parse for features and checkbox
    const validated = PlanSchema.parse({
        ...data,
        amount: parseFloat(data.amount as string) * 100, // Convert to cents
        features: featuresRaw,
        isActive: formData.get('isActive') === 'on',
        popular: formData.get('popular') === 'on',
    })

    await prisma.subscriptionPlan.create({
        data: validated
    })

    revalidatePath('/admin/plans')
    revalidatePath('/dashboard/settings/billing')
    revalidatePath('/') // Landing page
}

export async function deletePlan(id: string) {
    await prisma.subscriptionPlan.delete({
        where: { id }
    })

    revalidatePath('/admin/plans')
    revalidatePath('/dashboard/settings/billing')
    revalidatePath('/')
}

export async function togglePlanStatus(id: string, isActive: boolean) {
    await prisma.subscriptionPlan.update({
        where: { id },
        data: { isActive }
    })

    revalidatePath('/admin/plans')
    revalidatePath('/dashboard/settings/billing')
    revalidatePath('/')
}
