'use client';

import { ResponsiveContainer, Area, CartesianGrid, XAxis, YAxis, Tooltip, ComposedChart, Line } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrustSonarProps {
    data: {
        date: string;
        score: number;
        avg: number;
        event: string;
        change: number;
        result: string;
    }[];
}

// 1. CUSTOM DOT (The Win/Loss Marker)
const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload.event || payload.change === 0) return <circle cx={cx} cy={cy} r={3} fill="#475569" />; // Neutral/Start

    const isWin = payload.change > 0;

    return (
        <circle
            cx={cx}
            cy={cy}
            r={5}
            stroke={isWin ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fill={isWin ? "#10b981" : "#020617"}
            className="transition-all duration-300 hover:r-6 cursor-pointer"
        />
    );
};

// 2. CUSTOM TOOLTIP (The Story)
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const isWin = data.change > 0;
        const isLoss = data.change < 0;
        const isNeutral = data.change === 0;

        return (
            <div className="bg-slate-900/95 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md min-w-[180px]">
                <p className="text-xs text-slate-500 font-mono mb-2 border-b border-white/5 pb-1">{label}</p>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">Score: {data.score}</span>
                    {/* Benchmark Comparison */}
                    <span className="text-[10px] text-slate-500">vs Avg: {data.avg}</span>
                </div>

                {!isNeutral && (
                    <div className="bg-white/5 rounded p-2 mt-2">
                        <div className="flex items-center gap-2 mb-1">
                            {isWin ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
                            <span className="text-xs font-medium text-slate-200">{data.event}</span>
                        </div>
                        <div className={`text-xs font-mono font-bold ${isWin ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isWin ? '+' : ''}{data.change} ({data.result})
                        </div>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export function TrustSonar({ data }: TrustSonarProps) {
    return (
        <div className="bg-gradient-to-b from-slate-800/40 to-slate-950/40 backdrop-blur-md border border-white/5 border-t-white/10 shadow-lg shadow-black/40 rounded-xl p-6 lg:col-span-2">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                Performance History
            </h3>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            {/* NEON GLOW FILTER */}
                            <filter id="glow" height="300%" width="300%" x="-100%" y="-100%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            {/* GRADIENT FILL */}
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />

                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={[0, 100]}
                        />

                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />

                        {/* BENCHMARK LINE */}
                        <Line
                            type="monotone"
                            dataKey="avg"
                            stroke="#64748b"
                            strokeDasharray="5 5"
                            dot={false}
                            strokeWidth={1}
                            activeDot={false}
                            name="Global Avg"
                        />

                        {/* USER SCORE AREA */}
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#10b981"
                            strokeWidth={3}
                            fill="url(#colorScore)"
                            filter="url(#glow)"
                            animationDuration={1500}
                        />

                        {/* EVENT DOTS LAYER */}
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="none"
                            dot={<CustomDot />}
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                            isAnimationActive={false} // Match area animation
                        />

                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
