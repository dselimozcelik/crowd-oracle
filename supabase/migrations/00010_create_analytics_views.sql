-- Migration: 00010_create_analytics_views
-- Views for B2B analytics and reporting

-- View: Event analytics with raw vs weighted results
CREATE OR REPLACE VIEW public.event_analytics AS
SELECT 
  e.id,
  e.title,
  e.status,
  e.outcome,
  c.name as category_name,
  c.slug as category_slug,
  e.deadline,
  e.settled_at,
  
  -- Raw vote counts
  e.yes_count,
  e.no_count,
  (e.yes_count + e.no_count) as total_votes,
  
  -- Raw percentages
  CASE WHEN (e.yes_count + e.no_count) > 0 
    THEN ROUND((e.yes_count::NUMERIC / (e.yes_count + e.no_count)) * 100, 2)
    ELSE 0 
  END as raw_yes_pct,
  CASE WHEN (e.yes_count + e.no_count) > 0 
    THEN ROUND((e.no_count::NUMERIC / (e.yes_count + e.no_count)) * 100, 2)
    ELSE 0 
  END as raw_no_pct,
  
  -- Weighted sums
  ROUND(e.weighted_yes::NUMERIC, 4) as weighted_yes,
  ROUND(e.weighted_no::NUMERIC, 4) as weighted_no,
  
  -- Weighted percentages
  CASE WHEN (e.weighted_yes + e.weighted_no) > 0 
    THEN ROUND(((e.weighted_yes / (e.weighted_yes + e.weighted_no)) * 100)::NUMERIC, 2)
    ELSE 0 
  END as weighted_yes_pct,
  CASE WHEN (e.weighted_yes + e.weighted_no) > 0 
    THEN ROUND(((e.weighted_no / (e.weighted_yes + e.weighted_no)) * 100)::NUMERIC, 2)
    ELSE 0 
  END as weighted_no_pct,
  
  -- Prediction accuracy (if settled)
  CASE 
    WHEN e.outcome IS NULL THEN NULL
    WHEN e.outcome = TRUE AND e.weighted_yes > e.weighted_no THEN TRUE
    WHEN e.outcome = FALSE AND e.weighted_no > e.weighted_yes THEN TRUE
    ELSE FALSE
  END as weighted_prediction_correct,
  
  e.created_at

FROM public.events e
LEFT JOIN public.categories c ON c.id = e.category_id;

-- View: Demographic breakdown for an event
CREATE OR REPLACE VIEW public.event_demographics AS
SELECT 
  v.event_id,
  
  -- Age breakdown
  d.age_range,
  COUNT(*) FILTER (WHERE v.prediction = TRUE) as yes_by_age,
  COUNT(*) FILTER (WHERE v.prediction = FALSE) as no_by_age,
  SUM(v.trust_score_at_vote) FILTER (WHERE v.prediction = TRUE) as weighted_yes_by_age,
  SUM(v.trust_score_at_vote) FILTER (WHERE v.prediction = FALSE) as weighted_no_by_age
  
FROM public.votes v
LEFT JOIN public.user_demographics d ON d.user_id = v.user_id
GROUP BY v.event_id, d.age_range;

-- View: Country breakdown
CREATE OR REPLACE VIEW public.event_by_country AS
SELECT 
  v.event_id,
  d.country,
  COUNT(*) FILTER (WHERE v.prediction = TRUE) as yes_count,
  COUNT(*) FILTER (WHERE v.prediction = FALSE) as no_count,
  SUM(v.trust_score_at_vote) FILTER (WHERE v.prediction = TRUE) as weighted_yes,
  SUM(v.trust_score_at_vote) FILTER (WHERE v.prediction = FALSE) as weighted_no,
  COUNT(DISTINCT v.user_id) as unique_voters
  
FROM public.votes v
LEFT JOIN public.user_demographics d ON d.user_id = v.user_id
GROUP BY v.event_id, d.country;

-- View: Job sector breakdown
CREATE OR REPLACE VIEW public.event_by_sector AS
SELECT 
  v.event_id,
  d.job_sector,
  COUNT(*) FILTER (WHERE v.prediction = TRUE) as yes_count,
  COUNT(*) FILTER (WHERE v.prediction = FALSE) as no_count,
  SUM(v.trust_score_at_vote) FILTER (WHERE v.prediction = TRUE) as weighted_yes,
  SUM(v.trust_score_at_vote) FILTER (WHERE v.prediction = FALSE) as weighted_no,
  COUNT(DISTINCT v.user_id) as unique_voters
  
FROM public.votes v
LEFT JOIN public.user_demographics d ON d.user_id = v.user_id
GROUP BY v.event_id, d.job_sector;

-- View: Leaderboard with profile details
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  p.id as user_id,
  p.username,
  p.avatar_url,
  p.trust_score,
  s.total_predictions,
  s.correct_predictions,
  s.current_streak,
  s.best_streak,
  s.weighted_accuracy,
  s.rank,
  ROUND((s.correct_predictions::NUMERIC / NULLIF(s.total_predictions, 0)) * 100, 1) as accuracy_pct,
  (
    SELECT COUNT(*) 
    FROM public.user_badges ub 
    WHERE ub.user_id = p.id
  ) as badge_count

FROM public.profiles p
JOIN public.user_stats s ON s.user_id = p.id
WHERE s.total_predictions >= 5 -- Minimum to appear on leaderboard
ORDER BY s.rank ASC NULLS LAST;

-- View: Platform statistics
CREATE OR REPLACE VIEW public.platform_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles WHERE is_banned = FALSE) as total_users,
  (SELECT COUNT(*) FROM public.events WHERE status = 'active') as active_events,
  (SELECT COUNT(*) FROM public.events WHERE status = 'settled') as settled_events,
  (SELECT COUNT(*) FROM public.votes) as total_votes,
  (
    SELECT ROUND((AVG(
      CASE WHEN outcome IS NOT NULL THEN
        CASE 
          WHEN outcome = TRUE AND weighted_yes > weighted_no THEN 1
          WHEN outcome = FALSE AND weighted_no > weighted_yes THEN 1
          ELSE 0
        END
      END
    ) * 100)::NUMERIC, 1)
    FROM public.events 
    WHERE status = 'settled'
  ) as platform_accuracy_pct;

COMMENT ON VIEW public.event_analytics IS 'Analytics view comparing raw vs weighted results';
COMMENT ON VIEW public.leaderboard IS 'Public leaderboard with user stats and badges';
