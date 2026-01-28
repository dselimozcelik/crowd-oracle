import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
    BarChart3,
    Calendar,
    Users,
    TrendingUp,
    Plus,
    ChevronRight,
    CheckCircle,
    Clock,
    AlertCircle,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlatformStats {
    total_users: number;
    active_events: number;
    total_votes: number;
    platform_accuracy_pct: number;
}

interface EventWithCategory {
    id: string;
    title: string;
    status: string;
    yes_count: number;
    no_count: number;
    category: { name: string; icon: string } | null;
}

export default async function AdminDashboard() {
    const supabase = await createClient();

    const { data: platformStatsData } = await (supabase
        .from('platform_stats') as any)
        .select('*')
        .single();

    const platformStats = platformStatsData as PlatformStats | null;

    const { data: pendingEventsData } = await (supabase
        .from('events') as any)
        .select(`
      *,
      category:categories(name, icon)
    `)
        .eq('status', 'closed')
        .order('deadline', { ascending: true })
        .limit(5);

    const pendingEvents = pendingEventsData as EventWithCategory[] | null;

    const { data: recentEventsData } = await (supabase
        .from('events') as any)
        .select(`
      *,
      category:categories(name, icon)
    `)
        .order('created_at', { ascending: false })
        .limit(5);

    const recentEvents = recentEventsData as EventWithCategory[] | null;

    const statusStyles: Record<string, string> = {
        active: 'bg-yes-muted text-yes border-yes-dim',
        settled: 'bg-signal-muted text-signal border-signal-dim',
        closed: 'bg-amber-dim text-amber-700 border-amber',
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="data-label text-ink-400 mb-2">Administration</p>
                    <h1 className="font-display text-3xl headline flex items-center gap-3">
                        <Shield className="w-6 h-6 text-ink-400" />
                        Admin Dashboard
                    </h1>
                </div>
                <Link
                    href="/admin/events/new"
                    className="btn-signal px-4 py-2 text-sm inline-flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create Event
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card-sharp bg-white p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-4 h-4 text-ink-400" />
                        <span className="data-label text-ink-400">Users</span>
                    </div>
                    <span className="data-value text-2xl">{platformStats?.total_users || 0}</span>
                </div>
                <div className="card-sharp bg-white p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-4 h-4 text-ink-400" />
                        <span className="data-label text-ink-400">Active</span>
                    </div>
                    <span className="data-value text-2xl">{platformStats?.active_events || 0}</span>
                </div>
                <div className="card-sharp bg-white p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="w-4 h-4 text-ink-400" />
                        <span className="data-label text-ink-400">Votes</span>
                    </div>
                    <span className="data-value text-2xl">{platformStats?.total_votes || 0}</span>
                </div>
                <div className="card-sharp bg-white p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-4 h-4 text-ink-400" />
                        <span className="data-label text-ink-400">Accuracy</span>
                    </div>
                    <span className="data-value text-2xl text-yes">{platformStats?.platform_accuracy_pct || 0}%</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Pending Settlements */}
                <div className="card-sharp bg-white overflow-hidden border-l-2 border-l-amber">
                    <div className="p-4 border-b border-ink-100 flex items-center justify-between">
                        <h2 className="font-medium flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber" />
                            Pending Settlements
                        </h2>
                        <Link href="/admin/events?status=closed" className="text-sm text-ink-500 hover:text-ink-700 flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {pendingEvents && pendingEvents.length > 0 ? (
                        <div>
                            {pendingEvents.map((event, i) => (
                                <Link
                                    key={event.id}
                                    href={`/admin/events/${event.id}/settle`}
                                    className={cn(
                                        "flex items-center justify-between p-4 hover:bg-ink-50 transition-colors",
                                        i < pendingEvents.length - 1 && "border-b border-ink-100"
                                    )}
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm line-clamp-1 mb-1">{event.title}</p>
                                        <p className="text-xs text-ink-500">
                                            {event.category?.icon} {event.category?.name} · <span className="data-value">{event.yes_count + event.no_count}</span> votes
                                        </p>
                                    </div>
                                    <span className="tag bg-amber-dim text-amber-700 border-amber">
                                        Settle
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-ink-500">
                            <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No events pending settlement</p>
                        </div>
                    )}
                </div>

                {/* Recent Events */}
                <div className="card-sharp bg-white overflow-hidden">
                    <div className="p-4 border-b border-ink-100 flex items-center justify-between">
                        <h2 className="font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4 text-ink-400" />
                            Recent Events
                        </h2>
                        <Link href="/admin/events" className="text-sm text-ink-500 hover:text-ink-700 flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {recentEvents && recentEvents.length > 0 ? (
                        <div>
                            {recentEvents.map((event, i) => (
                                <Link
                                    key={event.id}
                                    href={`/admin/events/${event.id}`}
                                    className={cn(
                                        "flex items-center justify-between p-4 hover:bg-ink-50 transition-colors",
                                        i < recentEvents.length - 1 && "border-b border-ink-100"
                                    )}
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm line-clamp-1 mb-1">{event.title}</p>
                                        <p className="text-xs text-ink-500">
                                            {event.category?.icon} {event.category?.name}
                                        </p>
                                    </div>
                                    <span className={cn(
                                        "tag capitalize",
                                        statusStyles[event.status] || "tag-neutral"
                                    )}>
                                        {event.status}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-ink-500">
                            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No events yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
                <Link href="/admin/events" className="card-sharp card-interactive bg-white p-6 text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-3 text-ink-400" />
                    <p className="font-medium">Manage Events</p>
                </Link>
                <Link href="/admin/analytics" className="card-sharp card-interactive bg-white p-6 text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-3 text-ink-400" />
                    <p className="font-medium">B2B Analytics</p>
                </Link>
                <Link href="/admin/events/new" className="card-sharp card-interactive bg-white p-6 text-center">
                    <Plus className="w-8 h-8 mx-auto mb-3 text-ink-400" />
                    <p className="font-medium">Create Event</p>
                </Link>
            </div>
        </div>
    );
}
