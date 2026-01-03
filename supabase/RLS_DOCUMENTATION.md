# Documentation RLS (Row Level Security)

Ce document décrit les règles de sécurité implémentées via Supabase RLS.

## Principes Généraux
- **Isolation** : Les données sont isolées par utilisateur et par workspace.
- **Identification** : L'ID utilisateur est récupéré via `auth.uid()`.
- **Rôles** : Les permissions distinguent les membres simples des propriétaires (OWNER).

## Détail des Policies

### 1. User
- **SELECT** : Un utilisateur peut voir son propre profil. Il peut également voir les profils des autres membres avec qui il partage un workspace.
- **UPDATE** : Un utilisateur ne peut modifier que son propre profil.

### 2. Workspace
- **SELECT** : Accessible uniquement aux membres du workspace.
- **UPDATE** : Accessible uniquement aux membres ayant le rôle `OWNER`.
- **INSERT** : Tout utilisateur authentifié peut créer un workspace (il en devient le propriétaire).

### 3. WorkspaceMember
- **SELECT** : Un membre peut voir la liste des membres de ses workspaces.
- **ALL (Insert/Update/Delete)** : Réservé aux `OWNER` du workspace.
- **DELETE (Leave)** : Un utilisateur peut supprimer sa propre adhésion (quitter le workspace).

### 4. Données Publiques / Système
Les tables suivantes sont accessibles en lecture à tous les utilisateurs (y compris anonymes si configuré, ou authentifiés) :
- `Announcement` (Annonces publiques)
- `FeatureFlag` (Configuration des fonctionnalités)
- `LegalPage` (Pages légales)
- `SubscriptionPlan` (Plans d'abonnement)
- `SystemSetting` (Paramètres globaux)

### 5. Isolation Stricte
- **AnnouncementRead** : Visible uniquement par l'utilisateur concerné (`userId`).
- **SupportTicket** : Visible et gérable uniquement par le créateur du ticket (`userId`).

### 6. Données Sensibles (Service Role Uniquement)
- **StripeEvent** : Aucune politique d'accès public. Accessible uniquement via la clé Service Role (backend).

## Application
Exécutez le script SQL `supabase/rls_policies.sql` dans l'éditeur SQL de Supabase pour appliquer ces règles.

## Tests
Des requêtes de test sont disponibles dans `supabase/tests/rls_tests.sql` pour valider l'isolation.
