// Constants for CrowdOracle

export const SITE_NAME = 'CrowdOracle';
export const SITE_DESCRIPTION = 'Predict the future with the wisdom of crowds';

export const TRUST_SCORE_TIERS = {
    newcomer: { min: 0, max: 0.55, label: 'Newcomer', color: 'slate' },
    regular: { min: 0.55, max: 0.65, label: 'Regular', color: 'blue' },
    reliable: { min: 0.65, max: 0.75, label: 'Reliable', color: 'green' },
    expert: { min: 0.75, max: 0.85, label: 'Expert', color: 'purple' },
    superforecaster: { min: 0.85, max: 1.0, label: 'Superforecaster', color: 'amber' },
} as const;

export const CONFIDENCE_LEVELS = [
    { value: 'low', label: 'Low', description: 'Just a guess' },
    { value: 'medium', label: 'Medium', description: 'Fairly confident' },
    { value: 'high', label: 'High', description: 'Very confident' },
] as const;

export const AGE_RANGES = [
    { value: '18-24', label: '18-24' },
    { value: '25-34', label: '25-34' },
    { value: '35-44', label: '35-44' },
    { value: '45-54', label: '45-54' },
    { value: '55-64', label: '55-64' },
    { value: '65+', label: '65+' },
] as const;

export const JOB_SECTORS = [
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'government', label: 'Government' },
    { value: 'media', label: 'Media & Entertainment' },
    { value: 'legal', label: 'Legal' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'energy', label: 'Energy' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'other', label: 'Other' },
] as const;

export const EDUCATION_LEVELS = [
    { value: 'high_school', label: 'High School' },
    { value: 'some_college', label: 'Some College' },
    { value: 'bachelors', label: "Bachelor's Degree" },
    { value: 'masters', label: "Master's Degree" },
    { value: 'phd', label: 'PhD/Doctorate' },
    { value: 'other', label: 'Other' },
] as const;

// Rate limiting
export const VOTE_COOLDOWN_MS = 30000; // 30 seconds between votes
export const MAX_VOTES_PER_MINUTE = 10;

// Minimum predictions to appear on leaderboard
export const MIN_PREDICTIONS_FOR_RANKING = 5;
