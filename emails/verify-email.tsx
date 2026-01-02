// emails/verify-email.tsx
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
} from "@react-email/components";
import * as React from "react";

interface VerifyEmailProps {
    validationUrl?: string;
}

export const VerifyEmail = ({
    validationUrl = "http://localhost:3000/verify",
}: VerifyEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Vérifiez votre adresse email</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Vérification Email
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Merci de vous être inscrit sur SaaS Factory. Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={validationUrl}
                            >
                                Vérifier mon email
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default VerifyEmail;
