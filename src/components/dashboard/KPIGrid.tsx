'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { TrendingUp, Activity, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { springs, fadeUpStagger, staggerContainer } from '@/lib/animations';
import { useEffect, useState } from 'react';

interface KPIGridProps {
    stats: {
        trustScore: number;
        accuracy: number;
        volume: number;
        specialty: string;
    };
}

// Count-up animation hook
function useCountUp(end: number, duration: number = 1500, decimals: number = 0) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const value = easeOutQuart * end;
            setCount(decimals > 0 ? parseFloat(value.toFixed(decimals)) : Math.floor(value));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, decimals]);

    return count;
}

export function KPIGrid({ stats }: KPIGridProps) {
    const trustScore = useCountUp(stats.trustScore, 1500, 1);
    const accuracy = useCountUp(stats.accuracy, 1500, 0);
    const volume = useCountUp(stats.volume, 1500, 0);

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
        >
            {/* 1. TRUST SCORE - Slightly larger */}
            <motion.div variants={fadeUpStagger} custom={0}>
                <MetricCard label="Trust Score" subtext="Reliability Rating" featured>
                    <div className="relative flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90">
                            <circle cx="48" cy="48" r="40" className="stroke-ink-100 fill-none stroke-[6px]" />
                            <motion.circle
                                cx="48" cy="48" r="40"
                                className="stroke-signal fill-none stroke-[6px]"
                                strokeDasharray="251.2"
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 251.2 - (251.2 * stats.trustScore) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-mono font-bold text-ink-900 tracking-tighter">
                                {trustScore}
                            </span>
                        </div>
                    </div>
                </MetricCard>
            </motion.div>

            {/* 2. ACCURACY */}
            <motion.div variants={fadeUpStagger} custom={1}>
                <MetricCard label="Accuracy" subtext="Correct Predictions">
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl font-mono font-bold text-ink-900 tracking-tighter">
                            {accuracy}%
                        </span>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-signal/10 border border-signal/20 rounded-full text-[10px] text-signal font-bold uppercase tracking-wide">
                            <TrendingUp className="w-3 h-3" />
                            <span>Top 15%</span>
                        </div>
                    </div>
                </MetricCard>
            </motion.div>

            {/* 3. VOLUME */}
            <motion.div variants={fadeUpStagger} custom={2} className="md:translate-y-2">
                <MetricCard label="Total Volume" subtext="Lifetime Predictions">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-mono font-bold text-ink-900 tracking-tighter">
                            {volume.toLocaleString()}
                        </span>
                        <Activity className="w-8 h-8 text-ink-300 mt-2" />
                    </div>
                </MetricCard>
            </motion.div>

            {/* 4. SPECIALTY */}
            <motion.div variants={fadeUpStagger} custom={3}>
                <MetricCard label="Strongest Field" subtext="Highest Win Rate">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-violet-50 border border-violet-200 rounded-full flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-violet-600" />
                        </div>
                        <span className="text-xl font-bold text-ink-900 tracking-tight">{stats.specialty}</span>
                    </div>
                </MetricCard>
            </motion.div>
        </motion.div>
    );
}

function MetricCard({ label, children, subtext, featured = false }: {
    label: string;
    children: React.ReactNode;
    subtext: string;
    featured?: boolean;
}) {
    return (
        <motion.div
            className={cn(
                "bg-white border border-ink-200 rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px] group transition-all",
                featured && "border-l-4 border-l-signal"
            )}
            whileHover={{
                y: -2,
                boxShadow: '0 8px 30px -12px rgba(0,0,0,0.1)',
                borderColor: 'rgba(0, 210, 106, 0.3)'
            }}
            transition={springs.gentle}
        >
            <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-6 group-hover:text-ink-500 transition-colors">
                {label}
            </span>
            <div className="flex-1 flex items-center justify-center w-full">
                {children}
            </div>
            <span className="text-[10px] text-ink-400 mt-6 font-mono uppercase tracking-wide">{subtext}</span>
        </motion.div>
    );
}
