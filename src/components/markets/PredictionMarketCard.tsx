'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BarChart3, CheckCircle2, Lock } from 'lucide-react';

interface PredictionMarketCardProps {
    id: number | string;
    title: string;
    category: string;
    votes: number;
    chance: number;
    ends: string;
}

export function PredictionMarketCard({ title, category, votes, chance, ends }: PredictionMarketCardProps) {
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

    // Calculate XP Impact (Gamification, but subtle)
    const xpImpact = Math.floor((confidence / 100) * 20);

    return (
        <div className="
            group
            relative overflow-hidden
            bg-slate-900/40 
            backdrop-blur-md 
            border border-white/5
            rounded-lg
            transition-all duration-300
            hover:border-slate-700
            flex flex-col
        ">
            {/* Header: Data & Metadata */}
            <div className="p-5 border-b border-white/5">
                <div className="flex justify-between items-start mb-3">
                    <span className="
                        text-[10px] uppercase tracking-widest font-mono font-medium text-slate-400
                    ">
                        {category} MARKET
                    </span>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ends}
                        </span>
                        <span className="flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            {votes.toLocaleString('en-US')} Forecasts
                        </span>
                    </div>
                </div>

                <h3 className="text-base font-medium text-white leading-relaxed mb-4 font-sans tracking-tight">
                    {title}
                </h3>

                {/* Blind Voting Viz: Logic */}
                <div className="relative">
                    {/* The Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex mb-2 relative">
                        {hasVoted ? (
                            <>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${chance}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-emerald-500/80"
                                />
                                <motion.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: `${100 - chance}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-rose-500/80"
                                />
                            </>
                        ) : (
                            <div className="w-full h-full bg-slate-800" />
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
                                <span className="text-emerald-400 font-medium">{chance}% YES</span>
                                <span className="text-rose-400 font-medium">{100 - chance}% NO</span>
                            </motion.div>
                        ) : (
                            <div className="w-full flex justify-center items-center gap-1.5 text-slate-500">
                                <Lock className="w-3 h-3" />
                                <span className="text-[10px] tracking-wide">VOTE TO REVEAL SENTIMENT</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Interaction Area: The Instrument */}
            <div className="p-5 bg-slate-950/30 flex-1 flex flex-col justify-center min-h-[140px]">
                <AnimatePresence mode="wait">

                    {/* STATE: IDLE */}
                    {status === 'IDLE' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-4"
                        >
                            <button
                                onClick={() => handleSelectOption('YES')}
                                className="
                                    flex-1 py-3 
                                    border border-slate-700 rounded 
                                    text-slate-300 hover:text-emerald-400 
                                    hover:border-emerald-500/50 hover:bg-emerald-500/5
                                    transition-all duration-200
                                    text-xs font-mono uppercase tracking-wider
                                "
                            >
                                [ Forecast YES ]
                            </button>
                            <button
                                onClick={() => handleSelectOption('NO')}
                                className="
                                    flex-1 py-3 
                                    border border-slate-700 rounded 
                                    text-slate-300 hover:text-rose-400 
                                    hover:border-rose-500/50 hover:bg-rose-500/5
                                    transition-all duration-200
                                    text-xs font-mono uppercase tracking-wider
                                "
                            >
                                [ Forecast NO ]
                            </button>
                        </motion.div>
                    )}

                    {/* STATE: SELECTED */}
                    {(status === 'SELECTED') && (
                        <motion.div
                            key="calibration"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-sans">
                                    Forecasting <span className={selectedOption === 'YES' ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{selectedOption}</span> margin
                                </span>
                                <button
                                    onClick={() => { setStatus('IDLE'); setSelectedOption(null); }}
                                    className="text-[10px] text-slate-600 hover:text-slate-300 transition-colors uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                                    <span>Set Confidence Level</span>
                                    <span className="text-white">{confidence}%</span>
                                </label>
                                <input
                                    type="range"
                                    min="50"
                                    max="99"
                                    step="1"
                                    value={confidence}
                                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-emerald-400 focus:outline-none"
                                />
                                <div className="text-[10px] text-emerald-500/80 font-mono text-right">
                                    Estimated Trust Impact: +{xpImpact} XP
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="
                                    w-full py-2.5 mt-2
                                    bg-slate-100 text-slate-900 
                                    hover:bg-white 
                                    rounded text-xs font-bold uppercase tracking-widest
                                    transition-colors
                                "
                            >
                                Submit Forecast
                            </button>
                        </motion.div>
                    )}

                    {/* STATE: SUBMITTED */}
                    {status === 'SUBMITTED' && (
                        <motion.div
                            key="submitted"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center justify-center gap-3 py-4"
                        >
                            {/* 1. The Vote Badge */}
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border bg-opacity-10 text-sm font-bold tracking-wider shadow-lg ${selectedOption === 'YES'
                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10'
                                    : 'border-rose-500 bg-rose-500/10 text-rose-400 shadow-rose-500/10'
                                }`}>
                                <CheckCircle2 size={16} />
                                YOU PICKED: {selectedOption}
                            </div>

                            {/* 2. Status Text */}
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                                Sentiment Unlocked
                            </p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
