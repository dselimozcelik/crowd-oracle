'use client';

import { motion } from 'framer-motion';
import { Award, Lock, CheckCircle, Flame, Target, Trophy, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeUp, staggerContainer, fadeUpStagger, springs } from '@/lib/animations';

interface BadgeData {
    id: string;
    name: string;
    description: string;
    icon: string;
    tier: string;
    criteria_type: string;
    criteria_value: number;
}

// Tier styles
const tierStyles = {
    bronze: {
        gradient: 'from-amber-600 to-amber-800',
        ring: 'ring-amber-500/30',
        badge: 'bg-amber-600 text-white',
        glow: 'shadow-amber-500/20',
    },
    silver: {
        gradient: 'from-gray-300 to-gray-500',
        ring: 'ring-gray-400/30',
        badge: 'bg-gray-400 text-white',
        glow: 'shadow-gray-400/20',
    },
    gold: {
        gradient: 'from-yellow-400 to-amber-500',
        ring: 'ring-yellow-500/30',
        badge: 'bg-yellow-500 text-yellow-900',
        glow: 'shadow-yellow-500/20',
    },
    platinum: {
        gradient: 'from-violet-400 to-indigo-500',
        ring: 'ring-violet-400/30',
        badge: 'bg-violet-500 text-white',
        glow: 'shadow-violet-500/20',
    },
};

// Category icons
const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
    first_vote: Target,
    votes: Trophy,
    streak: Flame,
    accuracy: Target,
    rank: Crown,
};

const typeLabels: Record<string, string> = {
    first_vote: 'Getting Started',
    votes: 'Prediction Milestones',
    streak: 'Streak Achievements',
    accuracy: 'Accuracy Badges',
    rank: 'Ranking Achievements',
};

// Custom badge medallion icon
function BadgeMedallion({ icon, tier, isLocked }: { icon: string; tier: string; isLocked: boolean }) {
    const styles = tierStyles[tier as keyof typeof tierStyles] || tierStyles.bronze;

    return (
        <div className={cn(
            "relative w-16 h-16 rounded-full flex items-center justify-center ring-2 transition-all",
            isLocked
                ? "bg-gradient-to-br from-gray-200 to-gray-300 ring-gray-200"
                : `bg-gradient-to-br ${styles.gradient} ${styles.ring} shadow-lg ${styles.glow}`,
        )}>
            {/* Inner circle */}
            <div className={cn(
                "absolute inset-1.5 rounded-full",
                isLocked ? "bg-gray-100" : "bg-white/15"
            )} />

            {/* Icon - using custom SVG or emoji fallback */}
            <span className={cn(
                "relative z-10 text-2xl",
                isLocked ? "grayscale opacity-40" : "drop-shadow-md"
            )}>
                {icon}
            </span>

            {/* Diagonal stripes for locked */}
            {isLocked && (
                <div className="absolute inset-0 rounded-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(0,0,0,0.05)_3px,rgba(0,0,0,0.05)_6px)]" />
            )}

            {/* Shine effect for unlocked */}
            {!isLocked && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 via-transparent to-transparent" />
            )}
        </div>
    );
}

interface BadgesClientProps {
    allBadges: BadgeData[];
    earnedBadgeIds: Set<string>;
    earnedBadgeMap: Map<string, string>;
}

