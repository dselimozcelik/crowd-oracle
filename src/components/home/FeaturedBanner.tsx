'use client';

import { cn } from '@/lib/utils';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

// Static demo events
const demoEvents = [
    {
        id: 'demo-1',
        title: 'Bitcoin 2026\'da $150k olur mu?',
        yesPct: 75,
        volume: '$1.2M',
        category: { name: 'Crypto', color: 'text-amber-500' },
    },
    {
        id: 'demo-2',
        title: 'Apple katlanabilir telefon çıkarır mı?',
        yesPct: 45,
        volume: '$850K',
        category: { name: 'Tech', color: 'text-blue-500' },
    },
    {
        id: 'demo-3',
        title: 'Fenerbahçe bu sene şampiyon olur mu?',
        yesPct: 62,
        volume: '$2.1M',
        category: { name: 'Sports', color: 'text-emerald-500' },
    },
    {
        id: 'demo-4',
        title: 'Dolar kuru 40 TL\'yi geçer mi?',
        yesPct: 81,
        volume: '$3.4M',
        category: { name: 'Economy', color: 'text-violet-500' },
    },
        {
        id: 'demo-5',
        title: 'Tesla Türkiye\'ye fabrika açar mı?',
        yesPct: 32,
        volume: '$500K',
        category: { name: 'Tech', color: 'text-blue-500' },
    },
    {
        id: 'demo-6',
        title: 'AI 2026\'da Turing testini geçer mi?',
        yesPct: 78,
        volume: '$920K',
        category: { name: 'Tech', color: 'text-blue-500' },
    },
];

export function FeaturedBanner() {
    return (
        <section className="relative w-full bg-[#020617] py-20 border-t border-emerald-500/50 shadow-[0_-1px_15px_rgba(16,185,129,0.2)] overflow-hidden">
             {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/40 to-[#020617] pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <TrendingUp className="w-5 h-5 text-emerald-400" />
                            <span className="text-emerald-400 font-mono text-sm tracking-widest uppercase font-medium">Trending Markets</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight">
                            Explore Featured <span className="text-emerald-400">Predictions</span>
                        </h2>
                         <p className="text-slate-400 mt-2 max-w-xl text-lg">
                            High volume prediction markets from expert forecasters.
                        </p>
                    </div>
                     <button className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center gap-1 transition-colors">
                        View all markets <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Glass Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {demoEvents.map((event) => (
                        <div 
                            key={event.id}
                            className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 backdrop-blur-md p-6 transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/5 hover:shadow-lg hover:shadow-emerald-900/20 hover:-translate-y-1"
                        >
                            {/* Card Header: Category & Volume */}
                            <div className="flex justify-between items-start mb-4">
                                <span className={cn("text-xs font-mono font-semibold uppercase tracking-wider px-2 py-1 rounded bg-white/5", event.category.color)}>
                                    {event.category.name}
                                </span>
                                <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                                    Vol: <span className="text-slate-300">{event.volume}</span>
                                </span>
                            </div>

                            {/* Question */}
                             <h3 className="text-lg font-semibold text-white mb-6 leading-relaxed min-h-[3.5rem]">
                                {event.title}
                            </h3>
                            
                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono font-medium">
                                    <span className="text-emerald-400">YES {event.yesPct}%</span>
                                    <span className="text-rose-400">NO {100 - event.yesPct}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
                                    <div 
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000 ease-out"
                                        style={{ width: `${event.yesPct}%` }} 
                                    />
                                </div>
                            </div>

                             {/* Action Buttons */}
                             <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
                                <button className="flex-1 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all uppercase">
                                    Yes
                                </button>
                                <button className="flex-1 py-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold font-mono hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all uppercase">
                                    No
                                </button>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

