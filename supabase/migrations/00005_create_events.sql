-- Migration: 00005_create_events
-- Prediction events/questions

CREATE TYPE public.event_status AS ENUM ('draft', 'active', 'closed', 'settled', 'cancelled');

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) >= 10 AND char_length(title) <= 200),
  description TEXT,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  
  -- Timing
  deadline TIMESTAMPTZ NOT NULL,
  resolution_date TIMESTAMPTZ,
  
  -- Status
  status public.event_status NOT NULL DEFAULT 'draft',
  outcome BOOLEAN, -- NULL until settled, TRUE = Yes won, FALSE = No won
  
  -- Vote counts (denormalized for performance)
  yes_count INT NOT NULL DEFAULT 0 CHECK (yes_count >= 0),
  no_count INT NOT NULL DEFAULT 0 CHECK (no_count >= 0),
  weighted_yes FLOAT NOT NULL DEFAULT 0 CHECK (weighted_yes >= 0),
  weighted_no FLOAT NOT NULL DEFAULT 0 CHECK (weighted_no >= 0),
  
  -- Metadata
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  settled_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  settled_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Featured/pinned flag
  is_featured BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indexes for common queries
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_deadline ON public.events(deadline DESC);
CREATE INDEX idx_events_category ON public.events(category_id);
CREATE INDEX idx_events_featured ON public.events(is_featured, status, deadline DESC);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Updated_at trigger
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TABLE public.events IS 'Prediction events - binary Yes/No questions';
