-- ==============================================================================
-- SAAS FACTORY RLS POLICIES
-- ==============================================================================
-- This file defines the Row Level Security (RLS) policies for the application.
-- 
-- Goal: Isolate data by User and Workspace, and protect sensitive data.
-- Identifier: auth.uid() (Supabase Auth)
--
-- Tables covered:
-- 1. User
-- 2. Workspace
-- 3. WorkspaceMember
-- 4. Announcement
-- 5. AnnouncementRead
-- 6. FeatureFlag
-- 7. LegalPage
-- 8. SubscriptionPlan
-- 9. SystemSetting
-- 10. StripeEvent
-- 11. SupportTicket

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Workspace" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkspaceMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Announcement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AnnouncementRead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FeatureFlag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LegalPage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SubscriptionPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SystemSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StripeEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupportTicket" ENABLE ROW LEVEL SECURITY;

-- Helper function to check if a user is an owner of a workspace
-- (Optional, but useful for cleaner policies if complexity grows)
-- CREATE OR REPLACE FUNCTION is_workspace_owner(workspace_id text) RETURNS boolean AS $$
--   SELECT EXISTS (
--     SELECT 1 FROM "WorkspaceMember"
--     WHERE "workspaceId" = workspace_id
--     AND "userId" = auth.uid()::text
--     AND role = 'OWNER'
--   );
-- $$ LANGUAGE sql SECURITY DEFINER;

-- ==============================================================================
-- 1. USER
-- ==============================================================================
-- Rules:
-- - Users can read their own profile.
-- - Users can update their own profile.
-- - Users can read profiles of other members in the same workspace (for UI/Team view).

DROP POLICY IF EXISTS "Users can read own profile" ON "User";
CREATE POLICY "Users can read own profile" ON "User" 
FOR SELECT USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can update own profile" ON "User";
CREATE POLICY "Users can update own profile" ON "User" 
FOR UPDATE USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can read members of shared workspaces" ON "User";
CREATE POLICY "Users can read members of shared workspaces" ON "User" 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "WorkspaceMember" my_mem
    JOIN "WorkspaceMember" other_mem ON my_mem."workspaceId" = other_mem."workspaceId"
    WHERE my_mem."userId" = auth.uid()::text
    AND other_mem."userId" = "User".id
  )
);

-- ==============================================================================
-- 2. WORKSPACE
-- ==============================================================================
-- Rules:
-- - Members can read workspace details.
-- - Only OWNERS can update workspace details.
-- - Any authenticated user can create a workspace (they become owner).

DROP POLICY IF EXISTS "Members can read workspace" ON "Workspace";
CREATE POLICY "Members can read workspace" ON "Workspace" 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "WorkspaceMember" 
    WHERE "workspaceId" = "Workspace".id 
    AND "userId" = auth.uid()::text
  )
);

DROP POLICY IF EXISTS "Owners can update workspace" ON "Workspace";
CREATE POLICY "Owners can update workspace" ON "Workspace" 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "WorkspaceMember" 
    WHERE "workspaceId" = "Workspace".id 
    AND "userId" = auth.uid()::text 
    AND role = 'OWNER'
  )
);

DROP POLICY IF EXISTS "Users can create workspace" ON "Workspace";
CREATE POLICY "Users can create workspace" ON "Workspace" 
FOR INSERT WITH CHECK (
  "ownerId" = auth.uid()::text
);

-- ==============================================================================
-- 3. WORKSPACE MEMBER
-- ==============================================================================
-- Rules:
-- - Members can view the list of members in their workspaces.
-- - OWNERS can manage (add/update/remove) members.
-- - Users can leave a workspace (delete their own membership).

DROP POLICY IF EXISTS "Members can view workspace members" ON "WorkspaceMember";
CREATE POLICY "Members can view workspace members" ON "WorkspaceMember" 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "WorkspaceMember" my_mem 
    WHERE my_mem."workspaceId" = "WorkspaceMember"."workspaceId" 
    AND my_mem."userId" = auth.uid()::text
  )
);

DROP POLICY IF EXISTS "Owners can manage members" ON "WorkspaceMember";
CREATE POLICY "Owners can manage members" ON "WorkspaceMember" 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM "WorkspaceMember" owner_mem 
    WHERE owner_mem."workspaceId" = "WorkspaceMember"."workspaceId" 
    AND owner_mem."userId" = auth.uid()::text 
    AND owner_mem.role = 'OWNER'
  )
);

DROP POLICY IF EXISTS "Users can leave workspace" ON "WorkspaceMember";
CREATE POLICY "Users can leave workspace" ON "WorkspaceMember" 
FOR DELETE USING (
  "userId" = auth.uid()::text
);

-- ==============================================================================
-- 4. ANNOUNCEMENT
-- ==============================================================================
-- Rules:
-- - Publicly readable (or at least for authenticated users).
-- - Write access restricted to Service Role (Admin).

DROP POLICY IF EXISTS "Everyone can read announcements" ON "Announcement";
CREATE POLICY "Everyone can read announcements" ON "Announcement" 
FOR SELECT USING (true);

-- ==============================================================================
-- 5. ANNOUNCEMENT READ
-- ==============================================================================
-- Rules:
-- - Isolated by userId. Users manage their own read status.

DROP POLICY IF EXISTS "Users manage own announcement reads" ON "AnnouncementRead";
CREATE POLICY "Users manage own announcement reads" ON "AnnouncementRead" 
FOR ALL USING (
  "userId" = auth.uid()::text
);

-- ==============================================================================
-- 6. FEATURE FLAG
-- ==============================================================================
-- Rules:
-- - Accessible to all (Public/System).

DROP POLICY IF EXISTS "Everyone can read feature flags" ON "FeatureFlag";
CREATE POLICY "Everyone can read feature flags" ON "FeatureFlag" 
FOR SELECT USING (true);

-- ==============================================================================
-- 7. LEGAL PAGE
-- ==============================================================================
-- Rules:
-- - Accessible to all (Public Content).

DROP POLICY IF EXISTS "Everyone can read legal pages" ON "LegalPage";
CREATE POLICY "Everyone can read legal pages" ON "LegalPage" 
FOR SELECT USING (true);

-- ==============================================================================
-- 8. SUBSCRIPTION PLAN
-- ==============================================================================
-- Rules:
-- - Accessible to all (Public Pricing).

DROP POLICY IF EXISTS "Everyone can read subscription plans" ON "SubscriptionPlan";
CREATE POLICY "Everyone can read subscription plans" ON "SubscriptionPlan" 
FOR SELECT USING (true);

-- ==============================================================================
-- 9. SYSTEM SETTING
-- ==============================================================================
-- Rules:
-- - Accessible to all (Public Config).

DROP POLICY IF EXISTS "Everyone can read system settings" ON "SystemSetting";
CREATE POLICY "Everyone can read system settings" ON "SystemSetting" 
FOR SELECT USING (true);

-- ==============================================================================
-- 10. STRIPE EVENT
-- ==============================================================================
-- Rules:
-- - Sensitive data. No access for public/authenticated users.
-- - Service Role only (bypasses RLS by default).

-- No policies needed implies DENY ALL for normal users.

-- ==============================================================================
-- 11. SUPPORT TICKET
-- ==============================================================================
-- Rules:
-- - Users can manage their own tickets.

DROP POLICY IF EXISTS "Users manage own support tickets" ON "SupportTicket";
CREATE POLICY "Users manage own support tickets" ON "SupportTicket" 
FOR ALL USING (
  "userId" = auth.uid()::text
);
