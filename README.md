# SaaS Factory

<div align="center">

![SaaS Factory](https://placehold.co/1200x400/000000/FFFFFF/png?text=SaaS+Factory)

**Le Starter Kit moderne et complet pour lancer votre SaaS en un temps record.**

[Fonctionnalités](#fonctionnalités) • [Stack Technique](#stack-technique) • [Installation](#installation) • [Configuration](#configuration)

</div>

---

## 🚀 Présentation

Oubliez la configuration des outils répétitifs. **SaaS Factory** est une fondation robuste, prête pour la production, construite avec les meilleures technologies du moment : **Next.js 16**, **Supabase**, **Stripe**, et **Tailwind CSS 4**. 

Conçu pour la performance, l'évolutivité et une expérience utilisateur ("UX") exceptionnelle dès le premier jour.

## ✨ Fonctionnalités Clés

### 🛠️ Core & Infrastructure
- **Authentification Complète** : Login, Register, Magic Links, OAuth (Google/GitHub) via Supabase Auth.
- **Base de Données** : PostgreSQL géré par Supabase, avec interface de type-safe via **Prisma ORM**.
- **Multi-Tenancy (Workspaces)** : Gestion native des équipes et espaces de travail. Créez, changez et invitez des membres.
- **Paiements & Abonnements** : Intégration **Stripe** clé-en-main (Checkout, Portal, Webhooks). Plans configurables (Starter, Pro, Business).

### 🎨 Interface & Expérience
- **UI Premium & Moderne** : Design system basé sur **Shadcn UI** et **Tailwind CSS 4**.
- **Animations Fluides** : Intégration de **Framer Motion** pour des interactions dynamiques.
- **Thèmes** : Support natif du mode Sombre/Clair (Dark Mode).
- **Responsive** : Interface 100% mobile-first.

### ⚡ Back-office & Outils Admin
- **Dashboard Admin** : Panneau de contrôle complet pour gérer les utilisateurs, les workspaces et les configurations.
- **Feature Flags** : Activez/Désactivez des fonctionnalités en temps réel sans redéployer.
- **Maintenance Mode** : Basculez le site en maintenance pour les utilisateurs tout en gardant l'accès admin.
- **In-App Changelog** : Publiez les mises à jour de votre produit directement depuis l'admin et affichez-les aux utilisateurs.
- **Systeme de Support** : Gestion des tickets et demandes de support intégrée.
- **Gestion des Pages Légales** : Éditez les CGU, Mentions Légales, et Confidentialité directement depuis l'admin.

### 📈 Services Tiers & Utilitaires
- **Emails Transactionnels** : Templates email modernes avec **React Email** et envoi via **Resend**.
- **Stockage de Fichiers** : Upload et gestion de fichiers via **Supabase Storage**.
- **Analytics** : Intégration facile de Google Analytics 4.
- **SEO Ready** : Métadonnées dynamiques, sitemap et robots.txt configurés.

## 🏗️ Stack Technique

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Style** : [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Base de données** : [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM** : [Prisma](https://www.prisma.io/)
- **Auth** : Supabase Auth
- **Paiements** : [Stripe](https://stripe.com/)
- **Email** : [Resend](https://resend.com/) & [React Email](https://react.email/)
- **Validation** : [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## 💻 Installation

### Prérequis
- Node.js 20+
- Un compte Supabase
- Un compte Stripe
- Un compte Resend

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/saas-factory.git
cd saas-factory
```

### 2. Installer les dépendances
```bash
npm install
# ou
pnpm install
# ou
yarn install
```

### 3. Configuration des variables d'environnement
Dupliquez le fichier `.env.example` en `.env` et remplissez les clés nécessaires.

```bash
cp .env.example .env
```

**Variables Essentielles :**
- `DATABASE_URL` & `DIRECT_URL` (Supabase)
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`

### 4. Base de données
Poussez le schéma Prisma vers votre base de données Supabase.

```bash
npx prisma db push
# Si vous avez des données initiales à charger (seed)
npx prisma db seed
```

### 5. Lancer le serveur de développement
```bash
npm run dev
```
Rendez-vous sur [http://localhost:3000](http://localhost:3000).

## 📂 Structure du Projet

```
src/
├── app/               # Pages et Routes (App Router)
│   ├── (auth)/        # Routes d'authentification (login, register...)
│   ├── (dashboard)/   # Espace utilisateur connecté
│   ├── (public)/      # Landing page et pages publiques
│   ├── admin/         # Dashboard administrateur
│   └── api/           # Routes API & Webhooks
├── components/        # Composants Réutilisables (UI, Features...)
├── lib/               # Utilitaires, configurations (Prisma, Stripe, Utils)
├── email/             # Templates React Email
└── styles/            # Fichiers CSS globaux
prisma/                # Schéma de base de données et migrations
public/                # Assets statiques (images, fonts)
```

## 📜 Scripts Disponibles

- `npm run dev` : Lance le serveur de développement.
- `npm run build` : Compile l'application pour la production.
- `npm run start` : Lance l'application compilée.
- `npm run lint` : Vérifie la qualité du code.
- `npx prisma studio` : Interface visuelle pour gérer la base de données.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une Pull Request pour suggérer des améliorations.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
