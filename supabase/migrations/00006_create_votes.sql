-- Migration: 00006_create_votes
-- User votes/predictions on events

CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  
  -- The prediction
  prediction BOOLEAN NOT NULL, -- TRUE = Yes, FALSE = No
  trust_score_at_vote FLOAT NOT NULL CHECK (trust_score_at_vote >= 0 AND trust_score_at_vote <= 1),
  confidence_level TEXT NOT NULL DEFAULT 'medium' CHECK (confidence_level IN ('low', 'medium', 'high')),
  
  -- Result (set after event settles)
  is_correct BOOLEAN, -- NULL until settled
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- One vote per user per event
  UNIQUE(user_id, event_id)
);

-- Indexes for analytics
CREATE INDEX idx_votes_event ON public.votes(event_id);
CREATE INDEX idx_votes_user ON public.votes(user_id, created_at DESC);
CREATE INDEX idx_votes_prediction ON public.votes(event_id, prediction);

-- Enable RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Function to update event vote counts
CREATE OR REPLACE FUNCTION public.update_event_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.events
    SET 
      yes_count = yes_count + CASE WHEN NEW.prediction THEN 1 ELSE 0 END,
      no_count = no_count + CASE WHEN NOT NEW.prediction THEN 1 ELSE 0 END,
      weighted_yes = weighted_yes + CASE WHEN NEW.prediction THEN NEW.trust_score_at_vote ELSE 0 END,
      weighted_no = weighted_no + CASE WHEN NOT NEW.prediction THEN NEW.trust_score_at_vote ELSE 0 END
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.events
    SET 
      yes_count = yes_count - CASE WHEN OLD.prediction THEN 1 ELSE 0 END,
      no_count = no_count - CASE WHEN NOT OLD.prediction THEN 1 ELSE 0 END,
      weighted_yes = weighted_yes - CASE WHEN OLD.prediction THEN OLD.trust_score_at_vote ELSE 0 END,
      weighted_no = weighted_no - CASE WHEN NOT OLD.prediction THEN OLD.trust_score_at_vote ELSE 0 END
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_vote_change
  AFTER INSERT OR DELETE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.update_event_vote_counts();

COMMENT ON TABLE public.votes IS 'User predictions on events with trust score at vote time';
