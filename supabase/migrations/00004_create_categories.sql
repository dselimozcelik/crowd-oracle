-- Migration: 00004_create_categories
-- Event categories for organization

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  description TEXT,
  icon TEXT NOT NULL DEFAULT '📊',
  color TEXT NOT NULL DEFAULT 'slate', -- Tailwind color name
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for ordered listing
CREATE INDEX idx_categories_order ON public.categories(display_order ASC, name ASC);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Seed default categories
INSERT INTO public.categories (name, slug, description, icon, color, display_order) VALUES
  ('Politics', 'politics', 'Elections, legislation, and governance', '🏛️', 'blue', 1),
  ('Technology', 'technology', 'Tech industry, product launches, AI', '💻', 'violet', 2),
  ('Sports', 'sports', 'Sports events, championships, transfers', '⚽', 'green', 3),
  ('Finance', 'finance', 'Markets, stocks, crypto, economy', '📈', 'amber', 4),
  ('Entertainment', 'entertainment', 'Movies, music, celebrities', '🎬', 'pink', 5),
  ('Science', 'science', 'Scientific discoveries and research', '🔬', 'cyan', 6),
  ('World Events', 'world-events', 'Global news and international affairs', '🌍', 'orange', 7);

COMMENT ON TABLE public.categories IS 'Event categories for organization and filtering';
