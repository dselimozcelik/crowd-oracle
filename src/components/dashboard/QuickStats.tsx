import { Flame, Medal, Brain, Activity } from 'lucide-react';

export function QuickStats() {
    return (
        <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="p-4 border-b border-slate-800 bg-slate-900/80">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Statistics</h3>
            </div>

            <div className="grid grid-cols-2 divide-x divide-y divide-slate-800">
                <StatItem
                    icon={<Flame className="w-4 h-4 text-orange-500" />}
                    label="Win Streak"
                    value="8"
                    subtext="Personal Best"
                />
                <StatItem
                    icon={<Medal className="w-4 h-4 text-yellow-500" />}
                    label="Total XP"
                    value="2,450"
                    subtext="Lvl 12"
                />
                <StatItem
                    icon={<Brain className="w-4 h-4 text-purple-500" />}
                    label="Best Category"
                    value="Finance"
                    subtext="92% Accuracy"
                />
                <StatItem
                    icon={<Activity className="w-4 h-4 text-blue-500" />}
                    label="Alpha"
                    value="12.4"
                    subtext="vs Market"
                />
            </div>
        </section>
    )
}

function StatItem({ icon, label, value, subtext }: { icon: any, label: string, value: string, subtext: string }) {
    return (
        <div className="p-4 hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-xs text-slate-500 font-medium">{label}</span>
            </div>
            <div className="text-xl font-mono font-bold text-white tracking-tight">{value}</div>
            <div className="text-xs text-slate-500">{subtext}</div>
        </div>
    )
}
