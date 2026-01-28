'use client';

import { useState } from 'react';
import { X, Info, Trophy } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { ConfidenceSlider } from './ConfidenceSlider';
import { RiskRewardDisplay } from './RiskRewardDisplay';

interface PredictionModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventTitle?: string;
    category?: string;
}

export function PredictionModal({ isOpen, onClose, eventTitle = "Will Bitcoin reach $100k by end of 2025?", category = "FINANCE" }: PredictionModalProps) {
    const [prediction, setPrediction] = useState<'YES' | 'NO' | null>(null);
    const [confidence, setConfidence] = useState([75]);
    const [reasoning, setReasoning] = useState('');

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-[95vw] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-800 bg-slate-900 p-0 shadow-2xl duration-200 sm:rounded-xl">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 p-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded">{category}</span>
                                <span className="text-xs text-slate-500">• Created by @admin</span>
                            </div>
                            <Dialog.Title className="text-lg font-semibold text-white leading-tight">
                                {eventTitle}
                            </Dialog.Title>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Prediction Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Choose your prediction</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPrediction('YES')}
                                    className={`relative p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${prediction === 'YES' ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'}`}
                                >
                                    <span className="text-xl font-bold">YES</span>
                                    <span className="text-xs opacity-80">Bitcoin hits $100k</span>
                                    {prediction === 'YES' && <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                                </button>
                                <button
                                    onClick={() => setPrediction('NO')}
                                    className={`relative p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${prediction === 'NO' ? 'bg-rose-500/20 border-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.2)]' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'}`}
                                >
                                    <span className="text-xl font-bold">NO</span>
                                    <span className="text-xs opacity-80">Does NOT hit $100k</span>
                                    {prediction === 'NO' && <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />}
                                </button>
                            </div>
                        </div>

                        {/* Confidence Slider */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                How confident are you?
                                <Info className="w-4 h-4 text-slate-600" />
                            </label>
                            <ConfidenceSlider value={confidence} onValueChange={setConfidence} />
                        </div>

                        {/* Risk / Reward */}
                        <RiskRewardDisplay confidence={confidence[0]} />

                        {/* Reasoning (Optional) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 flex justify-between">
                                <span>Why do you think this? (Optional)</span>
                                <span className="text-xs text-slate-600">{reasoning.length}/500</span>
                            </label>
                            <textarea
                                className="w-full h-20 bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-all resize-none"
                                placeholder="Based on historical Q4 patterns..."
                                value={reasoning}
                                onChange={(e) => setReasoning(e.target.value)}
                                maxLength={500}
                            />
                            <div className="flex items-center gap-2 text-xs text-amber-500/80 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                                <Trophy className="w-3 h-3" />
                                <span>Well-reasoned predictions that prove correct earn the "Oracle Badge"</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-slate-800 p-6 flex justify-end gap-3 bg-slate-900/50">
                        <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!prediction}>
                            Place Prediction
                        </button>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
