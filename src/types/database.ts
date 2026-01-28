// Database type definitions for CrowdOracle
// These types mirror the Supabase schema

export type EventStatus = 'draft' | 'active' | 'closed' | 'settled' | 'cancelled';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';
export type JobSector = 
  | 'technology' | 'finance' | 'healthcare' | 'education' | 'retail'
  | 'manufacturing' | 'government' | 'media' | 'legal' | 'consulting'
  | 'real_estate' | 'energy' | 'agriculture' | 'transportation' | 'hospitality' | 'other';
export type EducationLevel = 'high_school' | 'some_college' | 'bachelors' | 'masters' | 'phd' | 'other';

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  trust_score: number;
  is_admin: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserDemographics {
  id: string;
  user_id: string;
  age_range: AgeRange | null;
  country: string | null;
  city: string | null;
  job_sector: JobSector | null;
  education_level: EducationLevel | null;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  user_id: string;
  total_predictions: number;
  correct_predictions: number;
  current_streak: number;
  best_streak: number;
  weighted_accuracy: number;
  rank: number | null;
  last_prediction_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  deadline: string;
  resolution_date: string | null;
  status: EventStatus;
  outcome: boolean | null;
  yes_count: number;
  no_count: number;
  weighted_yes: number;
  weighted_no: number;
  created_by: string | null;
  settled_by: string | null;
  settled_at: string | null;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  // Joined data
  category?: Category;
}

export interface Vote {
  id: string;
  user_id: string;
  event_id: string;
  prediction: boolean;
  trust_score_at_vote: number;
  confidence_level: ConfidenceLevel;
  is_correct: boolean | null;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  criteria_type: 'streak' | 'accuracy' | 'votes' | 'rank' | 'first_vote' | 'category_expert';
  criteria_value: number;
  category_id: string | null;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

// View types
export interface EventAnalytics {
  id: string;
  title: string;
  status: EventStatus;
  outcome: boolean | null;
  category_name: string;
  category_slug: string;
  deadline: string;
  settled_at: string | null;
  yes_count: number;
  no_count: number;
  total_votes: number;
  raw_yes_pct: number;
  raw_no_pct: number;
  weighted_yes: number;
  weighted_no: number;
  weighted_yes_pct: number;
  weighted_no_pct: number;
  weighted_prediction_correct: boolean | null;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  trust_score: number;
  total_predictions: number;
  correct_predictions: number;
  current_streak: number;
  best_streak: number;
  weighted_accuracy: number;
  rank: number | null;
  accuracy_pct: number | null;
  badge_count: number;
}

export interface PlatformStats {
  total_users: number;
  active_events: number;
  settled_events: number;
  total_votes: number;
  platform_accuracy_pct: number | null;
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      user_demographics: {
        Row: UserDemographics;
        Insert: Partial<UserDemographics> & { user_id: string };
        Update: Partial<UserDemographics>;
      };
      user_stats: {
        Row: UserStats;
        Insert: Partial<UserStats> & { user_id: string };
        Update: Partial<UserStats>;
      };
      categories: {
        Row: Category;
        Insert: Partial<Category>;
        Update: Partial<Category>;
      };
      events: {
        Row: Event;
        Insert: Partial<Event> & { title: string; category_id: string; deadline: string };
        Update: Partial<Event>;
      };
      votes: {
        Row: Vote;
        Insert: { user_id: string; event_id: string; prediction: boolean; trust_score_at_vote: number; confidence_level?: ConfidenceLevel };
        Update: Partial<Vote>;
      };
      badges: {
        Row: Badge;
        Insert: Partial<Badge>;
        Update: Partial<Badge>;
      };
      user_badges: {
        Row: UserBadge;
        Insert: { user_id: string; badge_id: string };
        Update: Partial<UserBadge>;
      };
    };
    Views: {
      event_analytics: {
        Row: EventAnalytics;
      };
      leaderboard: {
        Row: LeaderboardEntry;
      };
      platform_stats: {
        Row: PlatformStats;
      };
    };
  };
}
