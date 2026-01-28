'use client';

import { motion } from "framer-motion";

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
    return (
        <div className="relative w-full h-16 bg-black border-y-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] overflow-hidden z-20 flex items-center">

            {/* SCROLLING WRAPPER */}
            <div className="flex whitespace-nowrap overflow-hidden w-full">
                <motion.div
                    // 🚀 THE FIX: Use 'gap-32' on the parent. Safari respects Flex Gap perfectly.
                    className="flex min-w-full items-center gap-32 pr-32"
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
                >
                    {/* RENDER LOOP */}
                    {[...TICKER_DATA, ...TICKER_DATA].map((item, i) => (

                        // ITEM CONTAINER: Clean, no margins, let 'gap' handle the space.
                        <div key={i} className="flex flex-row items-center min-w-max">

                            {/* 1. EVENT */}
                            <span className="text-white font-mono font-bold text-xs tracking-[0.15em] uppercase">
                                {item.event}
                            </span>

                            {/* 2. DOT */}
                            <span className="text-emerald-500 mx-3 text-xl">•</span>

                            {/* 3. DATE */}
                            <span className="text-emerald-400 font-mono text-xs font-medium tracking-widest opacity-90">
                                {item.date}
                            </span>

                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
