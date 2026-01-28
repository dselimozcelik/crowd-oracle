-- Migration: 00002_create_user_demographics
-- Stores optional demographic data for B2B analytics

CREATE TABLE public.user_demographics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  age_range TEXT CHECK (age_range IN ('18-24', '25-34', '35-44', '45-54', '55-64', '65+')),
  country TEXT, -- ISO 3166-1 alpha-2 code
  city TEXT,
  job_sector TEXT CHECK (job_sector IN (
    'technology', 'finance', 'healthcare', 'education', 'retail',
    'manufacturing', 'government', 'media', 'legal', 'consulting',
    'real_estate', 'energy', 'agriculture', 'transportation', 'hospitality', 'other'
  )),
  education_level TEXT CHECK (education_level IN (
    'high_school', 'some_college', 'bachelors', 'masters', 'phd', 'other'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Indexes for B2B queries
CREATE INDEX idx_demographics_age ON public.user_demographics(age_range);
CREATE INDEX idx_demographics_country ON public.user_demographics(country);
CREATE INDEX idx_demographics_sector ON public.user_demographics(job_sector);

-- Enable RLS
ALTER TABLE public.user_demographics ENABLE ROW LEVEL SECURITY;

-- Updated_at trigger
CREATE TRIGGER user_demographics_updated_at
  BEFORE UPDATE ON public.user_demographics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TABLE public.user_demographics IS 'User demographic data for B2B analytics segmentation';
