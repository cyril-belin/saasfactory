# Système de Theming Centralisé

Le theming de l'application est désormais centralisé dans un fichier de configuration unique : `src/config/theme.ts`.

## 🎨 Changer le thème en 5 minutes

Toutes les modifications se font dans `src/config/theme.ts`.

### 1. Couleurs
Les couleurs sont définies au format `oklch` ou tout format CSS valide (hex, rgb, hsl).
Le système gère automatiquement le mode clair (light) et sombre (dark).

```typescript
// src/config/theme.ts
export const theme = {
  colors: {
    primary: {
      light: "oklch(0.488 0.243 264.376)", // Votre couleur principale
      dark: "oklch(0.6 0.2 270)",
    },
    // ...
  }
}
```

### 2. Branding (Nom, Logo, Description)
Mettez à jour les informations de votre application :

```typescript
app: {
  name: "Mon SaaS", // Utilisé dans le titre et les métadonnées
  tagline: "La solution miracle",
  description: "Description pour le SEO...",
},
logo: {
  light: "/logos/mon-logo-light.svg",
  dark: "/logos/mon-logo-dark.svg",
}
```

### 3. Fonts
Les polices sont chargées dans `layout.tsx` mais référencées ici :

```typescript
fonts: {
  heading: "var(--font-geist-sans)", // Variable CSS définie par next/font
  body: "var(--font-geist-sans)",
}
```

## 🛠 Architecture

Comment ça marche ?

1.  **Configuration** : `src/config/theme.ts` (Source de vérité validée par Zod)
2.  **Injection** : `src/app/layout.tsx` injecte les variables CSS dynamiquement dans le `<head>` via `src/lib/theme-utils.ts`.
3.  **CSS** : `src/app/globals.css` mappe les classes Tailwind (`bg-primary`) aux variables CSS (`var(--primary)`).
4.  **Composants** : `src/components/branding/Logo.tsx` utilise les chemins définis dans la config.

## 📋 Checklist des fichiers

| Fichier | Rôle |
|---------|------|
| `src/config/theme.ts` | **EDITER ICI**. Configuration centrale. |
| `src/lib/theme-utils.ts` | Générateur de CSS (Ne pas toucher sauf besoins avancés). |
| `src/app/layout.tsx` | Point d'injection des styles. |
| `src/app/globals.css` | Mapping Tailwind (Ne plus toucher aux couleurs ici). |
| `tailwind.config.ts` | Importe le theme (Configuration technique). |

## Exemple : Passer au Bleu

Modifiez simplement `src/config/theme.ts` :

```typescript
primary: {
  light: "#2563eb", // Bleu tailwind blue-600
  dark: "#3b82f6",  // Bleu tailwind blue-500
}
```

Le changement est immédiat et se propage à (`bg-primary`, `text-primary`, `border-primary`, `ring-primary`).
