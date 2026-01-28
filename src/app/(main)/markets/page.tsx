'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { MarketTicker } from '@/components/markets/MarketTicker';
import { PredictionMarketCard } from '@/components/markets/PredictionMarketCard';

// Rich Mock Data (12 Items)
const MOCK_MARKETS = [
    // CRYPTO
    { id: 1, title: "Will Bitcoin hit $100k before Q1 2026?", category: "Crypto", votes: 15420, chance: 65, ends: "Dec 31, 2025" },
    { id: 2, title: "Ethereum ETF Approval by SEC in May?", category: "Crypto", votes: 8100, chance: 32, ends: "May 15, 2025" },
    { id: 3, title: "Solana to flip BNB market cap in 2025?", category: "Crypto", votes: 4500, chance: 48, ends: "Dec 2025" },

    // SPORTS
    { id: 4, title: "Fenerbahçe to win the 2025 Super Lig?", category: "Sports", votes: 8932, chance: 42, ends: "May 20, 2025" },
    { id: 5, title: "Real Madrid to win Champions League?", category: "Sports", votes: 12400, chance: 28, ends: "Jun 01, 2025" },
    { id: 6, title: "Max Verstappen to win Monaco GP?", category: "Sports", votes: 3200, chance: 75, ends: "May 26, 2025" },

    // ECONOMY
    { id: 7, title: "Fed Interest Rate Cut in March?", category: "Economy", votes: 32400, chance: 55, ends: "Mar 20, 2025" },
    { id: 8, title: "US Inflation (CPI) below 2.5% in Feb?", category: "Economy", votes: 9800, chance: 60, ends: "Feb 14, 2025" },
    { id: 9, title: "Oil Prices to exceed $90/barrel?", category: "Economy", votes: 6100, chance: 22, ends: "Apr 01, 2025" },

    // TECH / SCIENCE
    { id: 10, title: "GPT-5 Release Date before June 2025?", category: "Tech", votes: 21050, chance: 35, ends: "Jun 30, 2025" },
    { id: 11, title: "SpaceX Starship orbital success in Feb?", category: "Science", votes: 5210, chance: 88, ends: "Feb 28, 2025" },
    { id: 12, title: "Apple to announce foldable iPhone?", category: "Tech", votes: 14500, chance: 15, ends: "Sep 2025" },
];

const CATEGORIES = ['All Markets', 'Crypto', 'Sports', 'Economy', 'Tech', 'Science'];

export default function MarketsPage() {
    const [selectedCategory, setSelectedCategory] = useState('All Markets');

    const filteredMarkets = selectedCategory === 'All Markets'
        ? MOCK_MARKETS
        : MOCK_MARKETS.filter(m => m.category === (selectedCategory === 'Economy' ? 'Economy' : selectedCategory));

    return (
        // FIX: Using min-h-[100dvh] for Safari mobile support
        // FIX: pt-0 because MainLayout already provides the pt-16 header offset
        <div className="min-h-[100dvh] flex flex-col bg-[#020617] pt-0 gap-0">

            {/* 1. LAYER 1: TICKER TAPE */}
            <div className="w-full">
                <MarketTicker />
            </div>

            {/* 2. LAYER 2: WHITE CONTROL HEADER */}
            {/* Zero Top Margin to ensure it touches the Ticker */}
            <section className="bg-white border-b border-slate-200 pb-10 pt-6 px-4 md:px-8 relative z-30 shadow-sm mt-0">
                <div className="max-w-7xl mx-auto">

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <p className="text-slate-500 font-mono text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                Crowd Intelligence
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-sans">
                                Prediction Markets
                            </h1>
                            <p className="text-slate-500 mt-2 max-w-2xl text-base">
                                Crowdsourced probability data on future events.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search ticker or event..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                        {CATEGORIES.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedCategory(tab)}
                                className={`
                  px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all uppercase tracking-wide font-mono
                  ${selectedCategory === tab
                                        ? 'bg-[#020617] text-white shadow-lg shadow-slate-900/20'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}
                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                </div>
            </section>

            {/* 3. LAYER 3: DEEP OCEAN GRID */}
            <section className="flex-1 bg-[#020617] py-16 px-4 md:px-8 border-t border-slate-900 relative overflow-hidden">
                {/* Ambient Glows */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto z-10 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredMarkets.length > 0 ? (
                            filteredMarkets.map((market) => (
                                <PredictionMarketCard
                                    key={market.id}
                                    {...market}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-slate-500 font-mono">
                                No markets found for category: {selectedCategory}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
