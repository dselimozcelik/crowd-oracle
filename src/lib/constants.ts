// Referandum için sabitler

export const SITE_NAME = 'Referandum';
export const SITE_DESCRIPTION = 'Kalabalığın bilgeliğiyle geleceği tahmin edin';

export const TRUST_SCORE_TIERS = {
    newcomer: { min: 0, max: 0.55, label: 'Yeni', color: 'slate' },
    regular: { min: 0.55, max: 0.65, label: 'Normal', color: 'blue' },
    reliable: { min: 0.65, max: 0.75, label: 'Güvenilir', color: 'green' },
    expert: { min: 0.75, max: 0.85, label: 'Uzman', color: 'purple' },
    superforecaster: { min: 0.85, max: 1.0, label: 'Süperkahin', color: 'amber' },
} as const;

export const CONFIDENCE_LEVELS = [
    { value: 'low', label: 'Düşük', description: 'Sadece bir tahmin' },
    { value: 'medium', label: 'Orta', description: 'Oldukça eminim' },
    { value: 'high', label: 'Yüksek', description: 'Çok eminim' },
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
    { value: 'technology', label: 'Teknoloji' },
    { value: 'finance', label: 'Finans' },
    { value: 'healthcare', label: 'Sağlık' },
    { value: 'education', label: 'Eğitim' },
    { value: 'retail', label: 'Perakende' },
    { value: 'manufacturing', label: 'İmalat' },
    { value: 'government', label: 'Kamu' },
    { value: 'media', label: 'Medya & Eğlence' },
    { value: 'legal', label: 'Hukuk' },
    { value: 'consulting', label: 'Danışmanlık' },
    { value: 'real_estate', label: 'Gayrimenkul' },
    { value: 'energy', label: 'Enerji' },
    { value: 'agriculture', label: 'Tarım' },
    { value: 'transportation', label: 'Ulaşım' },
    { value: 'hospitality', label: 'Konaklama' },
    { value: 'other', label: 'Diğer' },
] as const;

export const EDUCATION_LEVELS = [
    { value: 'high_school', label: 'Lise' },
    { value: 'some_college', label: 'Üniversite (Tamamlanmamış)' },
    { value: 'bachelors', label: 'Lisans' },
    { value: 'masters', label: 'Yüksek Lisans' },
    { value: 'phd', label: 'Doktora' },
    { value: 'other', label: 'Diğer' },
] as const;

// Rate limiting
export const VOTE_COOLDOWN_MS = 30000; // 30 seconds between votes
export const MAX_VOTES_PER_MINUTE = 10;

// Minimum predictions to appear on leaderboard
export const MIN_PREDICTIONS_FOR_RANKING = 5;
