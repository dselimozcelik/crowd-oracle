-- Migration: 00011_implement_dual_scoring
-- New scoring algorithm with:
-- 1. Visible XP (Gamification) - motivates users, mostly increases
-- 2. Hidden Trust Score (Bayesian Beta Distribution) - for B2B accuracy

-- =============================================================================
-- STEP 1: Add new columns for dual scoring system
-- =============================================================================

-- Add XP, alpha, beta to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS xp INT NOT NULL DEFAULT 0 CHECK (xp >= 0),
ADD COLUMN IF NOT EXISTS alpha FLOAT NOT NULL DEFAULT 1.0 CHECK (alpha > 0),
ADD COLUMN IF NOT EXISTS beta FLOAT NOT NULL DEFAULT 9.0 CHECK (beta > 0);

-- Update default trust_score for new users (alpha=1, beta=9 → 0.1)
ALTER TABLE public.profiles 
ALTER COLUMN trust_score SET DEFAULT 0.1;

COMMENT ON COLUMN public.profiles.xp IS 'Visible XP points for gamification (mostly increases)';
COMMENT ON COLUMN public.profiles.alpha IS 'Beta distribution alpha parameter (successes)';
COMMENT ON COLUMN public.profiles.beta IS 'Beta distribution beta parameter (failures)';

-- =============================================================================
-- STEP 2: Add confidence_level to votes if not exists
-- =============================================================================
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'votes' AND column_name = 'confidence_level'
  ) THEN
    ALTER TABLE public.votes ADD COLUMN confidence_level VARCHAR(10) DEFAULT 'medium' 
      CHECK (confidence_level IN ('low', 'medium', 'high'));
  END IF;
END $$;

-- =============================================================================
-- STEP 3: New Trust Score calculation using Beta Distribution
-- =============================================================================

-- Calculate Trust Score from alpha and beta
-- Formula: Trust_Score = alpha / (alpha + beta)
CREATE OR REPLACE FUNCTION public.calculate_trust_score_from_beta(
  p_alpha FLOAT,
  p_beta FLOAT
) RETURNS FLOAT AS $$
BEGIN
  RETURN p_alpha / (p_alpha + p_beta);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================================================
-- STEP 4: Calculate difficulty multiplier based on crowd consensus
-- =============================================================================

-- Difficulty = 1 + (1 - crowd_consensus)
-- If user wins against majority, they get more reward
CREATE OR REPLACE FUNCTION public.calculate_difficulty(
  p_crowd_consensus FLOAT  -- 0.0 to 1.0, % who voted same as user
) RETURNS FLOAT AS $$
BEGIN
  -- Going against crowd is harder, so reward more
  -- crowd_consensus = 0.3 (30% agreed) → difficulty = 1.7
  -- crowd_consensus = 0.7 (70% agreed) → difficulty = 1.3
  RETURN 1.0 + (1.0 - p_crowd_consensus);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================================================
-- STEP 5: Calculate risk multiplier based on confidence level
-- =============================================================================

CREATE OR REPLACE FUNCTION public.calculate_risk_multiplier(
  p_confidence_level VARCHAR(10),
  p_is_correct BOOLEAN
) RETURNS FLOAT AS $$
BEGIN
  -- High confidence = high risk, high reward
  IF p_confidence_level = 'high' THEN
    IF p_is_correct THEN
      RETURN 2.0;  -- 2x reward for correct high confidence
    ELSE
      RETURN 2.5;  -- 2.5x penalty for wrong high confidence
    END IF;
  ELSIF p_confidence_level = 'low' THEN
    RETURN 0.5;  -- Low confidence = low stakes
  ELSE
    RETURN 1.0;  -- Medium confidence = normal
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================================================
-- STEP 6: XP Calculation (Gamification Layer)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.calculate_xp_change(
  p_is_correct BOOLEAN,
  p_difficulty FLOAT,
  p_risk_multiplier FLOAT,
  p_base_xp INT DEFAULT 10
) RETURNS INT AS $$
DECLARE
  v_xp_change INT;
BEGIN
  IF p_is_correct THEN
    -- XP = Base_Point * Difficulty * Risk
    v_xp_change := CEIL(p_base_xp * p_difficulty * p_risk_multiplier);
  ELSE
    -- On incorrect: small penalty or 0 to prevent user churn
    -- Never go negative by more than 1 point
    v_xp_change := GREATEST(-1, 0);
  END IF;
  
  RETURN v_xp_change;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================================================
-- STEP 7: Update Alpha/Beta for Bayesian Trust Score
-- =============================================================================

CREATE OR REPLACE FUNCTION public.update_bayesian_trust(
  p_current_alpha FLOAT,
  p_current_beta FLOAT,
  p_is_correct BOOLEAN,
  p_difficulty FLOAT,
  p_risk_multiplier FLOAT,
  p_decay_factor FLOAT DEFAULT 0.95
) RETURNS TABLE(new_alpha FLOAT, new_beta FLOAT, new_trust_score FLOAT) AS $$
DECLARE
  v_decayed_alpha FLOAT;
  v_decayed_beta FLOAT;
  v_update_amount FLOAT;
