import { theme } from "@/config/theme";

export function getThemeCss() {
    const { colors, radius } = theme;

    // Helper to format a single color variable
    // We strip 'oklch(' and ')' if present to allow tailwind opacity modifier syntax if needed,
    // BUT shadcn/ui generic config often uses HSL values without units, or full strings.
    // Tailwind 4 with @theme usually works best with full values if mapped directly.
    // However, checked globals.css: --primary: oklch(0.488 0.243 264.376); 
    // And util map: --color-primary: var(--primary);
    // So we should output the FULL string.

    const lightVars: string[] = [];
    const darkVars: string[] = [];

    // Radius
    lightVars.push(`--radius: ${radius};`);
    darkVars.push(`--radius: ${radius};`); // Same radius usually

    // Top level colors
    Object.entries(colors).forEach(([key, value]) => {
        if (key === 'sidebar' || key === 'charts') return;

        // Check if it has light/dark (it should based on schema)
        if (typeof value === 'object' && 'light' in value && 'dark' in value) {
            // key is like 'primary', 'destructive'
            lightVars.push(`--${key}: ${value.light};`);
            darkVars.push(`--${key}: ${value.dark};`);
        }
    });

    // Sidebar colors
    Object.entries(colors.sidebar).forEach(([key, value]) => {
        // key is like 'background', 'primary' -> --sidebar-background, --sidebar-primary
        // Need to handle camelCase to kebab-case if any? 
        // keys: background, foreground, primary, primaryForeground
        // primaryForeground -> primary-foreground
        const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

        if (typeof value === 'object' && 'light' in value && 'dark' in value) {
            lightVars.push(`--sidebar-${kebabKey}: ${value.light};`);
            darkVars.push(`--sidebar-${kebabKey}: ${value.dark};`);
        }
    });

    // Chart colors
    Object.entries(colors.charts).forEach(([key, value]) => {
        // key is 1, 2, 3... -> --chart-1
        if (typeof value === 'object' && 'light' in value && 'dark' in value) {
            lightVars.push(`--chart-${key}: ${value.light};`);
            darkVars.push(`--chart-${key}: ${value.dark};`);
        }
    });

    return `
    :root {
      ${lightVars.join('\n      ')}
    }
    .dark {
      ${darkVars.join('\n      ')}
    }
  `;
}
