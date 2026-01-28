'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    ArrowLeft,
    ThumbsUp,
    ThumbsDown,
    Loader2,
    AlertTriangle,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { settleEvent } from '@/actions/events';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Event, Category } from '@/types/database';

interface SettleEventPageProps {
    event: Event & { category: Category };
}

export function SettleEventClient({ event }: SettleEventPageProps) {
    const router = useRouter();
    const [isSettling, setIsSettling] = useState(false);
    const [selectedOutcome, setSelectedOutcome] = useState<boolean | null>(null);

    const totalVotes = event.yes_count + event.no_count;
    const rawYesPct = totalVotes > 0 ? (event.yes_count / totalVotes) * 100 : 50;
    const totalWeight = event.weighted_yes + event.weighted_no;
    const weightedYesPct = totalWeight > 0 ? (event.weighted_yes / totalWeight) * 100 : 50;

    async function handleSettle() {
        if (selectedOutcome === null) {
            toast.error('Please select an outcome');
            return;
        }

        setIsSettling(true);
        const result = await settleEvent(event.id, selectedOutcome);

        if (result.error) {
            toast.error(result.error);
            setIsSettling(false);
        } else {
            toast.success('Event settled! User stats have been updated.');
            router.push('/admin/events');
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <Link href="/admin/events">
                <Button variant="ghost" size="sm" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Events
                </Button>
            </Link>

            <Card className="glass border-amber-500/30 mb-6">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <CardTitle>Settle Event Outcome</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Event Info */}
                        <div>
                            <Badge variant="outline" className="mb-2">
                                {event.category?.icon} {event.category?.name}
                            </Badge>
                            <h2 className="text-xl font-semibold">{event.title}</h2>
                            {event.description && (
                                <p className="text-muted-foreground mt-2">{event.description}</p>
                            )}
                        </div>

                        {/* Vote Summary */}
                        <div className="p-4 rounded-lg bg-background/50">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <Users className="w-4 h-4" />
                                {totalVotes} predictions
                            </div>

                            {/* Raw Results */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Raw Result</span>
                                    <span>{rawYesPct.toFixed(1)}% Yes / {(100 - rawYesPct).toFixed(1)}% No</span>
                                </div>
                                <div className="h-4 rounded-full bg-muted overflow-hidden flex">
                                    <div className="h-full bg-yes" style={{ width: `${rawYesPct}%` }} />
                                    <div className="h-full bg-no" style={{ width: `${100 - rawYesPct}%` }} />
                                </div>
                            </div>

                            {/* Weighted Results */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-oracle-400 font-medium">Weighted Result</span>
                                    <span className="text-oracle-400">{weightedYesPct.toFixed(1)}% Yes / {(100 - weightedYesPct).toFixed(1)}% No</span>
                                </div>
                                <div className="h-4 rounded-full bg-muted overflow-hidden flex">
                                    <div className="h-full bg-yes" style={{ width: `${weightedYesPct}%` }} />
                                    <div className="h-full bg-no" style={{ width: `${100 - weightedYesPct}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Outcome Selection */}
                        <div>
                            <h3 className="font-medium mb-4">What was the actual outcome?</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className={cn(
                                        "h-24 text-xl transition-all",
                                        selectedOutcome === true
                                            ? "gradient-yes text-white border-0 scale-105"
                                            : "hover:border-yes/50"
                                    )}
                                    onClick={() => setSelectedOutcome(true)}
                                    disabled={isSettling}
                                >
                                    <ThumbsUp className="w-8 h-8 mr-3" />
                                    YES
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className={cn(
                                        "h-24 text-xl transition-all",
                                        selectedOutcome === false
                                            ? "gradient-no text-white border-0 scale-105"
                                            : "hover:border-no/50"
                                    )}
                                    onClick={() => setSelectedOutcome(false)}
                                    disabled={isSettling}
                                >
                                    <ThumbsDown className="w-8 h-8 mr-3" />
                                    NO
                                </Button>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-amber-400 mb-1">This action cannot be undone</p>
                                    <p className="text-muted-foreground">
                                        Settling this event will update the Trust Scores and stats for all {totalVotes} users
                                        who made predictions. Make sure you have the correct outcome before proceeding.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4">
                            <Button
                                className="flex-1"
                                size="lg"
                                variant={selectedOutcome === true ? 'default' : selectedOutcome === false ? 'destructive' : 'outline'}
                                onClick={handleSettle}
                                disabled={selectedOutcome === null || isSettling}
                            >
                                {isSettling ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Settling...
                                    </>
                                ) : (
                                    `Confirm: Outcome is ${selectedOutcome === true ? 'YES' : selectedOutcome === false ? 'NO' : '...'}`
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
