'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Anchor, Zap, Target, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { springs, fadeUp } from '@/lib/animations';

interface IdentityPanelProps {
    user: {
        name: string;
        username?: string;
        avatar?: string;
        rank: string;
        xp: number;
        nextXp: number;
    };
}

export function IdentityPanel({ user }: IdentityPanelProps) {
    const shouldReduceMotion = useReducedMotion();

    const rankConfig: Record<string, { icon: any; color: string; bg: string }> = {
        Cadet: { icon: Anchor, color: 'text-ink-600', bg: 'bg-ink-100 border-ink-200' },
        Analyst: { icon: Target, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
        Expert: { icon: Zap, color: 'text-signal', bg: 'bg-signal/10 border-signal/20' },
        Oracle: { icon: Crown, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    };

    const currentRank = rankConfig[user.rank] || rankConfig['Cadet'];
    const RankIcon = currentRank.icon;
    const progress = Math.min((user.xp / user.nextXp) * 100, 100);

    return (
        <motion.div
            className="bg-white border border-ink-200 shadow-organic rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
        >
            {/* LEFT: Identity */}
            <div className="flex items-center gap-5 w-full md:w-auto">
                <Avatar className="h-16 w-16 border-2 border-signal/20 shadow-lg ring-2 ring-signal/10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-ink-100 text-ink-600 text-xl font-bold">
                        {user.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-xl font-semibold text-ink-900 tracking-tight">{user.name}</h2>
                    <p className="text-sm text-ink-400 font-medium">@{user.username || user.name.toLowerCase().replace(' ', '')}</p>
                </div>
            </div>

            {/* RIGHT: Progression */}
            <div className="flex items-center gap-6 w-full md:w-auto">
                {/* XP Bar */}
                <div className="flex-1 md:min-w-[240px]">
                    <div className="flex justify-between text-xs text-ink-500 mb-2 font-mono uppercase tracking-wider">
                        <span>{user.xp} XP</span>
                        <span>Next: {user.rank === 'Oracle' ? 'MAX' : 'Level Up'}</span>
                    </div>
                    <div className="h-2 w-full bg-ink-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-signal rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        />
                    </div>
                </div>

                {/* Rank Badge */}
                <motion.div
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold",
                        currentRank.bg, currentRank.color
                    )}
                    whileHover={{ scale: 1.02 }}
                    transition={springs.snappy}
                >
                    <RankIcon className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-widest">{user.rank}</span>
                </motion.div>
            </div>
        </motion.div>
    );
}
