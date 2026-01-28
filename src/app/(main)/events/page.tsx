import { createClient } from '@/lib/supabase/server';
import { EventCard } from '@/components/events/EventCard';
import { TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryData {
    id: string;
    name: string;
    icon: string;
    color: string;
    is_active: boolean;
    display_order: number;
}

interface EventData {
    id: string;
    title: string;
    description: string | null;
    status: string;
    yes_count: number;
    no_count: number;
    weighted_yes: number;
    weighted_no: number;
    deadline: string;
    is_featured: boolean;
    category: CategoryData | null;
}

interface VoteData {
    event_id: string;
    prediction: boolean;
}

export default async function EventsPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string; category?: string }>;
}) {
    const params = await searchParams;
    const activeTab = params.tab || 'active';
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: categoriesData } = await (supabase
        .from('categories') as any)
        .select('*')
        .eq('is_active', true)
        .order('display_order');

    const categories = categoriesData as CategoryData[] | null;

    const { data: activeEventsData } = await (supabase
        .from('events') as any)
        .select(`
      *,
      category:categories(*)
    `)
        .eq('status', 'active')
        .gt('deadline', new Date().toISOString())
        .order('is_featured', { ascending: false })
        .order('deadline', { ascending: true });

    const activeEvents = activeEventsData as EventData[] | null;

    const { data: pastEventsData } = await (supabase
        .from('events') as any)
        .select(`
      *,
      category:categories(*)
    `)
        .in('status', ['closed', 'settled'])
        .order('deadline', { ascending: false })
        .limit(12);

    const pastEvents = pastEventsData as EventData[] | null;

    let userVotes: Record<string, { prediction: boolean }> = {};
    if (user) {
        const { data: votesData } = await (supabase
            .from('votes') as any)
            .select('event_id, prediction')
            .eq('user_id', user.id);

        const votes = votesData as VoteData[] | null;

        if (votes) {
            userVotes = votes.reduce((acc, vote) => {
                acc[vote.event_id] = { prediction: vote.prediction };
                return acc;
            }, {} as Record<string, { prediction: boolean }>);
        }
    }

    const events = activeTab === 'active' ? activeEvents : pastEvents;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <p className="data-label text-ink-400 mb-2">Markets</p>
                <h1 className="font-display text-3xl headline mb-2">
                    Prediction Markets
                </h1>
                <p className="text-ink-500 max-w-xl">
                    Make your predictions on upcoming events. Your accuracy determines your influence.
                </p>
            </div>

            {/* Tabs + Filters */}
            <div className="flex items-center justify-between border-b border-ink-200 mb-8">
                <div className="flex items-center gap-0">
                    <a
                        href="/events?tab=active"
                        className={cn(
                            "flex items-center gap-2 px-4 py-3 text-sm border-b-2 -mb-px transition-colors",
                            activeTab === 'active'
                                ? "border-ink-950 text-ink-950 font-medium"
                                : "border-transparent text-ink-500 hover:text-ink-700"
                        )}
                    >
                        <TrendingUp className="w-4 h-4" />
                        Active
                        {activeEvents && (
                            <span className="data-value text-xs bg-ink-100 px-1.5 py-0.5 rounded">
                                {activeEvents.length}
                            </span>
                        )}
                    </a>
                    <a
                        href="/events?tab=past"
                        className={cn(
                            "flex items-center gap-2 px-4 py-3 text-sm border-b-2 -mb-px transition-colors",
                            activeTab === 'past'
                                ? "border-ink-950 text-ink-950 font-medium"
                                : "border-transparent text-ink-500 hover:text-ink-700"
                        )}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Settled
                    </a>
                </div>

                {/* Category filters */}
                <div className="flex items-center gap-2">
                    <span className="data-label text-ink-400 mr-2">Filter:</span>
                    <a
                        href={`/events?tab=${activeTab}`}
                        className="tag tag-neutral hover:bg-ink-200 transition-colors"
                    >
                        All
                    </a>
                    {categories?.slice(0, 4).map((cat) => (
                        <a
                            key={cat.id}
                            href={`/events?tab=${activeTab}&category=${cat.id}`}
                            className="tag tag-neutral hover:bg-ink-200 transition-colors"
                        >
                            {cat.icon} {cat.name}
                        </a>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {events && events.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event, index) => (
                        <div
                            key={event.id}
                            className="opacity-0 animate-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <EventCard
                                event={event as any}
                                userVote={userVotes[event.id]}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 card-sharp bg-white">
                    <div className="w-12 h-12 bg-ink-100 rounded flex items-center justify-center mx-auto mb-4">
                        {activeTab === 'active' ? (
                            <TrendingUp className="w-6 h-6 text-ink-400" />
                        ) : (
                            <Clock className="w-6 h-6 text-ink-400" />
                        )}
                    </div>
                    <h3 className="font-medium mb-1">
                        {activeTab === 'active' ? 'No Active Markets' : 'No Settled Markets'}
                    </h3>
                    <p className="text-sm text-ink-500">
                        {activeTab === 'active'
                            ? 'Check back soon for new prediction opportunities.'
                            : 'Settled markets will appear here.'}
                    </p>
                </div>
            )}
        </div>
    );
}
