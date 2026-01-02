-- scripts/setup-rls.sql

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Workspace" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkspaceMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Announcement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AnnouncementRead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FeatureFlag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StripeEvent" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON "User" FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON "User" FOR UPDATE
USING (auth.uid() = id);

-- ============================================
-- WORKSPACES TABLE POLICIES
-- ============================================

-- Users can view workspaces they own or are members of
CREATE POLICY "Users can view member workspaces"
ON "Workspace" FOR SELECT
USING (
  "ownerId" = auth.uid() OR
  EXISTS (
    SELECT 1 FROM "WorkspaceMember"
    WHERE "WorkspaceMember"."workspaceId" = "Workspace".id
    AND "WorkspaceMember"."userId" = auth.uid()
  )
);

-- Authenticated users can create workspaces (become owner)
CREATE POLICY "Authenticated users can create workspace"
ON "Workspace" FOR INSERT
WITH CHECK (auth.uid() = "ownerId");

-- Only owner can update workspace
CREATE POLICY "Owner can update workspace"
ON "Workspace" FOR UPDATE
USING ("ownerId" = auth.uid());

-- Only owner can delete workspace
CREATE POLICY "Owner can delete workspace"
ON "Workspace" FOR DELETE
USING ("ownerId" = auth.uid());

-- ============================================
-- WORKSPACE MEMBERS TABLE POLICIES
-- ============================================

-- Users can view members of workspaces they belong to
CREATE POLICY "Users can view workspace members"
ON "WorkspaceMember" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "Workspace"
    WHERE "Workspace".id = "WorkspaceMember"."workspaceId"
    AND (
      "Workspace"."ownerId" = auth.uid() OR
      EXISTS (
        SELECT 1 FROM "WorkspaceMember" wm
        WHERE wm."workspaceId" = "Workspace".id
        AND wm."userId" = auth.uid()
      )
    )
  )
);

-- Only workspace owner can add members
CREATE POLICY "Owner can add members"
ON "WorkspaceMember" FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "Workspace"
    WHERE "Workspace".id = "workspaceId"
    AND "Workspace"."ownerId" = auth.uid()
  )
);

-- Owner can remove members, members can remove themselves
CREATE POLICY "Owner and self can remove member"
ON "WorkspaceMember" FOR DELETE
USING (
  "userId" = auth.uid() OR
  EXISTS (
    SELECT 1 FROM "Workspace"
    WHERE "Workspace".id = "workspaceId"
    AND "Workspace"."ownerId" = auth.uid()
  )
);

-- ============================================
-- ANNOUNCEMENTS TABLE POLICIES
-- ============================================

-- Everyone sees public announcements, authenticated users see all
CREATE POLICY "Public announcements viewable by all"
ON "Announcement" FOR SELECT
USING ("isPublic" = true OR auth.uid() IS NOT NULL);

-- INSERT/UPDATE/DELETE: Admin only (via service role key)
-- No policies needed - use service role key in admin functions

-- ============================================
-- ANNOUNCEMENT READ TABLE POLICIES
-- ============================================

-- Users can view their own reads
CREATE POLICY "Users can view own reads"
ON "AnnouncementRead" FOR SELECT
USING ("userId" = auth.uid());

-- Users can insert their own reads
CREATE POLICY "Users can mark announcements as read"
ON "AnnouncementRead" FOR INSERT
WITH CHECK ("userId" = auth.uid());

-- Users can update their own reads
CREATE POLICY "Users can update own reads"
ON "AnnouncementRead" FOR UPDATE
USING ("userId" = auth.uid());

-- ============================================
-- FEATURE FLAGS TABLE POLICIES
-- ============================================

-- Everyone can read feature flags
CREATE POLICY "Anyone can read feature flags"
ON "FeatureFlag" FOR SELECT
USING (true);

-- INSERT/UPDATE/DELETE: Admin only (via service role key)
-- No policies needed - use service role key

-- ============================================
-- STRIPE EVENTS TABLE POLICIES
-- ============================================

-- Only service role can access (webhooks)
-- No SELECT policy - enforce server-side only
