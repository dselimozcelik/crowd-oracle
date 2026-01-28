'use client';

import { Activity, Lock, EyeOff, Check } from 'lucide-react';
import { motion, useTransform, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LiveEventCardProps {
    id: string;
    title: string;
    voteCount: number;
    yesPct: number;
    category: { name: string; color: string };
    isGuest?: boolean;
}

export function LiveEventCard({ id, title, voteCount, yesPct, category, isGuest = false }: LiveEventCardProps) {
    const [displayVotes, setDisplayVotes] = useState(0);
    const [hasVoted, setHasVoted] = useState(false);
    const [userVote, setUserVote] = useState<'YES' | 'NO' | null>(null); // Track which option user chose
    const [showLimitModal, setShowLimitModal] = useState(false);
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    // Rolling number animation on mount
    useEffect(() => {
        const controls = animate(count, voteCount, { duration: 1.5, ease: "easeOut" });
        return controls.stop;
    }, [voteCount, count]);

    // Update state to render the spring value
    useEffect(() => {
        return rounded.on("change", (latest) => {
            setDisplayVotes(latest);
        });
    }, [rounded]);

    // Guest "Alive" Pulse Simulation
    const [pulseGlow, setPulseGlow] = useState(false);
    useEffect(() => {
        if (!isGuest) return;

        const interval = setInterval(() => {
            setPulseGlow(true);
            setTimeout(() => setPulseGlow(false), 1000);

            // Mock increment
            setDisplayVotes(prev => prev + 1);
        }, 4000);

        return () => clearInterval(interval);
    }, [isGuest]);

    // Check LocalStorage for vote status on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedVote = localStorage.getItem(`vote_${id}`);
            if (savedVote === 'YES' || savedVote === 'NO') {
                setHasVoted(true);
                setUserVote(savedVote);
            }
        }
    }, [id]);

    const handleVote = (option: 'YES' | 'NO') => {
        if (isGuest) return;
        if (hasVoted) return;

        // Free tier logic check
        const currentGuestVotes = parseInt(localStorage.getItem('guest_vote_count') || '0');
        const MAX_GUEST_VOTES = 3;

        if (currentGuestVotes >= MAX_GUEST_VOTES) {
            setShowLimitModal(true);
            return;
        }

        // Record Vote with the specific choice
        const newCount = currentGuestVotes + 1;
        localStorage.setItem('guest_vote_count', newCount.toString());
        localStorage.setItem(`vote_${id}`, option); // Store the actual choice

        setHasVoted(true);
        setUserVote(option);

        // Increment displayed vote count
        setDisplayVotes(prev => prev + 1);

        toast.success(`Voted: ${option}`, {
            description: `(${newCount}/${MAX_GUEST_VOTES} free votes used)`,
        });
    };


    return (
        <motion.div
            className={cn(
                "group relative w-[320px] flex-shrink-0 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-organic p-6 transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-lg hover:border-signal/30",
                pulseGlow && "border-signal/50 shadow-[0_0_15px_rgba(0,210,106,0.15)]"
            )}
        >
            {/* Card Header: Category & Metrics */}
            <div className="flex justify-between items-start mb-4">
                <span className={cn("text-xs font-mono font-semibold uppercase tracking-wider px-2 py-1 rounded bg-ink-100", category.color)}>
                    {category.name}
                </span>
                <span className="text-xs font-mono text-signal flex items-center gap-1.5 font-medium">
                    <Activity className="w-3.5 h-3.5" />
                    {displayVotes.toLocaleString()} Votes
                </span>
            </div>

            {/* Question */}
            <h3 className="text-lg font-semibold text-ink-900 mb-6 leading-relaxed min-h-[3.5rem] line-clamp-2">
                {title}
            </h3>

            {/* Voting Section (Hidden/Blurred for Guest) */}
            <div className="relative">
                {isGuest && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-ink-200 text-xs font-medium text-ink-600 shadow-sm">
                            <Lock className="w-3 h-3 text-signal" />
                            <span>Sign in to view</span>
                        </div>
                    </div>
                )}

                {/* BLIND_STATE: Not Voted Yet (and not guest) */}
                {!hasVoted && !isGuest && (
                    <div className="absolute top-0 left-0 right-0 z-20 h-[30px] flex items-center justify-center pointer-events-none">
                        <div className="flex items-center gap-2 text-xs font-medium text-ink-400">
                            <EyeOff className="w-3 h-3" />
                            <span>Vote to reveal</span>
                        </div>
                    </div>
                )}

                <div className={cn("space-y-4 transition-all duration-500")}>
                    {/* Progress Bar Container */}
                    <div className="space-y-2 relative">
                        {/* Labels */}
                        <div className={cn("flex justify-between text-xs font-mono font-medium transition-opacity duration-300", !hasVoted ? "opacity-0" : "opacity-100")}>
                            <span className="text-yes">YES {yesPct}%</span>
                            <span className="text-no">NO {100 - yesPct}%</span>
                        </div>

                        {/* Bar */}
                        <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden relative">
                            {/* Blind State Overlay for Bar */}
                            {!hasVoted && (
                                <div className="absolute inset-0 bg-ink-200/50 backdrop-blur-[1px] z-10" />
                            )}

                            <div
                                className={cn(
                                    "h-full rounded-full shadow-[0_0_8px_rgba(0,210,106,0.3)] transition-all duration-700 ease-out",
                                    !hasVoted ? "bg-ink-300 w-1/2" : "bg-gradient-to-r from-yes to-emerald-400"
                                )}
                                style={{ width: !hasVoted ? '50%' : `${yesPct}%` }}
                            />
                        </div>
                    </div>

                    {/* Vote Buttons */}
                    <div className={cn("flex gap-3 pt-2", isGuest && "blur-sm opacity-50")}>
                        {/* YES Button */}
                        <button
                            onClick={() => handleVote('YES')}
                            disabled={hasVoted}
                            className={cn(
                                "relative flex-1 py-2.5 rounded-lg border text-xs font-bold font-mono overflow-hidden group/btn transition-all",
                                hasVoted && userVote === 'YES'
                                    ? "bg-yes text-white border-yes cursor-default shadow-[0_0_10px_rgba(0,210,106,0.3)]" // Selected YES
                                    : hasVoted && userVote === 'NO'
                                        ? "bg-ink-50 text-ink-300 border-ink-100 cursor-default" // Muted (user chose NO)
                                        : "bg-yes/10 text-yes border-yes/20 hover:bg-yes hover:text-white cursor-pointer" // Interactive
                            )}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-1.5">
                                {hasVoted && userVote === 'YES' && <Check className="w-3.5 h-3.5" />}
                                YES
                            </span>
                            {/* Shimmer Effect (only if interactive) */}
                            {!hasVoted && <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />}
                        </button>

                        {/* NO Button */}
                        <button
                            onClick={() => handleVote('NO')}
                            disabled={hasVoted}
                            className={cn(
                                "relative flex-1 py-2.5 rounded-lg border text-xs font-bold font-mono overflow-hidden transition-all",
                                hasVoted && userVote === 'NO'
                                    ? "bg-no text-white border-no cursor-default shadow-[0_0_10px_rgba(239,68,68,0.3)]" // Selected NO
                                    : hasVoted && userVote === 'YES'
                                        ? "bg-ink-50 text-ink-300 border-ink-100 cursor-default" // Muted (user chose YES)
                                        : "bg-no/10 text-no border-no/20 hover:bg-no hover:text-white cursor-pointer" // Interactive
                            )}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-1.5">
                                {hasVoted && userVote === 'NO' && <Check className="w-3.5 h-3.5" />}
                                NO
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Background Glow on Hover */}
            <div className="absolute -inset-1 z-[-1] bg-signal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

            {/* Conversion Modal Overlay */}
            <AnimatePresence>
                {showLimitModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm p-4 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 10 }}
                            className="w-full space-y-4"
                        >
                            <div className="space-y-2">
                                <h4 className="text-xl font-display font-bold text-ink-900 leading-tight">
                                    Woah! You're on a roll! 🔥
                                </h4>
                                <p className="text-xs text-ink-600 leading-relaxed px-2">
                                    You've used your 3 free guest votes. Don't lose your streak—create a free account to keep predicting.
                                </p>
                            </div>

                            <div className="space-y-2 pt-2">
                                <button
                                    onClick={() => console.log('Navigate to signup')}
                                    className="w-full py-2.5 rounded-lg bg-signal hover:brightness-110 text-white text-xs font-bold font-mono tracking-wide transition-all shadow-[0_0_15px_rgba(0,210,106,0.3)]"
                                >
                                    Unlock Unlimited Voting
                                </button>
                                <button
                                    onClick={() => setShowLimitModal(false)}
                                    className="w-full py-2 rounded-lg text-ink-500 hover:text-ink-900 text-xs font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}


