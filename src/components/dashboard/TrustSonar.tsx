'use client';

import { motion } from 'framer-motion';
import { ResponsiveContainer, Area, CartesianGrid, XAxis, YAxis, Tooltip, ComposedChart, Line } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fadeUp, springs } from '@/lib/animations';

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

// Custom Dot (Win/Loss Marker)
const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload.event || payload.change === 0) return <circle cx={cx} cy={cy} r={3} fill="#9CA3AF" />;

    const isWin = payload.change > 0;

    return (
        <circle
            cx={cx}
            cy={cy}
            r={5}
            stroke={isWin ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fill={isWin ? "#10b981" : "#ef4444"}
            className="cursor-pointer"
        />
    );
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const isWin = data.change > 0;
        const isLoss = data.change < 0;
        const isNeutral = data.change === 0;

        return (
            <div className="bg-white border border-ink-200 p-3 rounded-lg shadow-lg min-w-[180px]">
                <p className="text-xs text-ink-400 font-mono mb-2 border-b border-ink-100 pb-1">{label}</p>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-ink-900">Score: {data.score}</span>
                    <span className="text-[10px] text-ink-400">vs Avg: {data.avg}</span>
                </div>

                {!isNeutral && (
                    <div className="bg-ink-50 rounded p-2 mt-2">
                        <div className="flex items-center gap-2 mb-1">
                            {isWin ? <TrendingUp className="w-3 h-3 text-yes" /> : <TrendingDown className="w-3 h-3 text-no" />}
                            <span className="text-xs font-medium text-ink-700">{data.event}</span>
                        </div>
                        <div className={`text-xs font-mono font-bold ${isWin ? 'text-yes' : 'text-no'}`}>
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
        <motion.div
            className="bg-white border border-ink-200 rounded-xl p-6 lg:col-span-2 shadow-organic"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ boxShadow: '0 8px 30px -12px rgba(0,0,0,0.1)' }}
            transition={springs.gentle}
        >
            <h3 className="text-sm font-medium text-ink-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-signal" />
                Performance History
            </h3>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            {/* Soft Gradient Fill */}
                            <linearGradient id="colorScoreLight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'monospace' }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={[0, 100]}
                        />

                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />

                        {/* Benchmark Line */}
                        <Line
                            type="monotone"
                            dataKey="avg"
                            stroke="#D1D5DB"
                            strokeDasharray="5 5"
                            dot={false}
                            strokeWidth={1}
                            activeDot={false}
                            name="Global Avg"
                        />

                        {/* User Score Area */}
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            fill="url(#colorScoreLight)"
                            animationDuration={1500}
                        />

                        {/* Event Dots Layer */}
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="none"
                            dot={<CustomDot />}
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                            isAnimationActive={false}
                        />

                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
