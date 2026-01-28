'use client';

import React from 'react';

export function StickyUserFooter() {
    return (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-slate-900/90 backdrop-blur-xl border-t border-emerald-500/30 py-3 z-50 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.5)]">
            <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">

                {/* Visual Connector */}
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-emerald-400 font-bold text-sm tracking-wide">YOU</span>
                </div>

                <div className="flex items-center gap-6 text-sm">
                    <div className="flex flex-col md:flex-row items-end md:items-center md:gap-2">
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Your Rank</span>
                        <span className="text-white font-mono font-bold">#1,247</span>
                    </div>

                    <div className="h-8 w-px bg-white/10 hidden md:block"></div>

                    <div className="flex flex-col md:flex-row items-end md:items-center md:gap-2">
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Trust Score</span>
                        <span className="text-emerald-400 font-mono font-bold">0.1</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
