'use client';

import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { fadeUp, springs } from '@/lib/animations';

interface SkillRadarProps {
    data: {
        subject: string;
        A: number;
        fullMark: number;
    }[];
}

export function SkillRadar({ data }: SkillRadarProps) {
    return (
        <motion.div
            className="bg-white border border-ink-200 rounded-xl p-6 shadow-organic"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ boxShadow: '0 8px 30px -12px rgba(0,0,0,0.1)' }}
            transition={springs.gentle}
        >
            <h3 className="text-sm font-medium text-ink-500 uppercase tracking-widest mb-6">
                Expertise Radar
            </h3>

            <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#E5E7EB" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Skill Level"
                            dataKey="A"
                            stroke="#14B8A6"
                            strokeWidth={2}
                            fill="#14B8A6"
                            fillOpacity={0.2}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                color: '#1F2937'
                            }}
                            itemStyle={{ color: '#14B8A6', fontFamily: 'monospace' }}
                            formatter={(value: number) => [`${value}%`, 'Proficiency']}
                            labelStyle={{ display: 'none' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>

                {/* Decorative Center Dot */}
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-teal-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
        </motion.div>
    );
}
