import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, BarChart3, TrendingUp, Users, CheckCircle } from 'lucide-react';

interface EventAnalytics {
    id: string;
    title: string;
    status: string;
    outcome: boolean | null;
    category_name: string;
    total_votes: number;
    raw_yes_pct: number;
    weighted_yes_pct: number;
    weighted_prediction_correct: boolean | null;
}

interface PlatformStats {
    total_users: number;
    active_events: number;
    total_votes: number;
}

export default async function AnalyticsPage() {
    const supabase = await createClient();

    // Get event analytics
    const { data } = await (supabase
        .from('event_analytics') as any)
        .select('*')
        .in('status', ['settled'])
        .order('settled_at', { ascending: false })
        .limit(20);

    const analytics = data as EventAnalytics[] | null;

    // Get platform stats
    const { data: statsData } = await (supabase
        .from('platform_stats') as any)
        .select('*')
        .single();

    const platformStats = statsData as PlatformStats | null;

    // Calculate accuracy metrics
    const settledEvents = analytics || [];
    const correctPredictions = settledEvents.filter(e => e.weighted_prediction_correct).length;
    const platformAccuracy = settledEvents.length > 0
        ? (correctPredictions / settledEvents.length) * 100
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Dashboard
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-oracle-400" />
                        B2B Analytics
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Weighted vs Raw prediction accuracy analysis
                    </p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="glass">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-oracle-500/20">
                                <TrendingUp className="w-6 h-6 text-oracle-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{platformAccuracy.toFixed(1)}%</div>
                                <div className="text-sm text-muted-foreground">Weighted Accuracy</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-green-500/20">
                                <CheckCircle className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{correctPredictions}</div>
                                <div className="text-sm text-muted-foreground">Correct Predictions</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-blue-500/20">
                                <BarChart3 className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{settledEvents.length}</div>
                                <div className="text-sm text-muted-foreground">Settled Events</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-purple-500/20">
                                <Users className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{platformStats?.total_users || 0}</div>
                                <div className="text-sm text-muted-foreground">Total Forecasters</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Key Insight */}
            <Card className="glass border-oracle-500/30 mb-8">
                <CardContent className="py-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl gradient-oracle">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Weighted Predictions Outperform Raw Votes</h3>
                            <p className="text-muted-foreground">
                                By weighting votes based on user accuracy history (Trust Score), our predictions
                                consistently outperform simple majority voting. This is the core value proposition
                                for B2B clients seeking high-accuracy predictive data.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Event Analytics Table */}
            <Card className="glass">
                <CardHeader>
                    <CardTitle>Event Results: Weighted vs Raw</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-center">Votes</TableHead>
                                <TableHead className="text-center">Raw Yes%</TableHead>
                                <TableHead className="text-center">Weighted Yes%</TableHead>
                                <TableHead className="text-center">Outcome</TableHead>
                                <TableHead className="text-center">Weighted Correct?</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {settledEvents.map((event) => {
                                return (
                                    <TableRow key={event.id}>
                                        <TableCell className="max-w-xs">
                                            <div className="font-medium line-clamp-1">{event.title}</div>
                                        </TableCell>
                                        <TableCell>{event.category_name}</TableCell>
                                        <TableCell className="text-center">{event.total_votes}</TableCell>
                                        <TableCell className="text-center">
                                            <span className={event.raw_yes_pct > 50 ? 'text-yes' : 'text-no'}>
                                                {event.raw_yes_pct}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`font-medium ${event.weighted_yes_pct > 50 ? 'text-yes' : 'text-no'}`}>
                                                {event.weighted_yes_pct}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={event.outcome ? 'default' : 'secondary'}>
                                                {event.outcome ? 'YES' : 'NO'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {event.weighted_prediction_correct ? (
                                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                                    ✓ Correct
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                                    ✗ Wrong
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                            {settledEvents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No settled events yet. Analytics will appear once events are resolved.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Export Note */}
            <div className="mt-6 p-4 rounded-lg bg-background/50 text-center text-sm text-muted-foreground">
                <p>
                    For full demographic breakdowns and custom reports, contact us for B2B API access.
                </p>
            </div>
        </div>
    );
}
