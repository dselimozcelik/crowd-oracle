'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BarChart3, CheckCircle2, Lock, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { springs } from '@/lib/animations';

interface PredictionMarketCardProps {
    id: number | string;
    title: string;
    category: string;
    votes: number;
    chance: number;
    ends: string;
    isFeatured?: boolean;
    isHero?: boolean;
}

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    Crypto: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Sports: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    Economy: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    Tech: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    Science: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
};

function getCategoryStyle(category: string) {
    return categoryColors[category] || { bg: 'bg-ink-100', text: 'text-ink-600', border: 'border-ink-200' };
}

// Check if ends soon (mock check - in real app would parse date)
function isEndingSoon(ends: string): boolean {
    return ends.includes('HOUR') || ends.includes('1 DAY') || ends.includes('2 DAY');
}

// Check if trending (high vote count)
function isTrending(votes: number): boolean {
    return votes > 10000;
}

export function PredictionMarketCard({
    title,
    category,
    votes,
    chance,
    ends,
    isFeatured = false,
    isHero = false
}: PredictionMarketCardProps) {
    const [status, setStatus] = useState<'IDLE' | 'SELECTED' | 'SUBMITTED'>('IDLE');
    const [selectedOption, setSelectedOption] = useState<'YES' | 'NO' | null>(null);
    const [confidence, setConfidence] = useState(50);
    const [hasVoted, setHasVoted] = useState(false);

    const handleSelectOption = (option: 'YES' | 'NO') => {
        if (status === 'IDLE' && !hasVoted) {
            setSelectedOption(option);
            setStatus('SELECTED');
        }
    };

    const handleSubmit = () => {
        setStatus('SUBMITTED');
        setHasVoted(true);
    };

    const categoryStyle = getCategoryStyle(category);
    const endingSoon = isEndingSoon(ends);
    const trending = isTrending(votes);
    const xpImpact = Math.floor((confidence / 100) * 20);

    return (
        <motion.div
            className={cn(
                "group relative overflow-hidden bg-white border rounded-xl transition-all duration-300 flex flex-col",
                "hover:shadow-lg hover:border-signal/30 hover:-translate-y-1",
                isFeatured && "border-l-4 border-l-signal",
                endingSoon && !isFeatured && "border-l-4 border-l-amber-400",
                !isFeatured && !endingSoon && "border-ink-200",
                isHero ? "min-h-[320px]" : "min-h-[280px]"
            )}
            whileHover={{
                boxShadow: '0 12px 40px -12px rgba(0,0,0,0.12)',
            }}
            transition={springs.gentle}
        >
            {/* Header: Data & Metadata */}
            <div className="p-5 pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {/* Category Tag */}
                    <span className={cn(
                        "text-[10px] uppercase tracking-widest font-mono font-semibold px-2 py-1 rounded-md border",
                        categoryStyle.bg, categoryStyle.text, categoryStyle.border
                    )}>
                        {category}
                    </span>

                    {/* Trending Badge */}
                    {trending && (
                        <span className="text-[10px] uppercase tracking-widest font-mono font-semibold px-2 py-1 rounded-md bg-signal/10 text-signal border border-signal/20 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                        </span>
                    )}

                    {/* Ends Soon Badge */}
                    {endingSoon && (
                        <span className="text-[10px] uppercase tracking-widest font-mono font-semibold px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Ends Soon
                        </span>
                    )}
                </div>

                {/* Metadata Row */}
                <div className="flex items-center gap-4 text-[10px] font-mono text-ink-400 mb-3">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ends}
                    </span>
                    <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {votes.toLocaleString('en-US')} Forecasts
                    </span>
                </div>

                <h3 className={cn(
                    "font-semibold text-ink-900 leading-relaxed tracking-tight",
                    isHero ? "text-lg mb-4" : "text-base mb-3"
                )}>
                    {title}
                </h3>

                {/* Blind Voting Viz */}
                <div className="relative">
                    {/* The Bar */}
                    <div className="w-full h-1.5 bg-ink-100 rounded-full overflow-hidden flex mb-2 relative">
                        {hasVoted ? (
                            <>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${chance}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-yes"
                                />
                                <motion.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: `${100 - chance}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-no"
                                />
                            </>
                        ) : (
                            <div className="w-full h-full bg-ink-200" />
                        )}
                    </div>

                    {/* The Labels / Blind Mask */}
                    <div className="flex justify-between items-center text-xs font-mono h-4">
                        {hasVoted ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full flex justify-between"
                            >
                                <span className="text-yes font-medium">{chance}% YES</span>
                                <span className="text-no font-medium">{100 - chance}% NO</span>
                            </motion.div>
                        ) : (
                            <div className="w-full flex justify-center items-center gap-1.5 text-ink-400">
                                <Lock className="w-3 h-3" />
                                <span className="text-[10px] tracking-wide">VOTE TO REVEAL SENTIMENT</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Interaction Area */}
            <div className="p-5 pt-3 bg-ink-50/50 flex-1 flex flex-col justify-center border-t border-ink-100">
                <AnimatePresence mode="wait">

                    {/* STATE: IDLE */}
                    {status === 'IDLE' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-3"
                        >
                            <motion.button
                                onClick={() => handleSelectOption('YES')}
                                className="flex-1 py-2.5 border border-yes/30 rounded-lg text-yes hover:bg-yes hover:text-white transition-all duration-200 text-xs font-mono font-bold uppercase tracking-wider"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Forecast YES
                            </motion.button>
                            <motion.button
                                onClick={() => handleSelectOption('NO')}
                                className="flex-1 py-2.5 border border-no/30 rounded-lg text-no hover:bg-no hover:text-white transition-all duration-200 text-xs font-mono font-bold uppercase tracking-wider"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Forecast NO
                            </motion.button>
                        </motion.div>
                    )}

                    {/* STATE: SELECTED */}
                    {(status === 'SELECTED') && (
                        <motion.div
                            key="calibration"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            className="space-y-3"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-ink-500">
                                    Forecasting <span className={selectedOption === 'YES' ? "text-yes font-bold" : "text-no font-bold"}>{selectedOption}</span>
                                </span>
                                <button
                                    onClick={() => { setStatus('IDLE'); setSelectedOption(null); }}
                                    className="text-[10px] text-ink-400 hover:text-ink-700 transition-colors uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="flex justify-between text-[10px] font-mono text-ink-400 uppercase tracking-wider">
                                    <span>Confidence Level</span>
                                    <span className="text-ink-700">{confidence}%</span>
                                </label>
                                <input
                                    type="range"
                                    min="50"
                                    max="99"
                                    step="1"
                                    value={confidence}
                                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                                    className="w-full h-1 bg-ink-200 rounded-lg appearance-none cursor-pointer accent-signal"
                                />
                                <div className="text-[10px] text-signal font-mono text-right">
                                    Estimated Trust Impact: +{xpImpact} XP
                                </div>
                            </div>

                            <motion.button
                                onClick={handleSubmit}
                                className="w-full py-2.5 bg-signal text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                Submit Forecast
                            </motion.button>
                        </motion.div>
                    )}

                    {/* STATE: SUBMITTED */}
                    {status === 'SUBMITTED' && (
                        <motion.div
                            key="submitted"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center justify-center gap-2 py-2"
                        >
                            <div className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold tracking-wider",
                                selectedOption === 'YES'
                                    ? 'border-yes bg-yes/10 text-yes'
                                    : 'border-no bg-no/10 text-no'
                            )}>
                                <CheckCircle2 size={16} />
                                YOU PICKED: {selectedOption}
                            </div>
                            <p className="text-[10px] text-ink-400 font-mono uppercase tracking-widest">
                                Sentiment Unlocked
                            </p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </motion.div>
    );
}
