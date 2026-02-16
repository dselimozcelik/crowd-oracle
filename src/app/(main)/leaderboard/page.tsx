'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Podium } from '@/components/leaderboard/Podium';
import { RankingList } from '@/components/leaderboard/RankingList';
import { StickyUserFooter } from '@/components/leaderboard/StickyUserFooter';
import { springs, fadeUp } from '@/lib/animations';

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
    accuracy: 60 + (i * 7) % 30,
    vol: 50 + (i * 123) % 1000,
    color: ''
}));

const TIME_FRAMES = [
    { key: 'weekly', label: 'Haftalık' },
    { key: 'monthly', label: 'Aylık' },
    { key: 'all', label: 'Tüm Zamanlar' },
] as const;

export default function LeaderboardPage() {
    const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'all'>('weekly');

    return (
        <div className="min-h-screen bg-[#FAF9F7] font-sans pb-32 relative">
            {/* Decorative blur blob */}
            <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-signal/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
            <div className="fixed bottom-0 right-0 w-[300px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2 z-0" />

            {/* 1. HEADER */}
            <motion.div
                className="pt-24 pb-12 px-6 text-center max-w-6xl mx-auto relative z-10"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
            >
                <h1 className="text-4xl md:text-5xl font-display font-bold text-ink-900 tracking-tight mb-4">
                    Şöhret Galerisi
                </h1>
                <p className="text-ink-500 text-lg mb-10 max-w-2xl mx-auto">
                    <span className="text-signal font-semibold">Performans</span> ve <span className="text-signal font-semibold">Tutarlılık</span> ile sıralanan en iyi anonim kahinler.
                </p>

                {/* TIME FILTER TABS */}
                <div className="flex justify-center">
                    <div className="inline-flex bg-white p-1 rounded-full border border-ink-200 shadow-sm relative">
                        {TIME_FRAMES.map((t) => (
                            <motion.button
                                key={t.key}
                                onClick={() => setTimeFrame(t.key)}
                                className={cn(
                                    "relative px-6 py-2 rounded-full text-sm font-semibold transition-colors capitalize z-10",
                                    timeFrame === t.key
                                        ? "text-white"
                                        : "text-ink-500 hover:text-ink-700"
                                )}
                                whileTap={{ scale: 0.98 }}
                            >
                                {t.label}
                                {timeFrame === t.key && (
                                    <motion.div
                                        className="absolute inset-0 bg-signal rounded-full -z-10"
                                        layoutId="activeTimeTab"
                                        transition={springs.snappy}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="max-w-5xl mx-auto px-4 space-y-10 relative z-10">

                {/* 2. PODIUM SECTION */}
                <div className="mb-12">
                    <Podium topTraders={TOP_TRADERS} />
                </div>

                {/* 3. RANKING LIST */}
                <div>
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="h-px bg-ink-200 flex-1"></div>
                        <span className="text-ink-400 font-mono text-xs uppercase tracking-widest font-semibold">
                            Küresel Sıralamalar
                        </span>
                        <div className="h-px bg-ink-200 flex-1"></div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={timeFrame}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <RankingList traders={LIST_TRADERS} />
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>

            <StickyUserFooter />
        </div>
    );
}
