'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Crown } from 'lucide-react';

interface Trader {
    rank: number;
    name: string;
    score: number;
    accuracy: number;
    vol: number;
    color: string;
}

const Identicon = ({ name, size = 64, className }: { name: string, size?: number, className?: string }) => {
    // Deterministic geometric pattern
    return (
        <div
            className={cn("rounded-full overflow-hidden relative flex items-center justify-center font-bold shadow-lg", className)}
            style={{
                width: size,
                height: size,
                background: `linear-gradient(135deg, ${stringToColor(name)} 0%, ${stringToColor(name + 'sec')} 100%)`
            }}
        >
            <span className="text-white drop-shadow-md text-[40%] uppercase">{name.substring(0, 2)}</span>
            <svg className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay" viewBox="0 0 100 100">
                <rect x="0" y="0" width="100" height="100" fill="transparent" />
                <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
                <path d="M0,100 L100,0" stroke="white" strokeWidth="2" opacity="0.3" />
            </svg>
        </div>
    );
};

// Helper: Generate consistent color from string (Restricted to Brand/Neutral tones + Emerald)
const stringToColor = (str: string) => {
    const colors = ['#1e293b', '#334155', '#475569', '#059669', '#047857', '#0f172a'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

export function Podium({ topTraders }: { topTraders: Trader[] }) {
    const sorted = [...topTraders].sort((a, b) => a.rank - b.rank);
    const [first, second, third] = [sorted[0], sorted[1], sorted[2]];

    return (
        <div className="grid grid-cols-3 gap-6 items-end mb-4 px-2">

            {/* RANK 2 - LEFT (Independent Navy Card) */}
            {second && (
                <div className="bg-[#020617] rounded-[2rem] p-6 flex flex-col items-center shadow-2xl shadow-slate-300/50 border border-white/10">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 mb-2 p-1">
                        <Identicon name={second.name} size={48} className="w-full h-full" />
                    </div>
                    <div className="text-slate-400 font-mono text-xs mb-0.5">#2</div>
                    <div className="text-white font-bold text-sm truncate max-w-[100px]">{second.name}</div>
                    <div className="text-slate-400 font-mono mt-1 text-xs">{second.score}</div>
                </div>
            )}

            {/* RANK 1 - CENTER (Hero Navy Card) */}
            {first && (
                <div className="bg-[#020617] rounded-[2rem] p-8 flex flex-col items-center shadow-[0_20px_50px_-10px_rgba(16,185,129,0.4)] border-2 border-emerald-500 relative z-10 -top-6">
                    <div className="absolute -top-5">
                        <Crown size={32} className="text-emerald-400 fill-emerald-500/20" />
                    </div>

                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-900 p-0.5 mb-2">
                        <Identicon name={first.name} size={60} className="w-full h-full border-2 border-slate-900" />
                    </div>

                    <div className="text-emerald-400 font-mono font-bold text-xs mb-0.5">#1</div>
                    <div className="text-white text-base font-bold tracking-wide truncate max-w-[120px]">{first.name}</div>
                    <div className="text-2xl font-mono text-white mt-1 font-bold tracking-tighter">{first.score}</div>
                </div>
            )}

            {/* RANK 3 - RIGHT (Independent Navy Card) */}
            {third && (
                <div className="bg-[#020617] rounded-[2rem] p-6 flex flex-col items-center shadow-2xl shadow-slate-300/50 border border-white/10">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 mb-2 p-1">
                        <Identicon name={third.name} size={48} className="w-full h-full" />
                    </div>
                    <div className="text-slate-400 font-mono text-xs mb-0.5">#3</div>
                    <div className="text-white font-bold text-sm truncate max-w-[100px]">{third.name}</div>
                    <div className="text-slate-400 font-mono mt-1 text-xs">{third.score}</div>
                </div>
            )}

        </div>
    );
}
