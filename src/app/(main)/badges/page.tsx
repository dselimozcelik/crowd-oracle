import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Award, Lock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeData {
    id: string;
    name: string;
    description: string;
    icon: string;
    tier: string;
    criteria_type: string;
    criteria_value: number;
}

interface UserBadgeData {
    badge_id: string;
    earned_at: string;
}

const tierStyles = {
    bronze: {
        border: 'border-amber-600',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
    },
    silver: {
        border: 'border-ink-400',
        bg: 'bg-ink-50',
        text: 'text-ink-600',
    },
    gold: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
    },
    platinum: {
        border: 'border-violet-500',
        bg: 'bg-violet-50',
        text: 'text-violet-700',
    },
};

export default async function BadgesPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: badgesData } = await (supabase
        .from('badges') as any)
        .select('*')
        .order('tier')
        .order('criteria_value');

    const allBadges = badgesData as BadgeData[] | null;

    const { data: userBadgesData } = await (supabase
        .from('user_badges') as any)
        .select('badge_id, earned_at')
        .eq('user_id', user.id);

    const userBadges = userBadgesData as UserBadgeData[] | null;

    const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);
    const earnedBadgeMap = new Map(userBadges?.map(ub => [ub.badge_id, ub.earned_at]) || []);

    const badgesByType = allBadges?.reduce((acc, badge) => {
        const type = badge.criteria_type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(badge);
        return acc;
    }, {} as Record<string, BadgeData[]>) || {};

    const typeLabels: Record<string, string> = {
        first_vote: 'Getting Started',
        votes: 'Prediction Milestones',
        streak: 'Streak Achievements',
        accuracy: 'Accuracy Badges',
        rank: 'Ranking Achievements',
    };

    const earnedCount = earnedBadgeIds.size;
    const totalCount = allBadges?.length || 0;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <p className="data-label text-ink-400 mb-2">Achievements</p>
                <h1 className="font-display text-3xl headline mb-2">Badges</h1>
                <p className="text-ink-500 mb-6">
                    Earn badges by making predictions, building streaks, and climbing the leaderboard.
                </p>

                {/* Progress */}
                <div className="card-sharp bg-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Award className="w-5 h-5 text-ink-400" />
                        <div>
                            <p className="font-medium">Collection Progress</p>
                            <p className="text-sm text-ink-500">{earnedCount} of {totalCount} badges earned</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-ink-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-signal rounded-full"
                                style={{ width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%` }}
                            />
                        </div>
                        <span className="data-value text-sm text-ink-600">
                            {Math.round((earnedCount / (totalCount || 1)) * 100)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Badge Categories */}
            <div className="space-y-10">
                {Object.entries(badgesByType).map(([type, badges]) => (
                    <div key={type}>
                        <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
                            {typeLabels[type] || type}
                            <span className="data-value text-sm text-ink-400">
                                {badges?.filter(b => earnedBadgeIds.has(b.id)).length}/{badges?.length}
                            </span>
                        </h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {badges?.map((badge) => {
                                const isEarned = earnedBadgeIds.has(badge.id);
                                const earnedAt = earnedBadgeMap.get(badge.id);
                                const styles = tierStyles[badge.tier as keyof typeof tierStyles] || tierStyles.bronze;

                                return (
                                    <div
                                        key={badge.id}
                                        className={cn(
                                            "card-sharp bg-white p-4 text-center",
                                            !isEarned && "opacity-50"
                                        )}
                                    >
                                        <div className="text-3xl mb-3">{badge.icon}</div>
                                        <h3 className="font-medium text-sm mb-1">{badge.name}</h3>
                                        <p className="text-xs text-ink-500 mb-3 leading-relaxed">
                                            {badge.description}
                                        </p>
                                        <span className={cn(
                                            "tag capitalize",
                                            styles.border,
                                            styles.bg,
                                            styles.text
                                        )}>
                                            {badge.tier}
                                        </span>
                                        <div className="mt-3 pt-3 border-t border-ink-100">
                                            {isEarned ? (
                                                <div className="flex items-center justify-center gap-1.5 text-xs text-yes">
                                                    <CheckCircle className="w-3 h-3" />
                                                    <span>
                                                        {earnedAt && new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1.5 text-xs text-ink-400">
                                                    <Lock className="w-3 h-3" />
                                                    <span>Locked</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