BEGIN
  -- Step 1: Apply time decay (memory property - prioritize recent performance)
  v_decayed_alpha := p_current_alpha * p_decay_factor;
  v_decayed_beta := p_current_beta * p_decay_factor;
  
  -- Ensure minimum values to prevent division issues
  v_decayed_alpha := GREATEST(v_decayed_alpha, 0.1);
  v_decayed_beta := GREATEST(v_decayed_beta, 0.1);
  
  -- Step 2: Calculate update amount based on difficulty and risk
  v_update_amount := 1.0 * p_difficulty * p_risk_multiplier;
  
  -- Step 3: Update alpha or beta based on correctness
  IF p_is_correct THEN
    -- Increase alpha (successes)
    new_alpha := v_decayed_alpha + v_update_amount;
    new_beta := v_decayed_beta;
  ELSE
    -- Increase beta (failures) with risk penalty
    new_alpha := v_decayed_alpha;
    new_beta := v_decayed_beta + (v_update_amount * p_risk_multiplier);
  END IF;
  
  -- Step 4: Calculate final trust score
  new_trust_score := new_alpha / (new_alpha + new_beta);
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================================================
-- STEP 8: Updated settle_event function with new scoring
-- =============================================================================

CREATE OR REPLACE FUNCTION public.settle_event(
  p_event_id UUID,
  p_outcome BOOLEAN,
  p_settled_by UUID
) RETURNS VOID AS $$
DECLARE
  v_vote RECORD;
  v_event RECORD;
  v_is_correct BOOLEAN;
  v_crowd_consensus FLOAT;
  v_difficulty FLOAT;
  v_risk_multiplier FLOAT;
  v_xp_change INT;
  v_bayesian_result RECORD;
BEGIN
  -- Validate event exists and is closed
  SELECT * INTO v_event FROM public.events 
  WHERE id = p_event_id AND status = 'closed';
  
  IF NOT FOUND THEN
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
    SELECT v.*, p.id as profile_id, p.alpha, p.beta, p.xp,
           v.confidence_level
    FROM public.votes v
    JOIN public.profiles p ON p.id = v.user_id
    WHERE v.event_id = p_event_id
  LOOP
    -- Determine if vote was correct
    v_is_correct := (v_vote.prediction = p_outcome);
    
    -- Calculate crowd consensus for this user's choice
    IF v_vote.prediction = TRUE THEN
      v_crowd_consensus := v_event.yes_count::FLOAT / NULLIF(v_event.yes_count + v_event.no_count, 0);
    ELSE
      v_crowd_consensus := v_event.no_count::FLOAT / NULLIF(v_event.yes_count + v_event.no_count, 0);
    END IF;
    v_crowd_consensus := COALESCE(v_crowd_consensus, 0.5);
    
    -- Calculate difficulty (1 + (1 - crowd_consensus))
    v_difficulty := calculate_difficulty(v_crowd_consensus);
    
    -- Calculate risk multiplier based on confidence
    v_risk_multiplier := calculate_risk_multiplier(
      COALESCE(v_vote.confidence_level, 'medium'), 
      v_is_correct
    );
    
    -- Update vote record
    UPDATE public.votes
    SET is_correct = v_is_correct
    WHERE id = v_vote.id;
    
    -- Calculate XP change (gamification layer)
    v_xp_change := calculate_xp_change(v_is_correct, v_difficulty, v_risk_multiplier, 10);
    
    -- Calculate new Bayesian trust score
    SELECT * INTO v_bayesian_result FROM update_bayesian_trust(
      v_vote.alpha,
      v_vote.beta,
      v_is_correct,
      v_difficulty,
      v_risk_multiplier,
      0.95  -- decay factor
    );
    
    -- Update profile with new scores
    UPDATE public.profiles
    SET 
      xp = GREATEST(0, xp + v_xp_change),
      alpha = v_bayesian_result.new_alpha,
      beta = v_bayesian_result.new_beta,
      trust_score = v_bayesian_result.new_trust_score
    WHERE id = v_vote.user_id;
    
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
      weighted_accuracy = v_bayesian_result.new_trust_score,
      last_prediction_at = NOW()
    WHERE user_id = v_vote.user_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- STEP 9: Update rankings to use XP for gamification, trust for B2B
-- =============================================================================

CREATE OR REPLACE FUNCTION public.recalculate_rankings()
RETURNS VOID AS $$
BEGIN
  -- Rankings based on XP (visible/gamification) + accuracy as tiebreaker
  WITH ranked AS (
    SELECT 
      us.user_id,
      ROW_NUMBER() OVER (
        ORDER BY 
          p.xp DESC,
          p.trust_score DESC,
          us.best_streak DESC
      ) as new_rank
    FROM public.user_stats us
    JOIN public.profiles p ON p.id = us.user_id
    WHERE us.total_predictions >= 5 -- Minimum predictions to rank
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

-- =============================================================================
-- Comments
-- =============================================================================

COMMENT ON FUNCTION public.calculate_trust_score_from_beta IS 'Calculate trust score from Beta distribution parameters';
COMMENT ON FUNCTION public.calculate_difficulty IS 'Calculate difficulty multiplier (contrarian bonus)';
COMMENT ON FUNCTION public.calculate_risk_multiplier IS 'Risk multiplier based on confidence level';
COMMENT ON FUNCTION public.calculate_xp_change IS 'Calculate XP change for gamification layer';
COMMENT ON FUNCTION public.update_bayesian_trust IS 'Update Bayesian alpha/beta with time decay';
