// src/app/api/contact/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const SUPPORT_EMAIL = process.env.LEGAL_EMAIL || 'support@saasfactory.fr'

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json()

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            )
        }

        // In a real app, you might want to log this to a database too

        await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>', // Or verified domain
            to: SUPPORT_EMAIL,
            subject: `Nouveau message de ${name}`,
            text: `
        Nom: ${name}
        Email: ${email}
        Message:
        ${message}
      `,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { error: 'Erreur lors de l\'envoi du message' },
            { status: 500 }
        )
    }
}
