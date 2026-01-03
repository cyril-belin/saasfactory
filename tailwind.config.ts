import type { Config } from "tailwindcss";
import { theme } from "./src/config/theme";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // We are using CSS variables for colors to support runtime theming and shadcn/ui
                // The values are injected in root layout based on src/config/theme.ts
                // This config file is present to satisfy the requirement and allow valid typescript imports
            },
            fontFamily: {
                // Map the font keys from theme.ts to Tailwind utilities if needed
                // But currently globals.css handles the mapping via --font-sans
            }
        },
    },
    plugins: [],
};
export default config;
