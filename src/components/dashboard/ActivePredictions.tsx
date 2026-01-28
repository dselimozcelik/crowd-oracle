'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Clock, Trophy, Bitcoin, TrendingUp, Cpu, Globe } from 'lucide-react';

interface Prediction {
    id: string;
    event: string;
    prediction: 'YES' | 'NO';
    consensus: number; // Percent YES
    category: string;
    deadline: string;
}

interface ActivePredictionsProps {
    predictions: Prediction[];
}

// Helper to map category to icon
const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'Sports': return Trophy;
        case 'Crypto': return Bitcoin;
        case 'Economy': return TrendingUp;
        case 'Tech': return Cpu;
        default: return Globe;
    }
};

export function ActivePredictions({ predictions }: ActivePredictionsProps) {
    return (
        <div className="bg-gradient-to-b from-slate-900/40 to-slate-950/40 backdrop-blur-md border border-white/5 border-t-white/10 rounded-xl p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.5)]"></span>
                    My Active Polls
                </h3>
            </div>

            <div className="flex flex-col">
                {/* HEADERS (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-2 text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                    <div className="col-span-5">Event</div>
                    <div className="col-span-2 text-center">My Pick</div>
                    <div className="col-span-3">Crowd Consensus</div>
                    <div className="col-span-2 text-right">Time Left</div>
                </div>

                <div className="space-y-1">
                    {predictions.map((item) => {
                        const Icon = getCategoryIcon(item.category);
                        const yesPercent = item.consensus;
                        const noPercent = 100 - item.consensus;

                        return (
                            <Link
                                key={item.id}
                                href={`/markets/${item.id}`}
                                className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/5"
                            >

                                {/* 1. EVENT INFO (Span 5) */}
                                <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-slate-800/50 text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors">
                                        <Icon size={16} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                                        {item.event}
                                    </span>
                                </div>

                                {/* 2. MY VOTE (Span 2) */}
                                <div className="col-span-6 md:col-span-2 flex flex-col md:items-center">
                                    <span className="md:hidden text-[10px] text-slate-500 uppercase tracking-wider mb-1">My Pick</span>
                                    <Badge
                                        variant="outline"
                                        className={`
                                            w-fit md:w-auto font-sans font-bold border-0 px-3 py-1
                                            ${item.prediction === 'YES'
                                                ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20'}
                                        `}
                                    >
                                        {item.prediction}
                                    </Badge>
                                </div>

                                {/* 3. CROWD CONSENSUS (Span 3) */}
                                <div className="col-span-6 md:col-span-3 px-2">
                                    {/* ROW 1: Explicit Percentages */}
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="text-sm font-bold text-emerald-400 tracking-tight">
                                            {yesPercent}% YES
                                        </span>
                                        <span className="text-sm font-bold text-rose-400 tracking-tight">
                                            {noPercent}% NO
                                        </span>
                                    </div>

                                    {/* ROW 2: The Visual Bar */}
                                    <div className="relative w-full h-2 bg-rose-500 rounded-full overflow-hidden">
                                        {/* Green Bar for YES */}
                                        <div
                                            className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${yesPercent}%` }}
                                        />
                                    </div>
                                </div>

                                {/* 4. DEADLINE (Span 2) */}
                                <div className="hidden md:flex col-span-2 justify-end text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        <span>{item.deadline}</span>
                                    </div>
                                </div>

                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
