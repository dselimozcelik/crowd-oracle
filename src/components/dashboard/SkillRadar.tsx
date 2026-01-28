'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface SkillRadarProps {
    data: {
        subject: string;
        A: number;
        fullMark: number;
    }[];
}

export function SkillRadar({ data }: SkillRadarProps) {
    return (
        <div className="bg-gradient-to-b from-slate-800/40 to-slate-950/40 backdrop-blur-md border border-white/5 border-t-white/10 shadow-lg shadow-black/40 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">Expertise Radar</h3>

            <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Skill Level"
                            dataKey="A"
                            stroke="#10B981"
                            strokeWidth={2}
                            fill="#10B981"
                            fillOpacity={0.3}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(2, 6, 23, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#34d399', fontFamily: 'monospace' }}
                            formatter={(value: number) => [`${value}%`, 'Proficiency']}
                            labelStyle={{ display: 'none' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>

                {/* Decorative Center Dot */}
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(16,185,129,0.8)] pointer-events-none" />
            </div>
        </div>
    );
}
