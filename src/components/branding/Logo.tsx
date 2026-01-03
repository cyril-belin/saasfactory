import Link from "next/link";
import { theme } from "@/config/theme";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: number;
    href?: string;
}

export function Logo({ className, size = 32, href = "/" }: LogoProps) {
    const { logo, app } = theme;

    const content = (
        <div className={cn("relative flex items-center gap-2", className)}>
            {/* Light Mode Logo */}
            <img
                src={logo.light}
                alt={`${app.name} logo`}
                width={size}
                height={size}
                className="block dark:hidden"
            />
            {/* Dark Mode Logo */}
            <img
                src={logo.dark}
                alt={`${app.name} logo`}
                width={size}
                height={size}
                className="hidden dark:block"
            />
            <span className="font-bold text-lg hidden sm:inline-block">
                {app.name}
            </span>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="flex items-center gap-2">
                {content}
            </Link>
        );
    }

    return content;
}
