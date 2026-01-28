'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Trader {
    rank: number;
    name: string;
    score: number;
    accuracy: number;
    vol: number;
}

const IdenticonSmall = ({ name }: { name: string }) => {
    // Generate simple stable color in brand palette (Slate/Emerald/Navy)
    const stringToColor = (str: string) => {
        const colors = ['bg-slate-700', 'bg-slate-600', 'bg-emerald-900', 'bg-slate-800'];
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className={cn("w-8 h-8 rounded shadow-sm flex items-center justify-center text-[10px] font-bold text-white mr-3 shrink-0 ring-1 ring-white/5", stringToColor(name))}>
            {name.substring(0, 2).toUpperCase()}
        </div>
    );
};

export function RankingList({ traders }: { traders: Trader[] }) {
    return (
        <div className="bg-slate-900/40 rounded-3xl overflow-hidden border border-white/5 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-500 font-semibold bg-slate-950/30">
                        <th className="p-5 w-16 text-center">Rank</th>
                        <th className="p-5">Oracle</th>
                        <th className="p-5 text-right">Trust Score</th>
                        <th className="p-5 text-center hidden sm:table-cell">Accuracy</th>
                        <th className="p-5 text-right hidden md:table-cell">Volume</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                    {traders.map((trader) => (
                        <tr
                            key={trader.rank}
                            className="group hover:bg-white/[0.03] transition-colors"
                        >
                            <td className="p-5 text-center">
                                <span className="text-slate-400 font-mono font-medium text-sm group-hover:text-slate-300">
                                    {trader.rank}
                                </span>
                            </td>
                            <td className="p-5">
                                <div className="flex items-center">
                                    <IdenticonSmall name={trader.name} />
                                    <span className="text-white font-medium text-sm group-hover:text-emerald-400 transition-colors">
                                        {trader.name}
                                    </span>
                                </div>
                            </td>
                            <td className="p-5 text-right">
                                <span className="font-mono font-bold text-emerald-400 text-sm">
                                    {trader.score}
                                </span>
                            </td>
                            <td className="p-5 text-center hidden sm:table-cell">
                                <span className={cn(
                                    "text-sm font-medium",
                                    trader.accuracy >= 90 ? "text-emerald-500" :
                                        trader.accuracy >= 75 ? "text-emerald-500/80" : "text-slate-400"
                                )}>
                                    {trader.accuracy}%
                                </span>
                            </td>
                            <td className="p-5 text-right hidden md:table-cell">
                                <span className="text-slate-500 font-mono text-xs">
                                    {trader.vol}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
