import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { SocialProof } from "@/components/landing/SocialProof";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <SocialProof />
            <Features />
            <Pricing />
        </div>
    );
}
