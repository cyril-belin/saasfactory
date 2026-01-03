-- ==============================================================================
-- TESTS RLS (Row Level Security)
-- ==============================================================================
-- Ce fichier contient des requêtes pour tester l'isolation des données.
-- À exécuter dans l'éditeur SQL de Supabase.

-- Simulation d'un utilisateur "USER_A"
-- Remplacer 'UUID_USER_A' par un vrai UUID existant ou généré
-- SET LOCAL role authenticated;
-- SET LOCAL "request.jwt.claim.sub" = 'UUID_USER_A';

-- ------------------------------------------------------------------------------
-- TEST 1: User Profile Isolation
-- ------------------------------------------------------------------------------
-- Devrait retourner 1 ligne (le profil de l'utilisateur connecté)
SELECT * FROM "User" WHERE id = auth.uid()::text;

-- Devrait retourner les collègues, mais pas les utilisateurs inconnus
SELECT * FROM "User"; -- Vérifier que seuls les collègues apparaissent

-- ------------------------------------------------------------------------------
-- TEST 2: Workspace Access
-- ------------------------------------------------------------------------------
-- Lister les workspaces visibles
SELECT * FROM "Workspace";

-- Tenter de voir un workspace dont je ne suis pas membre (ne doit rien retourner)
-- Remplacer UUID_WORKSPACE_X par un ID valide où je ne suis pas membre
-- SELECT * FROM "Workspace" WHERE id = 'UUID_WORKSPACE_X';

-- ------------------------------------------------------------------------------
-- TEST 3: Modification Workspace (Owner vs Member)
-- ------------------------------------------------------------------------------
-- Si OWNER : L'update doit réussir
-- UPDATE "Workspace" SET name = 'New Name' WHERE id = 'MY_WORKSPACE_ID';

-- Si MEMBER : L'update doit échouer (retourner 0 rows updated ou erreur)

-- ------------------------------------------------------------------------------
-- TEST 4: Isolation AnnouncementRead
-- ------------------------------------------------------------------------------
-- Créer une lecture
INSERT INTO "AnnouncementRead" ("announcementId", "userId") 
VALUES ((SELECT id FROM "Announcement" LIMIT 1), auth.uid()::text);

-- Vérifier que je la vois
SELECT * FROM "AnnouncementRead";

-- ------------------------------------------------------------------------------
-- TEST 5: Données Système
-- ------------------------------------------------------------------------------
-- Doit retourner toutes les lignes
SELECT count(*) FROM "FeatureFlag";
SELECT count(*) FROM "LegalPage";

-- ------------------------------------------------------------------------------
-- TEST 6: Données Sensibles
-- ------------------------------------------------------------------------------
-- Doit retourner 0 ligne (ou erreur permission denied)
SELECT * FROM "StripeEvent";
