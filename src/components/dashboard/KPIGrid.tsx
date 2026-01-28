'use client';

import { TrendingUp, Activity, Trophy } from 'lucide-react';

interface KPIGridProps {
    stats: {
        trustScore: number;
        accuracy: number;
        volume: number;
        specialty: string;
    };
}

export function KPIGrid({ stats }: KPIGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* 1. TRUST SCORE */}
            <MetricCard label="Trust Score" subtext="Reliability Rating">
                <div className="relative flex items-center justify-center">
                    {/* Simple Ring Visualization */}
                    <svg className="w-24 h-24 transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                        <circle cx="48" cy="48" r="40" className="stroke-slate-800 fill-none stroke-[6px]" />
                        <circle
                            cx="48" cy="48" r="40"
                            className="stroke-emerald-500 fill-none stroke-[6px] transition-all duration-1000 ease-out"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (251.2 * stats.trustScore) / 100}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-mono font-bold text-white tracking-tighter">{stats.trustScore}</span>
                    </div>
                </div>
            </MetricCard>

            {/* 2. ACCURACY */}
            <MetricCard label="Accuracy" subtext="Correct Predictions">
                <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl font-mono font-bold text-emerald-400 tracking-tighter shadow-emerald-500/20 drop-shadow-sm">{stats.accuracy}%</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-bold uppercase tracking-wide">
                        <TrendingUp className="w-3 h-3" />
                        <span>Top 15%</span>
                    </div>
                </div>
            </MetricCard>

            {/* 3. VOLUME */}
            <MetricCard label="Total Volume" subtext="Lifetime Predictions">
                <div className="flex flex-col items-center">
                    <span className="text-4xl font-mono font-bold text-white tracking-tighter">{stats.volume.toLocaleString()}</span>
                    <Activity className="w-8 h-8 text-slate-700 mt-2" />
                </div>
            </MetricCard>

            {/* 4. SPECIALTY */}
            <MetricCard label="Strongest Field" subtext="Highest Win Rate">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                        <Trophy className="w-6 h-6 text-indigo-400" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">{stats.specialty}</span>
                </div>
            </MetricCard>

        </div>
    );
}

function MetricCard({ label, children, subtext }: { label: string, children: React.ReactNode, subtext: string }) {
    return (
        <div className="
            bg-gradient-to-b from-slate-800/40 to-slate-950/40 backdrop-blur-md 
            border border-white/5 border-t-white/10 shadow-lg shadow-black/40
            rounded-xl p-6
            flex flex-col items-center justify-center
            hover:border-emerald-500/20 transition-all duration-300
            min-h-[200px] group
        ">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-6 group-hover:text-slate-400 transition-colors">{label}</span>
            <div className="flex-1 flex items-center justify-center w-full">
                {children}
            </div>
            <span className="text-[10px] text-slate-600 mt-6 font-mono uppercase tracking-wide">{subtext}</span>
        </div>
    );
}
