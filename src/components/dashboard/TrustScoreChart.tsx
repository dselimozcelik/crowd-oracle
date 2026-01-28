'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Using mock data for now if supabase client setup is not fully ready for fetching history
const MOCK_DATA = [
    { date: 'Jan 1', score: 50 },
    { date: 'Jan 5', score: 52 },
    { date: 'Jan 10', score: 58 },
    { date: 'Jan 15', score: 65 },
    { date: 'Jan 20', score: 72 },
    { date: 'Jan 25', score: 78 },
    { date: 'Jan 30', score: 84.3 },
];

export function TrustScoreChart({ userId }: { userId?: string }) { // Made userId optional for mock
    const [data, setData] = useState<any[]>(MOCK_DATA)
    const supabase = createClient()

    useEffect(() => {
        if (!userId) return;

        async function fetchHistory() {
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

            const { data: history } = await supabase
                .from('votes')
                .select('created_at, trust_score_at_vote')
                .eq('user_id', userId)
                .gte('created_at', thirtyDaysAgo.toISOString())
                .order('created_at', { ascending: true })

            if (history && history.length > 0) {
                const chartData = history.map(item => ({
                    date: new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    }),
                    score: item.trust_score_at_vote
                }))
                setData(chartData)
            }
        }

        fetchHistory()
    }, [userId])

    return (
        <div className="
      bg-slate-900/40 
      backdrop-blur-md 
      border border-white/10
      rounded-xl 
      p-6
      mb-8
    ">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-sans text-xl font-bold text-white">Trust Score Trend</h2>
                <select className="
          bg-slate-800/50 
          backdrop-blur-md
          border border-white/10
          rounded-lg 
          px-3 py-2 
          text-sm
          font-sans
          text-slate-300
          hover:border-white/20
          transition-colors
          outline-none
        ">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>All time</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        domain={[40, 100]}
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            color: '#f8fafc'
                        }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                        itemStyle={{ color: '#10b981' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#10b981"      // Emerald
                        strokeWidth={2}
                        dot={{ fill: '#0f172a', stroke: '#10b981', r: 3, strokeWidth: 2 }}
                        activeDot={{
                            r: 6,
                            fill: '#10b981',
                            stroke: 'rgba(16, 185, 129, 0.3)',
                            strokeWidth: 4
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
