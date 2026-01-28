'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUpStagger, staggerContainer, springs } from '@/lib/animations';

interface Trader {
    rank: number;
    name: string;
    score: number;
    accuracy: number;
    vol: number;
}

const IdenticonSmall = ({ name }: { name: string }) => {
    const stringToColor = (str: string) => {
        const colors = ['bg-ink-400', 'bg-ink-500', 'bg-signal/80', 'bg-teal-600'];
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className={cn(
            "w-8 h-8 rounded-lg shadow-sm flex items-center justify-center text-[10px] font-bold text-white mr-3 shrink-0",
            stringToColor(name)
        )}>
            {name.substring(0, 2).toUpperCase()}
        </div>
    );
};

export function RankingList({ traders }: { traders: Trader[] }) {
    return (
        <motion.div
            className="bg-white rounded-2xl overflow-hidden border border-ink-200 shadow-organic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-ink-100 text-[10px] uppercase tracking-wider text-ink-400 font-semibold bg-ink-50">
                        <th className="p-4 w-16 text-center">Rank</th>
                        <th className="p-4">Oracle</th>
                        <th className="p-4 text-right">Trust Score</th>
                        <th className="p-4 text-center hidden sm:table-cell">Accuracy</th>
                        <th className="p-4 text-right hidden md:table-cell">Volume</th>
                    </tr>
                </thead>
                <motion.tbody
                    className="divide-y divide-ink-100"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {traders.map((trader, index) => (
                        <motion.tr
                            key={trader.rank}
                            variants={fadeUpStagger}
                            custom={index}
                            className={cn(
                                "group transition-colors cursor-pointer",
                                index % 2 === 1 ? "bg-ink-50/50" : "bg-white",
                                "hover:bg-signal/5"
                            )}
                            whileHover={{ backgroundColor: 'rgba(0, 210, 106, 0.05)' }}
                        >
                            <td className="p-4 text-center">
                                <span className="text-ink-700 font-mono font-bold text-sm">
                                    {trader.rank}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center">
                                    <IdenticonSmall name={trader.name} />
                                    <span className="text-ink-700 font-medium text-sm group-hover:text-ink-900 transition-colors">
                                        {trader.name}
                                    </span>
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <span className={cn(
                                    "font-mono font-bold text-sm",
                                    trader.score >= 90 ? "text-signal" :
                                        trader.score >= 80 ? "text-signal/80" : "text-ink-600"
                                )}>
                                    {trader.score}
                                </span>
                            </td>
                            <td className="p-4 text-center hidden sm:table-cell">
                                <span className={cn(
                                    "text-sm font-medium px-2 py-0.5 rounded",
                                    trader.accuracy >= 90 ? "text-signal bg-signal/10" :
                                        trader.accuracy >= 75 ? "text-signal/80" : "text-ink-500"
                                )}>
                                    {trader.accuracy}%
                                </span>
                            </td>
                            <td className="p-4 text-right hidden md:table-cell">
                                <span className="text-ink-400 font-mono text-xs">
                                    {trader.vol}
                                </span>
                            </td>
                        </motion.tr>
                    ))}
                </motion.tbody>
            </table>
        </motion.div>
    );
}
