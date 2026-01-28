-- Migration: 00007_create_badges
-- Gamification badges and achievements

CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  criteria_type TEXT NOT NULL CHECK (criteria_type IN (
    'streak', 'accuracy', 'votes', 'rank', 'first_vote', 'category_expert'
  )),
  criteria_value INT NOT NULL DEFAULT 0,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE, -- For category-specific badges
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User earned badges
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, badge_id)
);

-- Indexes
CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX idx_badges_tier ON public.badges(tier);

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Seed default badges
INSERT INTO public.badges (name, description, icon, tier, criteria_type, criteria_value) VALUES
  -- First steps
  ('First Prediction', 'Made your first prediction', '🎯', 'bronze', 'first_vote', 1),
  
  -- Vote count badges
  ('Rookie Predictor', 'Made 10 predictions', '🌱', 'bronze', 'votes', 10),
  ('Regular Predictor', 'Made 50 predictions', '📊', 'silver', 'votes', 50),
  ('Expert Predictor', 'Made 100 predictions', '🏆', 'gold', 'votes', 100),
  ('Master Predictor', 'Made 500 predictions', '👑', 'platinum', 'votes', 500),
  
  -- Streak badges
  ('Hot Streak', '5 correct predictions in a row', '🔥', 'bronze', 'streak', 5),
  ('On Fire', '10 correct predictions in a row', '⚡', 'silver', 'streak', 10),
  ('Unstoppable', '20 correct predictions in a row', '💫', 'gold', 'streak', 20),
  ('Legendary Streak', '50 correct predictions in a row', '🌟', 'platinum', 'streak', 50),
  
  -- Accuracy badges
  ('Sharp Eye', '60% accuracy (min 20 votes)', '👁️', 'bronze', 'accuracy', 60),
  ('Keen Insight', '70% accuracy (min 50 votes)', '🔮', 'silver', 'accuracy', 70),
  ('Oracle', '80% accuracy (min 100 votes)', '🧙', 'gold', 'accuracy', 80),
  ('Superforecaster', '90% accuracy (min 100 votes)', '🦅', 'platinum', 'accuracy', 90),
  
  -- Rank badges
  ('Top 100', 'Reached top 100 on the leaderboard', '💯', 'silver', 'rank', 100),
  ('Top 10', 'Reached top 10 on the leaderboard', '🥇', 'gold', 'rank', 10),
  ('Champion', 'Reached #1 on the leaderboard', '👑', 'platinum', 'rank', 1);

COMMENT ON TABLE public.badges IS 'Achievement badges for gamification';
COMMENT ON TABLE public.user_badges IS 'Badges earned by users';
