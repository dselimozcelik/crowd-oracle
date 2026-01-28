'use client';

import { motion, useReducedMotion } from "framer-motion";

const TICKER_DATA = [
    { event: "BITCOIN > $100K", date: "[ENDS: 2 DAYS]" },
    { event: "FENERBAHÇE WIN", date: "[ENDS: 4 HOURS]" },
    { event: "FED RATE DECISION", date: "[ENDS: TOMORROW]" },
    { event: "GPT-5 LAUNCH", date: "[ENDS: Q2 2025]" },
    { event: "OIL > $90", date: "[ENDS: 1 WEEK]" },
    { event: "SPACEX STARSHIP", date: "[ENDS: FEB 28]" },
    { event: "ETHEREUM ETF", date: "[ENDS: MAY 15]" },
];

export function MarketTicker() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="relative w-full h-12 bg-[#FAF9F7] border-b border-ink-200 overflow-hidden z-20 flex items-center">
            {/* Subtle left/right fade gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#FAF9F7] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#FAF9F7] to-transparent z-10 pointer-events-none" />

            {/* SCROLLING WRAPPER */}
            <div className="flex whitespace-nowrap overflow-hidden w-full">
                <motion.div
                    className="flex min-w-full items-center gap-16 pr-16"
                    initial={{ x: 0 }}
                    animate={shouldReduceMotion ? {} : { x: "-50%" }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                >
                    {/* RENDER LOOP */}
                    {[...TICKER_DATA, ...TICKER_DATA].map((item, i) => (

                        <div key={i} className="flex flex-row items-center min-w-max">
                            {/* 1. EVENT */}
                            <span className="text-ink-700 font-mono font-semibold text-xs tracking-wide">
                                {item.event}
                            </span>

                            {/* 2. DOT */}
                            <span className="text-signal mx-2.5 text-sm">•</span>

                            {/* 3. DATE */}
                            <span className="text-signal font-mono text-xs font-medium tracking-wide">
                                {item.date}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
