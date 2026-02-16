'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame, animate } from 'framer-motion';
import { LiveEventCard } from './LiveEventCard';
import { TrendingUp, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Demo Data with Turkish real-world events
// Demo Data with Turkish real-world events
const demoEvents = [
    {
        id: 'demo-3',
        title: 'ABD, Şubat ayı içinde Grönland\'ı ilhak eder mi?',
        yesPct: 15,
        voteCount: 18900,
        category: { name: 'GLOBAL', color: 'text-blue-600' },
    },
    {
        id: 'demo-4',
        title: 'Ademola Lookman -> Fenerbahçe transferi bu hafta biter mi?',
        yesPct: 72,
        voteCount: 32500,
        category: { name: 'SPOR', color: 'text-violet-600' },
    },
    {
        id: 'demo-1',
        title: 'Ocak ayı TÜİK Enflasyon verisi %4.32 üzerinde gelir mi?',
        yesPct: 72,
        voteCount: 12450,
        category: { name: 'MAKRO', color: 'text-emerald-600' },
    },
    {
        id: 'demo-2',
        title: 'Gümüş (XAG) bu hafta tekrar 100$\'ı geçer mi?',
        yesPct: 55,
        voteCount: 8215,
        category: { name: 'EMTİA', color: 'text-amber-600' },
    },
    {
        id: 'demo-5',
        title: 'OpenAI, GPT-6 modelini bu ay tanıtır mı?',
        yesPct: 40,
        voteCount: 9100,
        category: { name: 'YAPAY ZEKA', color: 'text-pink-600' },
    },
];

// Single set for clean promo video (no loop duplication)
const displayEvents = demoEvents;
const CARD_WIDTH = 320;
const GAP = 24;
const TOTAL_WIDTH = (CARD_WIDTH + GAP) * demoEvents.length;

export function FeaturedCarousel() {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Auto-scroll logic paused for promo video cleanliness or kept simple
    // If we want it to stop repeating, we might should disable the infinite loop wrap logic or just let it scroll once.
    // However, the user just said "don't repeat".
    useAnimationFrame((time, delta) => {
        if (isHovered || isDragging) return;

        const moveBy = (delta / 16) * 0.5; // ~0.5px per frame (30px/sec)
        let newX = x.get() - moveBy;

        // Simple wrap for single set or stop?
        // If we don't duplicate, wrapping looks jumpy.
        // Let's keep scrolling but reset cleanly if we really wanted infinite, but without duplication we can't do smooth infinite.
        // Given the request "don't repeat cards", maybe they want a static slider or just scroll until end?
        // But the previous code forced a wrap.
        // Let's assume standard carousel behavior but only showing unique items. 
        // If it scrolls off screen, it's gone.
        // But for a "promo video", maybe we just want it to be static or slowly scrolling?
        // I will keep the scroll logic but if I removed duplication, I should probably render `displayEvents`.

        // Infinite Loop Wrap - this needs duplication to be smooth. 
        // If user explicitly asked "same cards not to repeat", they accept the end of the list.
        // Or maybe they want more unique cards?
        // "Introduction video... let it be proper/clean"
        // I will remove the duplication.

        if (newX <= -TOTAL_WIDTH) {
            newX = 0; // Jumps back to start
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
        <section className="relative w-full section-warm py-20 border-t border-ink-200 overflow-hidden group/section">
            {/* Decorative blur blob */}
            <div className="blur-blob blur-blob-signal w-[400px] h-[400px] -top-40 -right-20" />
            <div className="blur-blob blur-blob-warm w-[300px] h-[300px] bottom-0 left-1/4" />

            <div className="container mx-auto px-4 relative z-10 mb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ActivityIcon />
                            <span className="text-signal font-mono text-xs tracking-[0.2em] uppercase font-bold">Canlı Gündem</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-semibold text-ink-950 tracking-tight">
                            Popüler <span className="text-signal">Tahminler</span>
                        </h2>
                    </div>
                    <button className="text-signal hover:text-signal/80 font-medium text-sm flex items-center gap-1 transition-colors group">
                        Tüm gündemleri görüntüle
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
                    className="absolute left-8 z-30 p-3 rounded-full bg-white/80 backdrop-blur-md border border-ink-200 text-ink-600 opacity-0 group-hover/section:opacity-100 transition-all hover:bg-signal hover:text-white hover:border-signal hover:scale-110 -translate-x-4 group-hover/section:translate-x-0 shadow-organic"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-8 z-30 p-3 rounded-full bg-white/80 backdrop-blur-md border border-ink-200 text-ink-600 opacity-0 group-hover/section:opacity-100 transition-all hover:bg-signal hover:text-white hover:border-signal hover:scale-110 translate-x-4 group-hover/section:translate-x-0 shadow-organic"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Fade Gradients */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F5F4F2] via-[#F5F4F2]/80 to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F5F4F2] via-[#F5F4F2]/80 to-transparent z-20 pointer-events-none" />

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
                    {displayEvents.map((event, index) => (
                        <LiveEventCard
                            key={`${event.id}-${index}`}
                            {...event}
                            isGuest={event.id === 'demo-2'}
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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-signal"></span>
        </div>
    )
}

