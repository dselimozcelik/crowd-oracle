-- =============================================================================
-- TEST SCRIPT: Dual Scoring System
-- Supabase SQL Editor'da çalıştır
-- =============================================================================

-- Önce migration'ı çalıştırdığından emin ol: 00011_implement_dual_scoring.sql

-- =============================================================================
-- STEP 1: Test Verileri Oluştur
-- =============================================================================

-- Test kategorisi
INSERT INTO categories (name, slug, icon, color, display_order) VALUES
('Test', 'test', '🧪', 'blue', 99)
ON CONFLICT (slug) DO NOTHING;

-- Test event oluştur (status = active)
INSERT INTO events (id, title, description, category_id, status, deadline, is_featured)
SELECT 
  '00000000-0000-0000-0000-000000000001'::UUID,
  'Test Event: Will this test pass?',
  'A test event to verify our scoring algorithm',
  id,
  'active',
  NOW() + INTERVAL '1 day',
  false
FROM categories WHERE slug = 'test'
ON CONFLICT (id) DO UPDATE SET status = 'active', deadline = NOW() + INTERVAL '1 day';

-- =============================================================================
-- STEP 2: Simüle Kullanıcı Oyları (Elle profil oluştur)
-- =============================================================================

-- NOT: Gerçek test için:
-- 1. App'a git: http://localhost:3000
-- 2. Birkaç hesap oluştur
-- 3. Test event'e oy ver

-- Manuel test için simüle oylar (profilin varsa):
/*
-- Örnek: Manuel oy ekleme (kendi user_id'ni kullan)
INSERT INTO votes (user_id, event_id, prediction, trust_score_at_vote, confidence_level)
VALUES 
  ('YOUR_USER_ID_HERE', '00000000-0000-0000-0000-000000000001', TRUE, 0.1, 'high');
*/

-- =============================================================================
-- STEP 3: Event'i Kapat ve Settle Et
-- =============================================================================

-- Önce event'i kapat
UPDATE events 
SET status = 'closed' 
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Şimdi settle et (outcome = TRUE veya FALSE)
-- Admin user_id'ni buraya yaz
/*
SELECT settle_event(
  '00000000-0000-0000-0000-000000000001'::UUID,
  TRUE,  -- outcome: TRUE = Yes kazandı, FALSE = No kazandı
  'YOUR_ADMIN_USER_ID_HERE'::UUID
);
*/

-- =============================================================================
-- STEP 4: Sonuçları Kontrol Et
-- =============================================================================

-- Profil skorlarını gör
SELECT 
  id,
  username,
  xp,
  alpha,
  beta,
  trust_score,
  ROUND((alpha / (alpha + beta))::NUMERIC, 4) as calculated_trust
FROM profiles
ORDER BY xp DESC;

-- User stats'ları gör
SELECT 
  p.username,
  us.total_predictions,
  us.correct_predictions,
  us.current_streak,
  us.best_streak,
  us.weighted_accuracy,
  us.rank
FROM user_stats us
JOIN profiles p ON p.id = us.user_id
ORDER BY us.rank ASC NULLS LAST;

-- Vote sonuçlarını gör
SELECT 
  p.username,
  v.prediction,
  v.is_correct,
  v.confidence_level,
  v.trust_score_at_vote,
  e.outcome
FROM votes v
JOIN profiles p ON p.id = v.user_id
JOIN events e ON e.id = v.event_id
WHERE e.id = '00000000-0000-0000-0000-000000000001';

-- =============================================================================
-- STEP 5: Hesaplama Fonksiyonlarını Tek Tek Test Et
-- =============================================================================

-- Difficulty hesaplama (contrarian bonus)
SELECT 
  0.3 as crowd_consensus,
  calculate_difficulty(0.3) as difficulty_when_minority,
  'Azınlıkta kalınca: 1.7x bonus' as explanation
UNION ALL
SELECT 
  0.7 as crowd_consensus,
  calculate_difficulty(0.7) as difficulty_when_majority,
  'Çoğunluktayken: 1.3x bonus' as explanation;

-- Risk multiplier hesaplama
SELECT 
  'high' as confidence,
  calculate_risk_multiplier('high', TRUE) as on_win,
  calculate_risk_multiplier('high', FALSE) as on_loss
UNION ALL
SELECT 
  'medium',
  calculate_risk_multiplier('medium', TRUE),
  calculate_risk_multiplier('medium', FALSE)
UNION ALL
SELECT 
  'low',
  calculate_risk_multiplier('low', TRUE),
  calculate_risk_multiplier('low', FALSE);

-- XP değişimi hesaplama
SELECT 
  TRUE as is_correct,
  1.5 as difficulty,
  2.0 as risk_multiplier,
  calculate_xp_change(TRUE, 1.5, 2.0, 10) as xp_gain,
  'Doğru + Azınlık + High Confidence = +30 XP' as explanation
UNION ALL
SELECT 
  FALSE,
  1.5,
  2.5,
  calculate_xp_change(FALSE, 1.5, 2.5, 10),
  'Yanlış = -1 veya 0 XP (churn önleme)';

-- Bayesian trust güncelleme
SELECT * FROM update_bayesian_trust(
  1.0,   -- starting alpha
  9.0,   -- starting beta (0.1 trust score)
  TRUE,  -- is_correct
  1.5,   -- difficulty
  2.0,   -- risk_multiplier
  0.95   -- decay_factor
);

-- =============================================================================
-- CLEANUP (Test verilerini sil)
-- =============================================================================
/*
DELETE FROM events WHERE id = '00000000-0000-0000-0000-000000000001';
DELETE FROM categories WHERE slug = 'test';
*/
