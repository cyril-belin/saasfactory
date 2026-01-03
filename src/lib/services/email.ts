// src/lib/services/email.ts
import { Resend } from 'resend'
import { render } from '@react-email/render'
import WelcomeEmail from '../../../emails/welcome'
import VerifyEmail from '../../../emails/verify-email'
import ResetPassword from '../../../emails/reset-password'
import PaymentSuccess from '../../../emails/payment-success'
import PaymentFailed from '../../../emails/payment-failed'
import WebhookFailedEmail from '../../../emails/webhook-failed'

// Helper since emails folder is outside src in standard next structure sometimes, 
// but here I put checks. If relative imports fail, I might need to adjust tsconfig paths.
// Assuming tsconfig enables simplified imports or files are reachable.

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev' // Default for testing

type SendEmailProps = {
    to: string
    subject: string
    html: string
}

async function sendEmail({ to, subject, html }: SendEmailProps) {
    try {
        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
        })
        console.log(`Email sent to ${to}: ${subject}`, data)
        return { success: true, data }
    } catch (error) {
        console.error(`Failed to send email to ${to}`, error)
        return { success: false, error }
    }
}

export async function sendWelcomeEmail(to: string, firstname?: string) {
    const html = await render(WelcomeEmail({ userFirstname: firstname }))
    return sendEmail({ to, subject: 'Bienvenue sur SaaS Factory !', html })
}

export async function sendVerificationEmail(to: string, url: string) {
    const html = await render(VerifyEmail({ validationUrl: url }))
    return sendEmail({ to, subject: 'Vérifiez votre adresse email', html })
}

export async function sendPasswordResetEmail(to: string, url: string) {
    const html = await render(ResetPassword({ resetUrl: url, userEmail: to }))
    return sendEmail({ to, subject: 'Réinitialisation de mot de passe', html })
}

export async function sendPaymentSuccessEmail(to: string, planName: string, amount: string) {
    const html = await render(PaymentSuccess({ planName, amount }))
    return sendEmail({ to, subject: 'Confirmation de paiement', html })
}

export async function sendPaymentFailedEmail(to: string, amount: string) {
    const html = await render(PaymentFailed({ amount }))
    return sendEmail({ to, subject: 'Action requise : Paiement échoué', html })
}

export async function sendWebhookFailedEmail(
    to: string,
    props: { eventId: string; eventType: string; error: string; retryCount: number; payloadSummary: string }
) {
    const adminUrl = process.env.NEXT_PUBLIC_APP_URL + '/admin/webhooks'
    const html = await render(WebhookFailedEmail({ ...props, adminUrl }))
    return sendEmail({ to, subject: `[URGENT] Webhook Failed: ${props.eventType}`, html })
}
