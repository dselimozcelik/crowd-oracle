import { cn } from '@/lib/utils';
import { TRUST_SCORE_TIERS } from '@/lib/constants';

interface TrustScoreBadgeProps {
    score: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

function getTier(score: number) {
    if (score >= TRUST_SCORE_TIERS.superforecaster.min) return { ...TRUST_SCORE_TIERS.superforecaster, key: 'superforecaster' };
    if (score >= TRUST_SCORE_TIERS.expert.min) return { ...TRUST_SCORE_TIERS.expert, key: 'expert' };
    if (score >= TRUST_SCORE_TIERS.reliable.min) return { ...TRUST_SCORE_TIERS.reliable, key: 'reliable' };
    if (score >= TRUST_SCORE_TIERS.regular.min) return { ...TRUST_SCORE_TIERS.regular, key: 'regular' };
    return { ...TRUST_SCORE_TIERS.newcomer, key: 'newcomer' };
}

const tierColors: Record<string, string> = {
    newcomer: 'bg-ink-100 text-ink-500 border-ink-200',
    regular: 'bg-blue-50 text-blue-600 border-blue-200',
    reliable: 'bg-yes-muted text-yes border-yes-dim',
    expert: 'bg-violet-50 text-violet-600 border-violet-200',
    superforecaster: 'bg-amber-dim text-amber-700 border-amber',
};

const dotColors: Record<string, string> = {
    newcomer: 'bg-ink-400',
    regular: 'bg-blue-500',
    reliable: 'bg-yes',
    expert: 'bg-violet-500',
    superforecaster: 'bg-amber',
};

export function TrustScoreBadge({ score, showLabel = false, size = 'md', className }: TrustScoreBadgeProps) {
    const tier = getTier(score);
    const percentage = Math.round(score * 100);

    const sizeClasses = {
        sm: 'text-[10px] px-1.5 py-0.5 gap-1',
        md: 'text-xs px-2 py-1 gap-1.5',
        lg: 'text-sm px-3 py-1.5 gap-2',
    };

    const dotSizes = {
        sm: 'w-1 h-1',
        md: 'w-1.5 h-1.5',
        lg: 'w-2 h-2',
    };

    return (
        <div className={cn(
            "inline-flex items-center border rounded font-mono font-medium",
            tierColors[tier.key],
            sizeClasses[size],
            className
        )}>
            <span className={cn("rounded-full", dotColors[tier.key], dotSizes[size])} />
            <span>{percentage}%</span>
            {showLabel && (
                <span className="font-normal opacity-75">{tier.label}</span>
            )}
        </div>
    );
}
