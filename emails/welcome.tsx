// emails/welcome.tsx
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

interface WelcomeEmailProps {
    userFirstname?: string;
    loginUrl?: string;
}

export const WelcomeEmail = ({
    userFirstname = "Utilisateur",
    loginUrl = "http://localhost:3000/login",
}: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Bienvenue sur SaaS Factory !</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Bienvenue sur SaaS Factory
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Bonjour {userFirstname},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Nous sommes ravis de vous compter parmi nous. Votre compte a été créé avec succès.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={loginUrl}
                            >
                                Accéder à mon compte
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Si vous avez des questions, n'hésitez pas à répondre à cet email.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomeEmail;
