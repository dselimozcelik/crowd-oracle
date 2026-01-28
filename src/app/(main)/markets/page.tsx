'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { MarketTicker } from '@/components/markets/MarketTicker';
import { PredictionMarketCard } from '@/components/markets/PredictionMarketCard';
import { cn } from '@/lib/utils';
import { springs, fadeUpStagger, staggerContainer, viewportOnce } from '@/lib/animations';

// Rich Mock Data (12 Items) - sorted by votes for hero selection
const MOCK_MARKETS = [
    // High activity (will be featured)
    { id: 7, title: "Fed Interest Rate Cut in March?", category: "Economy", votes: 32400, chance: 55, ends: "Mar 20, 2025", isFeatured: true },
    { id: 10, title: "GPT-5 Release Date before June 2025?", category: "Tech", votes: 21050, chance: 35, ends: "Jun 30, 2025", isFeatured: true },

    // CRYPTO
    { id: 1, title: "Will Bitcoin hit $100k before Q1 2026?", category: "Crypto", votes: 15420, chance: 65, ends: "Dec 31, 2025" },
    { id: 2, title: "Ethereum ETF Approval by SEC in May?", category: "Crypto", votes: 8100, chance: 32, ends: "May 15, 2025" },
    { id: 3, title: "Solana to flip BNB market cap in 2025?", category: "Crypto", votes: 4500, chance: 48, ends: "Dec 2025" },

    // SPORTS
    { id: 4, title: "Fenerbahçe to win the 2025 Super Lig?", category: "Sports", votes: 8932, chance: 42, ends: "May 20, 2025" },
    { id: 5, title: "Real Madrid to win Champions League?", category: "Sports", votes: 12400, chance: 28, ends: "Jun 01, 2025" },
    { id: 6, title: "Max Verstappen to win Monaco GP?", category: "Sports", votes: 3200, chance: 75, ends: "May 26, 2025" },

    // ECONOMY
    { id: 8, title: "US Inflation (CPI) below 2.5% in Feb?", category: "Economy", votes: 9800, chance: 60, ends: "Feb 14, 2025" },
    { id: 9, title: "Oil Prices to exceed $90/barrel?", category: "Economy", votes: 6100, chance: 22, ends: "Apr 01, 2025" },

    // TECH / SCIENCE
    { id: 11, title: "SpaceX Starship orbital success in Feb?", category: "Science", votes: 5210, chance: 88, ends: "Feb 28, 2025" },
    { id: 12, title: "Apple to announce foldable iPhone?", category: "Tech", votes: 14500, chance: 15, ends: "Sep 2025" },
];

const CATEGORIES = ['All Markets', 'Crypto', 'Sports', 'Economy', 'Tech', 'Science'];

export default function MarketsPage() {
    const [selectedCategory, setSelectedCategory] = useState('All Markets');

    const filteredMarkets = selectedCategory === 'All Markets'
        ? MOCK_MARKETS
        : MOCK_MARKETS.filter(m => m.category === selectedCategory);

    // Separate featured (hero) vs regular cards
    const heroMarkets = filteredMarkets.filter(m => m.isFeatured).slice(0, 2);
    const regularMarkets = filteredMarkets.filter(m => !m.isFeatured);

    return (
        <div className="min-h-[100dvh] flex flex-col bg-[#FAF9F7] pt-0 gap-0">

            {/* 1. TICKER */}
            <div className="w-full">
                <MarketTicker />
            </div>

            {/* 2. HEADER + FILTERS */}
            <section className="bg-white border-b border-ink-200 pb-8 pt-8 px-4 md:px-8 relative z-30">
                <div className="max-w-6xl mx-auto">

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <p className="text-ink-400 font-mono text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-signal rounded-full"></span>
                                Crowd Intelligence
                            </p>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-ink-900 tracking-tight">
                                Prediction Markets
                            </h1>
                            <p className="text-ink-500 mt-2 max-w-xl text-base">
                                Crowdsourced probability data on future events.
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                            <input
                                type="text"
                                placeholder="Search ticker or event..."
                                className="w-full pl-10 pr-4 py-3 bg-ink-50 border border-ink-200 rounded-lg text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-signal/30 focus:border-signal/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Filter Tabs with animated indicator */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide no-scrollbar relative">
                        {CATEGORIES.map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => setSelectedCategory(tab)}
                                className={cn(
                                    "relative px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                                    selectedCategory === tab
                                        ? "text-ink-900"
                                        : "text-ink-500 hover:text-ink-700 hover:bg-ink-50"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {tab}
                                {selectedCategory === tab && (
                                    <motion.div
                                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-signal rounded-full"
                                        layoutId="activeTab"
                                        transition={springs.snappy}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                </div>
            </section>

            {/* 3. MARKETS GRID */}
            <section className="flex-1 py-12 px-4 md:px-8 relative overflow-hidden">
                {/* Decorative blur */}
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-signal/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

                <div className="max-w-6xl mx-auto z-10 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {filteredMarkets.length > 0 ? (
                                <div className="space-y-8">

                                    {/* Hero Cards (Featured) */}
                                    {heroMarkets.length > 0 && (
                                        <motion.div
                                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                            variants={staggerContainer}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            {heroMarkets.map((market, i) => (
                                                <motion.div
                                                    key={market.id}
                                                    variants={fadeUpStagger}
                                                    custom={i}
                                                >
                                                    <PredictionMarketCard
                                                        {...market}
                                                        isHero={true}
                                                    />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {/* Regular Cards - Staggered Grid */}
                                    <motion.div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                        variants={staggerContainer}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {regularMarkets.map((market, i) => (
                                            <motion.div
                                                key={market.id}
                                                variants={fadeUpStagger}
                                                custom={i}
                                                className={cn(
                                                    // Add subtle vertical offset for rhythm
                                                    i % 3 === 1 && "md:translate-y-4",
                                                    i % 3 === 2 && "md:-translate-y-2"
                                                )}
                                            >
                                                <PredictionMarketCard {...market} />
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                </div>
                            ) : (
                                <div className="py-20 text-center text-ink-400 font-mono">
                                    No markets found for category: {selectedCategory}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
