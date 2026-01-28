'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame, animate } from 'framer-motion';
import { LiveEventCard } from './LiveEventCard';
import { TrendingUp, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Demo Data with "Maritime Data" theme metrics
const demoEvents = [
    {
        id: 'demo-1',
        title: 'Will Bitcoin break $150k by Q4?',
        yesPct: 75,
        voteCount: 15420,
        category: { name: 'Crypto', color: 'text-amber-400' },
    },
    {
        id: 'demo-2',
        title: 'SpaceX Starship orbital success?',
        yesPct: 45,
        voteCount: 8932,
        category: { name: 'Tech', color: 'text-blue-400' },
    },
    {
        id: 'demo-3',
        title: 'US Interest Rates < 4% in 2026?',
        yesPct: 62,
        voteCount: 22150,
        category: { name: 'Macro', color: 'text-emerald-400' },
    },
    {
        id: 'demo-4',
        title: 'Solana to flip Ethereum market cap?',
        yesPct: 28,
        voteCount: 4500,
        category: { name: 'Crypto', color: 'text-violet-400' },
    },
    {
        id: 'demo-5',
        title: 'GPT-6 release before July 2026?',
        yesPct: 81,
        voteCount: 12600,
        category: { name: 'AI', color: 'text-pink-400' },
    },
    {
        id: 'demo-6',
        title: 'Apple VR headset sales < 1M units?',
        yesPct: 65,
        voteCount: 5200,
        category: { name: 'Tech', color: 'text-blue-400' },
    },
];

// Duplicate for infinite loop
const doubleEvents = [...demoEvents, ...demoEvents];
const CARD_WIDTH = 320;
const GAP = 24;
const TOTAL_WIDTH = (CARD_WIDTH + GAP) * demoEvents.length;

export function FeaturedCarousel() {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Auto-scroll logic
    useAnimationFrame((time, delta) => {
        if (isHovered || isDragging) return;

        const moveBy = (delta / 16) * 0.5; // ~0.5px per frame (30px/sec)
        let newX = x.get() - moveBy;

        // Infinite Loop Wrap
        if (newX <= -TOTAL_WIDTH) {
            newX = 0;
        } else if (newX > 0) {
            newX = -TOTAL_WIDTH;
        }

        x.set(newX);
    });

    const handleDragStart = () => setIsDragging(true);
    const handleDragEnd = () => setIsDragging(false);

    const handlePrev = () => {
        const current = x.get();
        const target = current + (CARD_WIDTH + GAP);
        animate(x, target > 0 ? -TOTAL_WIDTH : target, { type: "spring", stiffness: 300, damping: 30 });
    };

    const handleNext = () => {
        const current = x.get();
        const target = current - (CARD_WIDTH + GAP);
        animate(x, target < -TOTAL_WIDTH ? 0 : target, { type: "spring", stiffness: 300, damping: 30 });
    };

    return (
        <section className="relative w-full bg-[#020617] py-20 border-t border-emerald-500/50 shadow-[0_-1px_15px_rgba(16,185,129,0.2)] overflow-hidden group/section">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/40 to-[#020617] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 mb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ActivityIcon />
                            <span className="text-emerald-400 font-mono text-xs tracking-[0.2em] uppercase font-bold">Live Markets</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight">
                            Trending <span className="text-emerald-400">Predictions</span>
                        </h2>
                    </div>
                    <button className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center gap-1 transition-colors group">
                        View all markets
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Slider Container */}
            <div
                className="relative w-full h-[450px] flex items-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Navigation Buttons (Visible on Hover) */}
                <button
                    onClick={handlePrev}
                    className="absolute left-8 z-30 p-3 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 text-emerald-400 opacity-0 group-hover/section:opacity-100 transition-all hover:bg-emerald-500 hover:text-white hover:scale-110 -translate-x-4 group-hover/section:translate-x-0"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-8 z-30 p-3 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 text-emerald-400 opacity-0 group-hover/section:opacity-100 transition-all hover:bg-emerald-500 hover:text-white hover:scale-110 translate-x-4 group-hover/section:translate-x-0"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Fade Gradients */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020617] via-[#020617]/80 to-transparent z-20 pointer-events-none" />

                {/* Animated Track */}
                <motion.div
                    ref={containerRef}
                    className="flex gap-6 pl-4 absolute left-0"
                    style={{ x }}
                    drag="x"
                    dragElastic={0.1} // Premium feel
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {doubleEvents.map((event, index) => (
                        <LiveEventCard
                            key={`${event.id}-${index}`}
                            {...event}
                            isGuest={index % 3 === 0}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function ActivityIcon() {
    return (
        <div className="relative flex items-center justify-center w-4 h-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
    )
}
