import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VotingPanel } from '@/components/events/VotingPanel';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    CheckCircle,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EventData {
    id: string;
    title: string;
    description: string | null;
    status: string;
    outcome: boolean | null;
    yes_count: number;
    no_count: number;
    weighted_yes: number;
    weighted_no: number;
    deadline: string;
    resolution_date: string | null;
    is_featured: boolean;
    category: { name: string; icon: string; color: string } | null;
}

interface VoteData {
    prediction: boolean;
}

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Get event with category
    const { data: eventData, error } = await (supabase
        .from('events') as any)
        .select(`
      *,
      category:categories(*)
    `)
        .eq('id', id)
        .single();

    const event = eventData as EventData | null;

    if (error || !event) {
        notFound();
    }

    // Get user's vote for this event
    let userVote: VoteData | null = null;
    if (user) {
        const { data: voteData } = await (supabase
            .from('votes') as any)
            .select('*')
            .eq('user_id', user.id)
            .eq('event_id', id)
            .single();
        userVote = voteData as VoteData | null;
    }

    const isActive = event.status === 'active' && new Date(event.deadline) > new Date();
    const totalVotes = event.yes_count + event.no_count;

    const categoryColors: Record<string, string> = {
        blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        green: 'bg-green-500/20 text-green-300 border-green-500/30',
        amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
        cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link href="/events">
                <Button variant="ghost" size="sm" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Events
                </Button>
            </Link>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge
                                variant="outline"
                                className={cn(
                                    categoryColors[event.category?.color || 'slate'] || 'bg-slate-500/20'
                                )}
                            >
                                {event.category?.icon} {event.category?.name}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={cn(
                                    isActive
                                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                        : event.status === 'settled'
                                            ? 'bg-oracle-500/20 text-oracle-300 border-oracle-500/30'
                                            : 'bg-slate-500/20'
                                )}
                            >
                                {isActive ? 'Active' : event.status === 'settled' ? 'Settled' : 'Closed'}
                            </Badge>
                            {event.is_featured && (
                                <Badge className="gradient-oracle text-white border-0">
                                    Featured
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold mb-4">
                            {event.title}
                        </h1>

                        {event.description && (
                            <p className="text-muted-foreground text-lg">
                                {event.description}
                            </p>
                        )}
                    </div>

                    {/* Outcome (if settled) */}
                    {event.status === 'settled' && event.outcome !== null && (
                        <Card className={cn(
                            "p-6",
                            event.outcome
                                ? "bg-yes/10 border-yes/30"
                                : "bg-no/10 border-no/30"
                        )}>
                            <div className="flex items-center gap-3">
                                {event.outcome ? (
                                    <CheckCircle className="w-8 h-8 text-yes" />
                                ) : (
                                    <XCircle className="w-8 h-8 text-no" />
                                )}
                                <div>
                                    <div className="font-semibold text-lg">
                                        Outcome: {event.outcome ? 'YES' : 'NO'}
                                    </div>
                                    {userVote && (
                                        <div className="text-sm text-muted-foreground">
                                            You predicted {userVote.prediction ? 'Yes' : 'No'} –
                                            <span className={cn(
                                                "ml-1 font-medium",
                                                userVote.prediction === event.outcome ? "text-yes" : "text-no"
                                            )}>
                                                {userVote.prediction === event.outcome ? 'Correct!' : 'Incorrect'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Event Details */}
                    <Card className="glass p-6">
                        <h3 className="font-semibold mb-4">Event Details</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Clock className="w-5 h-5" />
                                <div>
                                    <div className="text-xs uppercase tracking-wide">Deadline</div>
                                    <div className="text-foreground">
                                        {new Date(event.deadline).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Users className="w-5 h-5" />
                                <div>
                                    <div className="text-xs uppercase tracking-wide">Predictions</div>
                                    <div className="text-foreground">{totalVotes} votes</div>
                                </div>
                            </div>
                            {event.resolution_date && (
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Calendar className="w-5 h-5" />
                                    <div>
                                        <div className="text-xs uppercase tracking-wide">Resolution</div>
                                        <div className="text-foreground">
                                            {new Date(event.resolution_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar - Voting Panel */}
                <div className="md:col-span-1">
                    <div className="sticky top-24">
                        <VotingPanel
                            eventId={event.id}
                            existingVote={userVote as any}
                            yesCount={event.yes_count}
                            noCount={event.no_count}
                            weightedYes={event.weighted_yes}
                            weightedNo={event.weighted_no}
                            isActive={isActive}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
