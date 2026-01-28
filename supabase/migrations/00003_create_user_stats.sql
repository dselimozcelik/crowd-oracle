-- Migration: 00003_create_user_stats
-- Aggregated prediction statistics for each user

CREATE TABLE public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_predictions INT NOT NULL DEFAULT 0 CHECK (total_predictions >= 0),
  correct_predictions INT NOT NULL DEFAULT 0 CHECK (correct_predictions >= 0),
  current_streak INT NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  best_streak INT NOT NULL DEFAULT 0 CHECK (best_streak >= 0),
  weighted_accuracy FLOAT NOT NULL DEFAULT 0.5 CHECK (weighted_accuracy >= 0 AND weighted_accuracy <= 1),
  rank INT,
  last_prediction_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT correct_lte_total CHECK (correct_predictions <= total_predictions)
);

-- Index for leaderboard queries
CREATE INDEX idx_user_stats_rank ON public.user_stats(rank ASC NULLS LAST);
CREATE INDEX idx_user_stats_trust ON public.user_stats(weighted_accuracy DESC);
CREATE INDEX idx_user_stats_streak ON public.user_stats(current_streak DESC);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Auto-create stats row when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- Updated_at trigger
CREATE TRIGGER user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TABLE public.user_stats IS 'Aggregated prediction statistics per user for gamification';
