-- Migration: 00008_create_functions
-- Core database functions for trust score calculation and event settling

-- Bayesian Trust Score Calculation
-- Uses Beta distribution prior (α=2, β=2) for new users
-- Formula: (correct + α) / (total + α + β)
CREATE OR REPLACE FUNCTION public.calculate_trust_score(
  correct_count INT,
  total_count INT
) RETURNS FLOAT AS $$
DECLARE
  alpha FLOAT := 2.0;  -- Prior successes (skeptical prior)
  beta_val FLOAT := 2.0;   -- Prior failures
BEGIN
  -- New users start at 0.5: (0+2)/(0+2+2) = 0.5
  -- High performers converge to their true accuracy
  RETURN (correct_count::FLOAT + alpha) / (total_count::FLOAT + alpha + beta_val);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to settle an event and update all affected user stats/scores
CREATE OR REPLACE FUNCTION public.settle_event(
  p_event_id UUID,
  p_outcome BOOLEAN,
  p_settled_by UUID
) RETURNS VOID AS $$
DECLARE
  v_vote RECORD;
  v_user_stats RECORD;
  v_new_trust_score FLOAT;
  v_is_correct BOOLEAN;
BEGIN
  -- Validate event exists and is closed
  IF NOT EXISTS (
    SELECT 1 FROM public.events 
    WHERE id = p_event_id AND status = 'closed'
  ) THEN
    RAISE EXCEPTION 'Event must be in closed status to settle';
  END IF;
  
  -- Update event status and outcome
  UPDATE public.events
  SET 
    status = 'settled',
    outcome = p_outcome,
    settled_by = p_settled_by,
    settled_at = NOW()
  WHERE id = p_event_id;
  
  -- Process each vote
  FOR v_vote IN 
    SELECT v.*, p.id as profile_id
    FROM public.votes v
    JOIN public.profiles p ON p.id = v.user_id
    WHERE v.event_id = p_event_id
  LOOP
    -- Determine if vote was correct
    v_is_correct := (v_vote.prediction = p_outcome);
    
    -- Update vote record
    UPDATE public.votes
    SET is_correct = v_is_correct
    WHERE id = v_vote.id;
    
    -- Get current user stats
    SELECT * INTO v_user_stats
    FROM public.user_stats
    WHERE user_id = v_vote.user_id;
    
    -- Update user stats
    UPDATE public.user_stats
    SET
      total_predictions = total_predictions + 1,
      correct_predictions = correct_predictions + CASE WHEN v_is_correct THEN 1 ELSE 0 END,
      current_streak = CASE 
        WHEN v_is_correct THEN current_streak + 1 
        ELSE 0 
      END,
      best_streak = GREATEST(
        best_streak,
        CASE WHEN v_is_correct THEN current_streak + 1 ELSE current_streak END
      ),
      last_prediction_at = NOW()
    WHERE user_id = v_vote.user_id;
    
    -- Calculate new trust score
    SELECT calculate_trust_score(
      correct_predictions,
      total_predictions
    ) INTO v_new_trust_score
    FROM public.user_stats
    WHERE user_id = v_vote.user_id;
    
    -- Update profile trust score
    UPDATE public.profiles
    SET trust_score = v_new_trust_score
    WHERE id = v_vote.user_id;
    
    -- Update weighted accuracy in stats
    UPDATE public.user_stats
    SET weighted_accuracy = v_new_trust_score
    WHERE user_id = v_vote.user_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to recalculate all rankings
CREATE OR REPLACE FUNCTION public.recalculate_rankings()
RETURNS VOID AS $$
BEGIN
  -- Update ranks based on weighted_accuracy and total_predictions
  WITH ranked AS (
    SELECT 
      user_id,
      ROW_NUMBER() OVER (
        ORDER BY 
          weighted_accuracy DESC,
          total_predictions DESC,
          best_streak DESC
      ) as new_rank
    FROM public.user_stats
    WHERE total_predictions >= 5 -- Minimum predictions to rank
  )
  UPDATE public.user_stats s
  SET rank = r.new_rank
  FROM ranked r
  WHERE s.user_id = r.user_id;
  
  -- Set NULL rank for users with < 5 predictions
  UPDATE public.user_stats
  SET rank = NULL
  WHERE total_predictions < 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_stats RECORD;
  v_badge RECORD;
BEGIN
  -- Get user stats
  SELECT * INTO v_stats
  FROM public.user_stats
  WHERE user_id = p_user_id;
  
  -- Check each badge criteria
  FOR v_badge IN SELECT * FROM public.badges LOOP
    -- Skip if already earned
    IF EXISTS (
      SELECT 1 FROM public.user_badges 
      WHERE user_id = p_user_id AND badge_id = v_badge.id
    ) THEN
      CONTINUE;
    END IF;
    
    -- Check criteria
    CASE v_badge.criteria_type
      WHEN 'first_vote' THEN
        IF v_stats.total_predictions >= 1 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
        END IF;
      WHEN 'votes' THEN
        IF v_stats.total_predictions >= v_badge.criteria_value THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
        END IF;
      WHEN 'streak' THEN
        IF v_stats.best_streak >= v_badge.criteria_value THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
        END IF;
      WHEN 'accuracy' THEN
        -- Accuracy badges require minimum votes
        IF v_stats.total_predictions >= 20 AND 
           (v_stats.weighted_accuracy * 100) >= v_badge.criteria_value THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
        END IF;
      WHEN 'rank' THEN
        IF v_stats.rank IS NOT NULL AND v_stats.rank <= v_badge.criteria_value THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
        END IF;
    END CASE;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to check badges after stats update
CREATE OR REPLACE FUNCTION public.trigger_check_badges()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.check_and_award_badges(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_stats_update_check_badges
  AFTER UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.trigger_check_badges();

COMMENT ON FUNCTION public.calculate_trust_score IS 'Bayesian trust score using Beta distribution (α=2, β=2)';
COMMENT ON FUNCTION public.settle_event IS 'Settles an event and updates all user stats/scores';
COMMENT ON FUNCTION public.recalculate_rankings IS 'Recalculates leaderboard rankings for all users';
