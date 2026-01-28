import Link from 'next/link';
import { Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Event, Category } from '@/types/database';

interface EventCardProps {
    event: Event & { category: Category };
    userVote?: { prediction: boolean } | null;
}

function formatTimeRemaining(deadline: string): string {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();

    if (diff < 0) return 'Closed';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h left`;

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes}m left`;
}

export function EventCard({ event, userVote }: EventCardProps) {
    const totalVotes = event.yes_count + event.no_count;
    const totalWeight = event.weighted_yes + event.weighted_no;
    const weightedYesPct = totalWeight > 0 ? (event.weighted_yes / totalWeight) * 100 : 50;
    const isActive = event.status === 'active' && new Date(event.deadline) > new Date();

    return (
        <Link href={`/events/${event.id}`}>
            <article className={cn(
                "card-sharp card-interactive bg-white h-full flex flex-col",
                event.is_featured && "border-l-2 border-l-signal"
            )}>
                {/* Header */}
                <div className="p-4 pb-0">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="tag tag-neutral">
                            {event.category.icon} {event.category.name}
                        </span>
                        {event.is_featured && (
                            <span className="tag tag-signal">Featured</span>
                        )}
                        {userVote && (
                            <span className={cn(
                                "tag",
                                userVote.prediction
                                    ? "bg-yes-muted text-yes border-yes-dim"
                                    : "bg-no-muted text-no border-no-dim"
                            )}>
                                Voted {userVote.prediction ? 'Yes' : 'No'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 pt-0 flex-grow">
                    <h3 className="font-medium text-ink-900 mb-2 leading-snug line-clamp-2">
                        {event.title}
                    </h3>
                    {event.description && (
                        <p className="text-sm text-ink-500 line-clamp-2 leading-relaxed">
                            {event.description}
                        </p>
                    )}
                </div>

                {/* Prediction bar */}
                <div className="px-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="data-label text-ink-400">Weighted</span>
                        <span className={cn(
                            "data-value text-sm font-medium",
                            weightedYesPct >= 50 ? "text-yes" : "text-no"
                        )}>
                            {weightedYesPct >= 50 ? 'YES' : 'NO'} {Math.round(weightedYesPct >= 50 ? weightedYesPct : 100 - weightedYesPct)}%
                        </span>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-yes"
                            style={{ width: `${weightedYesPct}%` }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-ink-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-ink-400">
                        <Users className="w-3.5 h-3.5" />
                        <span className="data-value text-xs">{totalVotes}</span>
                    </div>
                    <div className={cn(
                        "flex items-center gap-1 text-xs",
                        isActive ? "text-ink-600" : "text-ink-400"
                    )}>
                        <Clock className="w-3.5 h-3.5" />
                        <span className="data-value">{formatTimeRemaining(event.deadline)}</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
