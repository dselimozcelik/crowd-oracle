'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface ConfidenceSliderProps {
    value: number[];
    onValueChange: (value: number[]) => void;
    className?: string;
}

export function ConfidenceSlider({ value, onValueChange, className }: ConfidenceSliderProps) {
    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex justify-between text-xs text-slate-500 font-medium uppercase tracking-wider">
                <span>50% (Low)</span>
                <span>100% (Extreme)</span>
            </div>

            <SliderPrimitive.Root
                className="relative flex w-full touch-none select-none items-center"
                value={value}
                onValueChange={onValueChange}
                max={100}
                min={50}
                step={1}
            >
                <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-800">
                    <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-slate-900 bg-white ring-offset-slate-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            </SliderPrimitive.Root>

            <div className="text-center">
                <span className="text-3xl font-mono font-bold text-white">{value[0]}%</span>
                <span className="text-slate-500 ml-2">Confident</span>
            </div>
        </div>
    );
}
