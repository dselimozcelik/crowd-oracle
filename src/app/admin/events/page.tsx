import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Calendar, ArrowLeft, Edit, Gavel } from 'lucide-react';

interface EventWithCategory {
    id: string;
    title: string;
    status: string;
    is_featured: boolean;
    yes_count: number;
    no_count: number;
    deadline: string;
    category: { name: string; icon: string } | null;
}

export default async function AdminEventsPage() {
    const supabase = await createClient();

    const { data } = await (supabase
        .from('events') as any)
        .select(`
      *,
      category:categories(name, icon)
    `)
        .order('created_at', { ascending: false });

    const events = data as EventWithCategory[] | null;

    const statusColors: Record<string, string> = {
        draft: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        active: 'bg-green-500/20 text-green-400 border-green-500/30',
        closed: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        settled: 'bg-oracle-500/20 text-oracle-400 border-oracle-500/30',
        cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Dashboard
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Manage Events</h1>
                        <p className="text-sm text-muted-foreground">
                            {events?.length || 0} total events
                        </p>
                    </div>
                </div>
                <Link href="/admin/events/new">
                    <Button className="gradient-oracle text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Event
                    </Button>
                </Link>
            </div>

            <Card className="glass">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Votes</TableHead>
                                <TableHead>Deadline</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events?.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>
                                        <div className="max-w-md">
                                            <div className="font-medium line-clamp-1">{event.title}</div>
                                            {event.is_featured && (
                                                <Badge variant="outline" className="text-xs mt-1">
                                                    Featured
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="whitespace-nowrap">
                                            {event.category?.icon} {event.category?.name}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={statusColors[event.status]}>
                                            {event.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {event.yes_count + event.no_count}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(event.deadline).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/events/${event.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            {event.status === 'closed' && (
                                                <Link href={`/admin/events/${event.id}/settle`}>
                                                    <Button variant="outline" size="sm" className="text-amber-400 border-amber-500/30">
                                                        <Gavel className="w-4 h-4 mr-1" />
                                                        Settle
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {(!events || events.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No events yet. Create your first event!</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
