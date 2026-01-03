import { z } from "zod";

// Schema for a color with light and dark variants
const ColorVariantSchema = z.object({
    light: z.string(),
    dark: z.string(),
});

// Schema for the entire theme
export const ThemeSchema = z.object({
    app: z.object({
        name: z.string(),
        tagline: z.string(),
        description: z.string(),
        url: z.string().url(),
    }),
    company: z.object({
        name: z.string(),
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        email: z.string().email().optional(),
    }),
    logo: z.object({
        light: z.string(),
        dark: z.string(),
    }),
    radius: z.string(),
    colors: z.object({
        primary: ColorVariantSchema,
        secondary: ColorVariantSchema,
        accent: ColorVariantSchema,
        destructive: ColorVariantSchema,
        muted: ColorVariantSchema,
        background: ColorVariantSchema,
        foreground: ColorVariantSchema,
        border: ColorVariantSchema,
        input: ColorVariantSchema,
        ring: ColorVariantSchema,
        sidebar: z.object({
            background: ColorVariantSchema,
            foreground: ColorVariantSchema,
            primary: ColorVariantSchema,
            primaryForeground: ColorVariantSchema,
            accent: ColorVariantSchema,
            accentForeground: ColorVariantSchema,
            border: ColorVariantSchema,
            ring: ColorVariantSchema,
        }),
        charts: z.object({
            1: ColorVariantSchema,
            2: ColorVariantSchema,
            3: ColorVariantSchema,
            4: ColorVariantSchema,
            5: ColorVariantSchema,
        }),
    }),
    fonts: z.object({
        heading: z.string(),
        body: z.string(),
    }),
});

export type Theme = z.infer<typeof ThemeSchema>;

// Default theme configuration
export const theme: Theme = {
    app: {
        name: "SaaS Factory",
        tagline: "Build better SaaS, faster.",
        description: "The ultimate Next.js 16 starter kit for your next project.",
        url: "https://saasfactory.com",
    },
    company: {
        name: "SaaS Factory Inc.",
        twitter: "https://twitter.com/saasfactory",
        github: "https://github.com/saasfactory",
        email: "contact@saasfactory.com",
    },
    logo: {
        light: "/logos/logo-light.svg",
        dark: "/logos/logo-dark.svg",
    },
    radius: "0.625rem",
    colors: {
        primary: { // Purple
            light: "oklch(0.488 0.243 264.376)",
            dark: "oklch(0.6 0.2 270)",
        },
        secondary: { // Very light gray / dark gray
            light: "oklch(0.97 0 0)",
            dark: "oklch(0.269 0 0)",
        },
        accent: {
            light: "oklch(0.97 0 0)",
            dark: "oklch(0.269 0 0)",
        },
        destructive: { // Red
            light: "oklch(0.577 0.245 27.325)",
            dark: "oklch(0.704 0.191 22.216)",
        },
        muted: {
            light: "oklch(0.97 0 0)",
            dark: "oklch(0.269 0 0)",
        },
        background: {
            light: "oklch(1 0 0)",
            dark: "oklch(0.145 0 0)",
        },
        foreground: {
            light: "oklch(0.145 0 0)",
            dark: "oklch(0.985 0 0)",
        },
        border: {
            light: "oklch(0.922 0 0)",
            dark: "oklch(1 0 0 / 10%)",
        },
        input: {
            light: "oklch(0.922 0 0)",
            dark: "oklch(1 0 0 / 15%)",
        },
        ring: {
            light: "oklch(0.488 0.243 264.376)",
            dark: "oklch(0.556 0 0)",
        },
        sidebar: {
            background: { light: "oklch(0.985 0 0)", dark: "oklch(0.205 0 0)" },
            foreground: { light: "oklch(0.145 0 0)", dark: "oklch(0.985 0 0)" },
            primary: { light: "oklch(0.205 0 0)", dark: "oklch(0.488 0.243 264.376)" },
            primaryForeground: { light: "oklch(0.985 0 0)", dark: "oklch(0.985 0 0)" },
            accent: { light: "oklch(0.97 0 0)", dark: "oklch(0.269 0 0)" },
            accentForeground: { light: "oklch(0.205 0 0)", dark: "oklch(0.985 0 0)" },
            border: { light: "oklch(0.922 0 0)", dark: "oklch(1 0 0 / 10%)" },
            ring: { light: "oklch(0.708 0 0)", dark: "oklch(0.556 0 0)" },
        },
        charts: {
            1: { light: "oklch(0.646 0.222 41.116)", dark: "oklch(0.488 0.243 264.376)" },
            2: { light: "oklch(0.6 0.118 184.704)", dark: "oklch(0.696 0.17 162.48)" },
            3: { light: "oklch(0.398 0.07 227.392)", dark: "oklch(0.769 0.188 70.08)" },
            4: { light: "oklch(0.828 0.189 84.429)", dark: "oklch(0.627 0.265 303.9)" },
            5: { light: "oklch(0.769 0.188 70.08)", dark: "oklch(0.645 0.246 16.439)" },
        },
    },
    fonts: {
        heading: "var(--font-geist-sans)",
        body: "var(--font-geist-sans)",
    },
};

// Validate the theme at runtime to ensure type safety
ThemeSchema.parse(theme);
