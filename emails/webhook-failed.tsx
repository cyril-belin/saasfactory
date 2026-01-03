import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components'
import * as React from 'react'

interface WebhookFailedEmailProps {
    eventId: string
    eventType: string
    error: string
    retryCount: number
    payloadSummary: string
    adminUrl: string
}

export const WebhookFailedEmail = ({
    eventId,
    eventType,
    error,
    retryCount,
    payloadSummary,
    adminUrl,
}: WebhookFailedEmailProps) => {
    const previewText = `Alerte : Échec Webhook Stripe (${eventType})`

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Échec Critique Webhook
                        </Heading>

                        <Section>
                            <Text className="text-red-600 font-bold mb-4">
                                Attention : Le webhook suivant a échoué {retryCount} fois.
                            </Text>

                            <div className="bg-gray-100 p-4 rounded mb-4 text-sm font-mono">
                                <p className="m-0 mb-2"><strong>ID:</strong> {eventId}</p>
                                <p className="m-0 mb-2"><strong>Type:</strong> {eventType}</p>
                                <p className="m-0 mb-2"><strong>Error:</strong> {error}</p>
                            </div>

                            <Text className="text-black text-[14px] leading-[24px]">
                                Payload partiel :
                            </Text>
                            <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                                {payloadSummary}
                            </pre>
                        </Section>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={adminUrl}
                            >
                                Gérer dans l'Admin
                            </Link>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default WebhookFailedEmail

