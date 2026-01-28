'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Anchor, Zap, Target, Crown } from 'lucide-react';

interface IdentityPanelProps {
    user: {
        name: string;
        username?: string;
        avatar?: string;
        rank: string; // Cadet, Analyst, Expert, Oracle
        xp: number;
        nextXp: number;
    };
}

export function IdentityPanel({ user }: IdentityPanelProps) {
    const rankConfig: Record<string, { icon: any; color: string; bg: string }> = {
        Cadet: { icon: Anchor, color: 'text-slate-400', bg: 'border-slate-500/30 bg-slate-500/10' },
        Analyst: { icon: Target, color: 'text-blue-400', bg: 'border-blue-500/30 bg-blue-500/10' },
        Expert: { icon: Zap, color: 'text-emerald-400', bg: 'border-emerald-500/30 bg-emerald-500/10' },
        Oracle: { icon: Crown, color: 'text-amber-400', bg: 'border-amber-500/30 bg-amber-500/10' },
    };

    const currentRank = rankConfig[user.rank] || rankConfig['Cadet'];
    const RankIcon = currentRank.icon;
    const progress = Math.min((user.xp / user.nextXp) * 100, 100);

    return (
        <div className="bg-gradient-to-b from-slate-800/40 to-slate-950/40 backdrop-blur-md border border-white/5 border-t-white/10 shadow-lg shadow-black/40 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">

            {/* LEFT: Identity */}
            <div className="flex items-center gap-5 w-full md:w-auto">
                <Avatar className="h-16 w-16 border-2 border-white/5 shadow-2xl ring-1 ring-white/10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-slate-900 text-slate-300 text-xl font-bold">
                        {user.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-xl font-semibold text-white tracking-tight">{user.name}</h2>
                    <p className="text-sm text-slate-400 font-medium">@{user.username || user.name.toLowerCase().replace(' ', '')}</p>
                </div>
            </div>

            {/* RIGHT: Progression */}
            <div className="flex items-center gap-6 w-full md:w-auto">
                {/* XP Bar */}
                <div className="flex-1 md:min-w-[240px]">
                    <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono uppercase tracking-wider">
                        <span>{user.xp} XP</span>
                        <span>Next: {user.rank === 'Oracle' ? 'MAX' : 'Level Up'}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Rank Badge */}
                <div className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border
                    shadow-sm backdrop-blur-sm
                    ${currentRank.bg} ${currentRank.color}
                `}>
                    <RankIcon className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-widest">{user.rank}</span>
                </div>
            </div>
        </div>
    );
}
