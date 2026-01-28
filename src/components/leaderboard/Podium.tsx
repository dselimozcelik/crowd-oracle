'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Crown } from 'lucide-react';
import { springs, fadeUp } from '@/lib/animations';

interface Trader {
    rank: number;
    name: string;
    score: number;
    accuracy: number;
    vol: number;
    color: string;
}

const Identicon = ({ name, size = 64, className, ringColor = 'ring-ink-200' }: {
    name: string;
    size?: number;
    className?: string;
    ringColor?: string;
}) => {
    return (
        <div
            className={cn(
                "rounded-full overflow-hidden relative flex items-center justify-center font-bold shadow-lg ring-2",
                ringColor,
                className
            )}
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

// Helper: Generate consistent color from string
const stringToColor = (str: string) => {
    const colors = ['#6B7280', '#4B5563', '#374151', '#059669', '#047857', '#1F2937'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

export function Podium({ topTraders }: { topTraders: Trader[] }) {
    const sorted = [...topTraders].sort((a, b) => a.rank - b.rank);
    const [first, second, third] = [sorted[0], sorted[1], sorted[2]];

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        })
    };

    return (
        <div className="grid grid-cols-3 gap-4 md:gap-6 items-end mb-4 px-2">

            {/* RANK 2 - LEFT (Silver) */}
            {second && (
                <motion.div
                    className="bg-white rounded-2xl p-5 md:p-6 flex flex-col items-center shadow-organic border border-ink-200 hover:border-ink-300 transition-all"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    whileHover={{ y: -4, boxShadow: '0 12px 40px -12px rgba(0,0,0,0.12)' }}
                    transition={springs.gentle}
                >
                    <Identicon name={second.name} size={48} ringColor="ring-gray-300" />
                    <div className="text-gray-400 font-mono text-xs mt-3 mb-0.5">#2</div>
                    <div className="text-ink-900 font-bold text-sm truncate max-w-[100px]">{second.name}</div>
                    <div className="text-ink-500 font-mono mt-1 text-sm font-semibold">{second.score}</div>
                </motion.div>
            )}

            {/* RANK 1 - CENTER (Gold - Hero) */}
            {first && (
                <motion.div
                    className="bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center shadow-lg border-2 border-amber-300 relative -top-4 md:-top-6"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    whileHover={{ y: -6, boxShadow: '0 20px 50px -15px rgba(212,168,75,0.25)' }}
                    transition={springs.gentle}
                    style={{ boxShadow: '0 12px 40px -12px rgba(212,168,75,0.2)' }}
                >
                    <motion.div
                        className="absolute -top-5"
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 15 }}
                    >
                        <Crown size={28} className="text-amber-500 fill-amber-100" />
                    </motion.div>

                    <Identicon name={first.name} size={56} ringColor="ring-amber-300" />

                    <div className="text-amber-600 font-mono font-bold text-xs mt-3 mb-0.5">#1</div>
                    <div className="text-ink-900 text-base font-bold tracking-wide truncate max-w-[120px]">{first.name}</div>
                    <div className="text-2xl font-mono text-signal mt-1 font-bold tracking-tighter">{first.score}</div>
                </motion.div>
            )}

            {/* RANK 3 - RIGHT (Bronze) */}
            {third && (
                <motion.div
                    className="bg-white rounded-2xl p-5 md:p-6 flex flex-col items-center shadow-organic border border-ink-200 hover:border-ink-300 transition-all"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    whileHover={{ y: -4, boxShadow: '0 12px 40px -12px rgba(0,0,0,0.12)' }}
                    transition={springs.gentle}
                >
                    <Identicon name={third.name} size={48} ringColor="ring-amber-600/50" />
                    <div className="text-amber-700/70 font-mono text-xs mt-3 mb-0.5">#3</div>
                    <div className="text-ink-900 font-bold text-sm truncate max-w-[100px]">{third.name}</div>
                    <div className="text-ink-500 font-mono mt-1 text-sm font-semibold">{third.score}</div>
                </motion.div>
            )}

        </div>
    );
}
