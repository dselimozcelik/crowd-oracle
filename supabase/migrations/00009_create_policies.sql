-- Migration: 00009_create_policies
-- Row Level Security policies for all tables

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Anyone can read profiles
CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Prevent users from changing admin/banned status
CREATE POLICY "Cannot self-modify admin status"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    (is_admin = (SELECT is_admin FROM public.profiles WHERE id = auth.uid())) AND
    (is_banned = (SELECT is_banned FROM public.profiles WHERE id = auth.uid()))
  );

-- ============================================
-- USER_DEMOGRAPHICS POLICIES
-- ============================================

-- Users can only see their own demographics
CREATE POLICY "Users can view own demographics"
  ON public.user_demographics FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own demographics
CREATE POLICY "Users can insert own demographics"
  ON public.user_demographics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own demographics
CREATE POLICY "Users can update own demographics"
  ON public.user_demographics FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- USER_STATS POLICIES
-- ============================================

-- Anyone can read stats (for leaderboard)
CREATE POLICY "Stats are publicly readable"
  ON public.user_stats FOR SELECT
  USING (true);

-- Only system can update stats (via triggers/functions)
-- No direct update policy for users

-- ============================================
-- CATEGORIES POLICIES
-- ============================================

-- Anyone can read categories
CREATE POLICY "Categories are publicly readable"
  ON public.categories FOR SELECT
  USING (true);

-- Only admins can modify categories
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- EVENTS POLICIES
-- ============================================

-- Anyone can read active/closed/settled events
CREATE POLICY "Published events are publicly readable"
  ON public.events FOR SELECT
  USING (status IN ('active', 'closed', 'settled'));

-- Admins can see all events (including drafts)
CREATE POLICY "Admins can see all events"
  ON public.events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can create events
CREATE POLICY "Admins can create events"
  ON public.events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can update events
CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- VOTES POLICIES
-- ============================================

-- Users can see their own votes
CREATE POLICY "Users can view own votes"
  ON public.votes FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can see all votes (for analytics)
CREATE POLICY "Admins can view all votes"
  ON public.votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Users can vote on active events if not banned
CREATE POLICY "Users can vote on active events"
  ON public.votes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    -- User is not banned
    NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_banned = true
    ) AND
    -- Event is active
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = event_id AND status = 'active' AND deadline > NOW()
    )
  );

-- Users cannot update or delete votes
-- No UPDATE/DELETE policies

-- ============================================
-- BADGES POLICIES
-- ============================================

-- Anyone can read badges
CREATE POLICY "Badges are publicly readable"
  ON public.badges FOR SELECT
  USING (true);

-- Only admins can manage badges
CREATE POLICY "Admins can manage badges"
  ON public.badges FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- USER_BADGES POLICIES
-- ============================================

-- Anyone can read user badges
CREATE POLICY "User badges are publicly readable"
  ON public.user_badges FOR SELECT
  USING (true);

-- Only system can award badges (via functions)
-- No direct INSERT policy for users

COMMENT ON POLICY "Users can vote on active events" ON public.votes IS 
  'Ensures only active, non-deadline-passed events can receive votes from non-banned users';
