import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { sendPaymentSuccessEmail, sendPaymentFailedEmail } from '@/lib/services/email'

export class StripeProcessingError extends Error {
    constructor(message: string, public originalError?: any) {
        super(message)
        this.name = 'StripeProcessingError'
    }
}

export async function processStripeBusinessLogic(event: Stripe.Event) {
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const workspaceId = session.metadata?.workspaceId

                if (workspaceId) {
                    await prisma.workspace.update({
                        where: { id: workspaceId },
                        data: {
                            subscriptionStatus: 'ACTIVE',
                            stripeCustomerId: session.customer as string,
                            stripeSubscriptionId: session.subscription as string
                        }
                    })
                }
                break
            }
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice
                const email = invoice.customer_email || ''

                if (email && invoice.hosted_invoice_url) {
                    await sendPaymentSuccessEmail(
                        email,
                        'Abonnement Pro', // Can be dynamic based on price ID
                        (invoice.amount_paid / 100).toFixed(2) + ' €'
                    )
                }
                break
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice
                const email = invoice.customer_email || ''

                if (email) {
                    await sendPaymentFailedEmail(email, (invoice.amount_due / 100).toFixed(2) + ' €')
                }
                break
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription

                await prisma.workspace.updateMany({
                    where: { stripeSubscriptionId: subscription.id },
                    data: { subscriptionStatus: 'CANCELED' }
                })
                break
            }
        }
    } catch (error) {
        console.error(`Error processing Stripe event ${event.id}:`, error)
        throw new StripeProcessingError(`Failed to process event ${event.type}`, error)
    }
}
