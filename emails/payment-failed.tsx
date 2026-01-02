// emails/payment-failed.tsx
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

interface PaymentFailedProps {
    updatePaymentUrl?: string;
    amount?: string;
}

export const PaymentFailed = ({
    updatePaymentUrl = "http://localhost:3000/dashboard/settings/billing",
    amount = "9€",
}: PaymentFailedProps) => {
    return (
        <Html>
            <Head />
            <Preview>Action requise : Paiement échoué</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Heading className="text-red-600 text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Paiement échoué
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Nous n'avons pas pu traiter votre paiement de <strong>{amount}</strong>.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Pour éviter toute interruption de service, veuillez mettre à jour vos informations de paiement dès que possible.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-red-600 rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={updatePaymentUrl}
                            >
                                Mettre à jour mon paiement
                            </Button>
                        </Section>
                        <Hr className="border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Nous retenterons le prélèvement dans quelques jours.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default PaymentFailed;