export function BadgesClient({ allBadges, earnedBadgeIds, earnedBadgeMap }: BadgesClientProps) {
    const badgesByType = allBadges.reduce((acc, badge) => {
        const type = badge.criteria_type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(badge);
        return acc;
    }, {} as Record<string, BadgeData[]>);

    const earnedCount = earnedBadgeIds.size;
    const totalCount = allBadges.length;

    // Find next badge to earn (first locked badge)
    const nextBadge = allBadges.find(b => !earnedBadgeIds.has(b.id));

    return (
        <div className="min-h-screen bg-[#FAF9F7] pb-16 relative">
            {/* Decorative blurs */}
            <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-signal/5 blur-[120px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4 z-0" />
            <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/4 translate-y-1/4 z-0" />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
                {/* Header */}
                <motion.div
                    className="mb-10"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                >
                    <p className="text-ink-400 font-mono text-xs uppercase tracking-widest mb-2">Achievements</p>
                    <h1 className="font-display text-4xl font-bold text-ink-900 mb-3">
                        Badges
                    </h1>
                    <p className="text-ink-500 mb-8 max-w-xl">
                        Earn badges by making predictions, building streaks, and climbing the leaderboard.
                    </p>

                    {/* Collection Progress Card */}
                    <motion.div
                        className="bg-white rounded-xl border border-ink-200 p-6 shadow-organic"
                        whileHover={{ boxShadow: '0 8px 30px -12px rgba(0,0,0,0.12)' }}
                        transition={springs.gentle}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-signal/10 flex items-center justify-center">
                                    <Award className="w-6 h-6 text-signal" />
                                </div>
                                <div>
                                    <p className="font-semibold text-ink-900 text-lg">Collection Progress</p>
                                    <p className="text-sm text-ink-500">{earnedCount} of {totalCount} badges earned</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 flex-1 max-w-md">
                                {/* Badge silhouettes */}
                                <div className="hidden sm:flex items-center gap-1">
                                    {allBadges.slice(0, 8).map((badge, i) => (
                                        <div
                                            key={badge.id}
                                            className={cn(
                                                "w-6 h-6 rounded-full",
                                                earnedBadgeIds.has(badge.id)
                                                    ? "bg-gradient-to-br from-signal to-teal-600"
                                                    : "bg-ink-100"
                                            )}
                                        />
                                    ))}
                                    {totalCount > 8 && (
                                        <span className="text-xs text-ink-400 ml-1">+{totalCount - 8}</span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between text-xs text-ink-400 mb-1">
                                        <span>{earnedCount} earned</span>
                                        <span>{Math.round((earnedCount / (totalCount || 1)) * 100)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-signal rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%` }}
                                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Next Badge to Earn */}
                {nextBadge && (
                    <motion.div
                        className="mb-10"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="w-4 h-4 text-ink-400" />
                            <h2 className="font-semibold text-ink-600 text-sm uppercase tracking-wide">
                                Up Next
                            </h2>
                        </div>
                        <motion.div
                            className="bg-white rounded-xl border border-ink-200 p-5 shadow-organic flex items-center gap-5"
                            whileHover={{ y: -2, boxShadow: '0 12px 40px -12px rgba(0,0,0,0.12)' }}
                            transition={springs.gentle}
                        >
                            <BadgeMedallion icon={nextBadge.icon} tier={nextBadge.tier} isLocked={true} />
                            <div className="flex-1">
                                <h3 className="font-semibold text-ink-900">{nextBadge.name}</h3>
                                <p className="text-sm text-ink-500">{nextBadge.description}</p>
                            </div>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                tierStyles[nextBadge.tier as keyof typeof tierStyles]?.badge || "bg-amber-600 text-white"
                            )}>
                                {nextBadge.tier}
                            </span>
                        </motion.div>
                    </motion.div>
                )}

                {/* Badge Categories */}
                <motion.div
                    className="space-y-12"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {Object.entries(badgesByType).map(([type, badges], categoryIndex) => {
                        const CategoryIcon = categoryIcons[type] || Trophy;
                        const earnedInCategory = badges.filter(b => earnedBadgeIds.has(b.id)).length;

                        return (
                            <motion.div
                                key={type}
                                variants={fadeUpStagger}
                                custom={categoryIndex}
                            >
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-5">
                                    <CategoryIcon className="w-5 h-5 text-ink-400" />
                                    <h2 className="font-semibold text-ink-900 text-lg">
                                        {typeLabels[type] || type}
                                    </h2>
                                    <span className="px-2 py-0.5 rounded-full bg-ink-100 text-xs font-mono text-ink-500">
                                        {earnedInCategory}/{badges.length}
                                    </span>
                                    <div className="flex-1 h-px bg-ink-100 ml-2" />
                                </div>

                                {/* Badge Grid */}
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {badges.map((badge, index) => {
                                        const isEarned = earnedBadgeIds.has(badge.id);
                                        const earnedAt = earnedBadgeMap.get(badge.id);
                                        const styles = tierStyles[badge.tier as keyof typeof tierStyles] || tierStyles.bronze;

                                        return (
                                            <motion.div
                                                key={badge.id}
                                                className={cn(
                                                    "bg-white rounded-xl border p-5 text-center transition-all relative group",
                                                    isEarned
                                                        ? "border-ink-200 shadow-organic"
                                                        : "border-ink-100"
                                                )}
                                                whileHover={isEarned ? {
                                                    y: -4,
                                                    boxShadow: '0 16px 40px -12px rgba(0,0,0,0.15)'
                                                } : {
                                                    scale: 1.02
                                                }}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                {/* Tier ribbon for earned badges */}
                                                {isEarned && (
                                                    <span className={cn(
                                                        "absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm",
                                                        styles.badge
                                                    )}>
                                                        {badge.tier}
                                                    </span>
                                                )}

                                                <div className="flex justify-center mb-4">
                                                    <BadgeMedallion
                                                        icon={badge.icon}
                                                        tier={badge.tier}
                                                        isLocked={!isEarned}
                                                    />
                                                </div>

                                                <h3 className={cn(
                                                    "font-semibold text-sm mb-1",
                                                    isEarned ? "text-ink-900" : "text-ink-400"
                                                )}>
                                                    {badge.name}
                                                </h3>
                                                <p className={cn(
                                                    "text-xs leading-relaxed mb-3",
                                                    isEarned ? "text-ink-500" : "text-ink-300"
                                                )}>
                                                    {badge.description}
                                                </p>

                                                <div className="pt-3 border-t border-ink-100">
                                                    {isEarned ? (
                                                        <div className="flex items-center justify-center gap-1.5 text-xs text-signal font-medium">
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            <span>
                                                                {earnedAt && new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-1.5 text-xs text-ink-300">
                                                            <Lock className="w-3.5 h-3.5" />
                                                            <span>Locked</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}
