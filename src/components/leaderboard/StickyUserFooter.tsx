'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function StickyUserFooter() {
    return (
        <motion.div
            className="fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-ink-200 py-3 z-50 shadow-lg"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">

                {/* Visual Connector */}
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-signal animate-pulse"></div>
                    <span className="text-signal font-bold text-sm tracking-wide">YOU</span>
                </div>

                <div className="flex items-center gap-6 text-sm">
                    <div className="flex flex-col md:flex-row items-end md:items-center md:gap-2">
                        <span className="text-ink-400 text-[10px] uppercase font-bold tracking-wider">Your Rank</span>
                        <span className="text-ink-900 font-mono font-bold">#1,247</span>
                    </div>

                    <div className="h-8 w-px bg-ink-200 hidden md:block"></div>

                    <div className="flex flex-col md:flex-row items-end md:items-center md:gap-2">
                        <span className="text-ink-400 text-[10px] uppercase font-bold tracking-wider">Trust Score</span>
                        <span className="text-signal font-mono font-bold">0.1</span>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
