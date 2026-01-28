'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Clock, Trophy, Bitcoin, TrendingUp, Cpu, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeUp, staggerContainer, staggerItem, springs } from '@/lib/animations';

interface Prediction {
    id: string;
    event: string;
    prediction: 'YES' | 'NO';
    consensus: number;
    category: string;
    deadline: string;
}

interface ActivePredictionsProps {
    predictions: Prediction[];
}

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
        <motion.div
            className="bg-white border border-ink-200 rounded-xl p-6 mt-6 shadow-organic"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium text-ink-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    My Active Polls
                </h3>
            </div>

            <div className="flex flex-col">
                {/* HEADERS (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-3 text-[10px] uppercase tracking-wider text-ink-400 font-medium border-b border-ink-100">
                    <div className="col-span-5">Event</div>
                    <div className="col-span-2 text-center">My Pick</div>
                    <div className="col-span-3">Crowd Consensus</div>
                    <div className="col-span-2 text-right">Time Left</div>
                </div>

                <motion.div
                    className="divide-y divide-ink-100"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {predictions.map((item, index) => {
                        const Icon = getCategoryIcon(item.category);
                        const yesPercent = item.consensus;
                        const noPercent = 100 - item.consensus;

                        return (
                            <motion.div key={item.id} variants={staggerItem}>
                                <Link
                                    href={`/markets/${item.id}`}
                                    className={cn(
                                        "group grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 transition-all duration-200",
                                        "hover:bg-ink-50",
                                        index % 2 === 1 && "bg-ink-50/50"
                                    )}
                                >
                                    {/* 1. EVENT INFO */}
                                    <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-ink-100 text-ink-500 group-hover:bg-signal/10 group-hover:text-signal transition-colors">
                                            <Icon size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-ink-700 group-hover:text-ink-900 transition-colors">
                                            {item.event}
                                        </span>
                                    </div>

                                    {/* 2. MY VOTE */}
                                    <div className="col-span-6 md:col-span-2 flex flex-col md:items-center">
                                        <span className="md:hidden text-[10px] text-ink-400 uppercase tracking-wider mb-1">My Pick</span>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "w-fit md:w-auto font-sans font-bold border px-3 py-1",
                                                item.prediction === 'YES'
                                                    ? 'bg-yes/10 text-yes border-yes/30'
                                                    : 'bg-no/10 text-no border-no/30'
                                            )}
                                        >
                                            {item.prediction}
                                        </Badge>
                                    </div>

                                    {/* 3. CROWD CONSENSUS */}
                                    <div className="col-span-6 md:col-span-3 px-2">
                                        <div className="flex justify-between items-end mb-1.5">
                                            <span className="text-xs font-semibold text-yes">
                                                {yesPercent}% YES
                                            </span>
                                            <span className="text-xs font-semibold text-no">
                                                {noPercent}% NO
                                            </span>
                                        </div>
                                        <div className="relative w-full h-1.5 bg-ink-100 rounded-full overflow-hidden">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-yes rounded-full"
                                                style={{ width: `${yesPercent}%` }}
                                            />
                                            <div
                                                className="absolute top-0 right-0 h-full bg-no rounded-full"
                                                style={{ width: `${noPercent}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* 4. DEADLINE */}
                                    <div className="hidden md:flex col-span-2 justify-end text-xs text-ink-400 group-hover:text-ink-600 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            <span>{item.deadline}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </motion.div>
    );
}
