'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Animated Number Component (Maritime Style)
function AnimatedNumber({ value }: { value: number }) {
    const [display, setDisplay] = useState(0)

    useEffect(() => {
        let start = 0
        const end = value
        const duration = 1000
        const increment = end / (duration / 16)

        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setDisplay(end)
                clearInterval(timer)
            } else {
                setDisplay(start)
            }
        }, 16)

        return () => clearInterval(timer)
    }, [value])

    return <>{display.toFixed(1)}</>
}

interface MetricCardProps {
    title: string
    value: string
    delta: string
    trend: 'up' | 'down'
    color: 'emerald' | 'red' | 'slate' | 'blue' | 'amber' // mapping old props to new constraints
    icon?: React.ReactNode // keeping for compatibility but not using in new design potentially
}

export function MetricCard({ title, value, delta, trend, color }: MetricCardProps) {
    const colorMap: Record<string, string> = {
        emerald: 'text-emerald-500',
        red: 'text-red-500',
        slate: 'text-slate-100',
        blue: 'text-blue-500', // fallback mapping
        amber: 'text-amber-500', // fallback mapping
    }

    // Sanitize value for animation
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;

    return (
        <div className="
      group
      relative
      bg-slate-900/40 
      backdrop-blur-md 
      border border-white/10
      hover:border-emerald-500/50
      rounded-xl 
      p-6
      transition-all duration-300
      hover:scale-[1.02]
      hover:shadow-[0_0_24px_rgba(16,185,129,0.2)]
    ">
            {/* Label */}
            <div className="
        font-sans
        text-xs 
        font-medium 
        text-slate-400 
        uppercase 
        tracking-wider 
        mb-3
      ">
                {title}
            </div>

            {/* Value - Animated Number */}
            <div className={`
        font-mono 
        text-5xl 
        font-bold 
        mb-2
        ${colorMap[color] || 'text-slate-100'}
      `}>
                {value.includes('%') || value.includes('#') ? (
                    <span className="flex items-baseline">
                        {value.includes('#') && <span className="text-3xl mr-1">#</span>}
                        <AnimatedNumber value={numericValue} />
                        {value.includes('%') && <span className="text-3xl ml-1">%</span>}
                    </span>
                ) : (
                    <AnimatedNumber value={numericValue} />
                )}
            </div>

            {/* Delta Indicator */}
            <div className="flex items-center gap-2">
                <span className={`
          font-mono
          text-sm 
          flex items-center gap-1
          ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}
        `}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {delta}
                </span>
            </div>

            {/* Hover Glow Effect */}
            <div className="
        absolute inset-0 
        rounded-xl 
        opacity-0 
        group-hover:opacity-100
        bg-gradient-to-br from-emerald-500/5 to-transparent
        transition-opacity duration-300
        pointer-events-none
      " />
        </div>
    )
}
