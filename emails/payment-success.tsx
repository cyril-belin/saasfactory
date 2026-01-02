// emails/payment-success.tsx
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
    Hr,
} from "@react-email/components";
import * as React from "react";

interface PaymentSuccessProps {
    planName?: string;
    amount?: string;
    invoiceUrl?: string;
}

export const PaymentSuccess = ({
    planName = "Plan Pro",
    amount = "9€",
    invoiceUrl = "http://localhost:3000/invoice",
}: PaymentSuccessProps) => {
    return (
        <Html>
            <Head />
            <Preview>Confirmation de paiement</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Paiement reçu
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Merci ! Votre paiement a été traité avec succès.
                        </Text>
                        <Section className="bg-gray-50 p-4 rounded-lg my-4">
                            <Text className="text-black text-[14px] m-0 font-medium">Détails :</Text>
                            <Text className="text-black text-[14px] m-0">{planName} - {amount}</Text>
                        </Section>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={invoiceUrl}
                            >
                                Télécharger la facture
                            </Button>
                        </Section>
                        <Hr className="border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Si vous avez des questions concernant votre abonnement, contactez notre support.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default PaymentSuccess;
