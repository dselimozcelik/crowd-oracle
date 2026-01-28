import { TrendingUp, TrendingDown, Zap, ShieldAlert } from 'lucide-react';

interface RiskRewardProps {
    confidence: number;
}

export function RiskRewardDisplay({ confidence }: RiskRewardProps) {
    // Mock calculations based on user prompt formulas
    // Reward = base_reward * confidence * difficulty (assuming difficulty 1.0 for now)
    // Penalty = base_penalty * confidence * 2.0

    const baseReward = 10;
    const basePenalty = 5;
    const multiplier = (confidence / 50).toFixed(1); // 1.0x at 50%, 2.0x at 100%

    const rewardTrust = (2.0 * (confidence / 50)).toFixed(1);
    const rewardXP = Math.round(baseReward * (confidence / 10));

    const penaltyTrust = (3.5 * (confidence / 50)).toFixed(1);
    const penaltyXP = Math.round(basePenalty * (confidence / 10) * 1.5);

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* IF CORRECT */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider">If Correct</span>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Trust Score</span>
                        <span className="font-mono font-bold text-emerald-400">+{rewardTrust}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">XP Reward</span>
                        <span className="font-mono font-bold text-emerald-400">+{rewardXP} XP</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Multiplier</span>
                        <span className="font-mono font-bold text-white">{multiplier}x</span>
                    </div>
                </div>
            </div>

            {/* IF WRONG */}
            <div className="bg-rose-950/20 border border-rose-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3 text-rose-400">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider">If Wrong</span>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Trust Score</span>
                        <span className="font-mono font-bold text-rose-400">-{penaltyTrust}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">XP Penalty</span>
                        <span className="font-mono font-bold text-rose-400">-{penaltyXP} XP</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Risk Factor</span>
                        <span className="font-mono font-bold text-rose-400">High</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
