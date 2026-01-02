// emails/reset-password.tsx
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

interface ResetPasswordProps {
    resetUrl?: string;
    userEmail?: string;
}

export const ResetPassword = ({
    resetUrl = "http://localhost:3000/reset-password",
    userEmail = "utilisateur@exemple.com",
}: ResetPasswordProps) => {
    return (
        <Html>
            <Head />
            <Preview>Réinitialisation de mot de passe</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Mot de passe oublié ?
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Nous avons reçu une demande de réinitialisation de mot de passe pour <strong>{userEmail}</strong>.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={resetUrl}
                            >
                                Réinitialiser mon mot de passe
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Votre mot de passe restera inchangé.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ResetPassword;
