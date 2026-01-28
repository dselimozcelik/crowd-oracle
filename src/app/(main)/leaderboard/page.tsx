'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Podium } from '@/components/leaderboard/Podium';
import { RankingList } from '@/components/leaderboard/RankingList';
import { StickyUserFooter } from '@/components/leaderboard/StickyUserFooter';

// --- MOCK DATA ---
const TOP_TRADERS = [
    { rank: 1, name: "Satoshi_Naka", score: 98.5, accuracy: 94, vol: 1250, color: "" },
    { rank: 2, name: "DeepBlue_99", score: 95.2, accuracy: 89, vol: 840, color: "" },
    { rank: 3, name: "Alpha_Cent", score: 94.8, accuracy: 91, vol: 620, color: "" },
];

const LIST_TRADERS = Array.from({ length: 25 }).map((_, i) => ({
    rank: i + 4,
    name: `Trader_${1024 + i * 17}`,
    score: parseFloat((92 - i * 0.8).toFixed(1)),
    accuracy: 60 + (i * 7) % 30, // Deterministic
    vol: 50 + (i * 123) % 1000,
    color: ''
}));

export default function LeaderboardPage() {
    const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'all'>('weekly');

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-32">

            {/* 1. HEADER (White on White) */}
            <div className="pt-20 pb-12 px-6 text-center max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Hall of Fame
                </h1>
                <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto">
                    Top anonymous oracles ranked by <span className="text-emerald-600 font-bold">Performance</span> and <span className="text-emerald-600 font-bold">Consistency</span>.
                </p>

                {/* FILTERS (Centered) */}
                <div className="flex justify-center">
                    <div className="inline-flex bg-slate-100 p-1.5 rounded-full ring-1 ring-slate-200">
                        {['weekly', 'monthly', 'all'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimeFrame(t as any)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-bold transition-all capitalize",
                                    timeFrame === t
                                        ? "bg-white text-slate-900 shadow-sm border-2 border-emerald-500"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                )}
                            >
                                {t === 'all' ? 'All Time' : t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 space-y-8"> {/* GAP BETWEEN BLOCKS */}

                {/* 2. PODIUM SECTION (No Background Container, Separate Cards) */}
                <div className="mb-16 relative z-10">
                    <Podium topTraders={TOP_TRADERS} />
                </div>

                {/* 3. RANKING LIST BLOCK (Navy Island) */}
                <div className="bg-[#020617] rounded-[2.5rem] p-6 shadow-xl overflow-hidden ring-1 ring-slate-900/5">
                    <div className="flex items-center gap-3 mb-6 px-4 pt-2">
                        <div className="h-px bg-emerald-500/20 flex-1"></div>
                        <span className="text-emerald-500/80 font-mono text-xs uppercase tracking-[0.2em] font-bold">Global Rankings</span>
                        <div className="h-px bg-emerald-500/20 flex-1"></div>
                    </div>
                    <RankingList traders={LIST_TRADERS} />
                </div>

            </div>

            <StickyUserFooter />
        </div>
    );
}
