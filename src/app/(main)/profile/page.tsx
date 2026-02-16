import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrustScoreBadge } from '@/components/user/TrustScoreBadge';
import {
    TrendingUp,
    Target,
    Flame,
    Trophy,
    Calendar,
    Award,
    CheckCircle,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProfileData {
    username: string;
    avatar_url: string | null;
    trust_score: number;
    created_at: string;
}

interface UserStatsData {
    total_predictions: number;
    correct_predictions: number;
    current_streak: number;
    rank: number | null;
}

interface VoteData {
    id: string;
    prediction: boolean;
    is_correct: boolean | null;
    created_at: string;
    event: { title: string; status: string; outcome: boolean | null } | null;
}

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profileData } = await (supabase
        .from('profiles') as any)
        .select('*')
        .eq('id', user.id)
        .single();

    const profile = profileData as ProfileData | null;

    const { data: statsData } = await (supabase
        .from('user_stats') as any)
        .select('*')
        .eq('user_id', user.id)
        .single();

    const stats = statsData as UserStatsData | null;

    const { data: recentVotesData } = await (supabase
        .from('votes') as any)
        .select(`
      *,
      event:events(title, status, outcome)
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    const recentVotes = recentVotesData as VoteData[] | null;

    const { count: badgeCount } = await (supabase
        .from('user_badges') as any)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    const accuracyPct = stats && stats.total_predictions > 0
        ? (stats.correct_predictions / stats.total_predictions) * 100
        : 0;

    const trustScore = profile?.trust_score || 0.5;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <p className="data-label text-ink-400 mb-2">Hesap</p>
                <h1 className="font-display text-3xl headline">Profil</h1>
            </div>

            {/* Profile Card */}
            <div className="card-sharp bg-white p-6 mb-6">
                <div className="flex items-start gap-6">
                    <Avatar className="w-20 h-20 rounded">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-ink-100 text-ink-600 text-2xl font-medium rounded">
                            {profile?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-medium">{profile?.username}</h2>
                            <TrustScoreBadge score={trustScore} showLabel />
                        </div>
                        <p className="text-sm text-ink-500 mb-3">{user.email}</p>
                        <div className="flex items-center gap-4 text-sm text-ink-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                Katıldı {new Date(profile?.created_at || '').toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })}
                            </span>
                            {stats?.rank && (
                                <span className="flex items-center gap-1.5 text-amber font-medium">
                                    <Trophy className="w-4 h-4" />
                                    Sıralama #{stats.rank}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="card-sharp bg-white p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Target className="w-4 h-4 text-ink-400" />
                        <span className="data-label text-ink-400">Tahminler</span>
                    </div>
                    <span className="data-value text-2xl">{stats?.total_predictions || 0}</span>
                </div>
                <div className="card-sharp bg-white p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-4 h-4 text-ink-400" />
                        <span className="data-label text-ink-400">Doğruluk</span>
                    </div>
                    <span className="data-value text-2xl text-yes">{accuracyPct.toFixed(1)}%</span>
                </div>
                <div className="card-sharp bg-white p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Flame className="w-4 h-4 text-ink-400" />
                        <span className="data-label text-ink-400">Seri</span>
                    </div>
                    <span className="data-value text-2xl">{stats?.current_streak || 0}</span>
                </div>
                <div className="card-sharp bg-white p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="w-4 h-4 text-ink-400" />
                        <span className="data-label text-ink-400">Rozetler</span>
                    </div>
                    <span className="data-value text-2xl">{badgeCount || 0}</span>
                </div>
            </div>

            {/* Trust Score Progress */}
            <div className="card-sharp bg-white p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Güven Puanı</h3>
                    <span className="data-value text-xl">{(trustScore * 100).toFixed(1)}%</span>
                </div>
                <div className="progress-track mb-3">
                    <div
                        className="progress-yes"
                        style={{ width: `${trustScore * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs data-label">
                    <span className={cn(trustScore < 0.55 ? "text-ink-700" : "text-ink-400")}>Yeni</span>
                    <span className={cn(trustScore >= 0.55 && trustScore < 0.65 ? "text-ink-700" : "text-ink-400")}>Normal</span>
                    <span className={cn(trustScore >= 0.65 && trustScore < 0.75 ? "text-ink-700" : "text-ink-400")}>Güvenilir</span>
                    <span className={cn(trustScore >= 0.75 && trustScore < 0.85 ? "text-ink-700" : "text-ink-400")}>Uzman</span>
                    <span className={cn(trustScore >= 0.85 ? "text-amber" : "text-ink-400")}>Süper</span>
                </div>
            </div>

            {/* Recent Predictions */}
            <div className="card-sharp bg-white overflow-hidden">
                <div className="p-4 border-b border-ink-100">
                    <h3 className="font-medium">Son Tahminler</h3>
                </div>
                {recentVotes && recentVotes.length > 0 ? (
                    <div>
                        {recentVotes.map((vote, i) => (
                            <div
                                key={vote.id}
                                className={cn(
                                    "flex items-center justify-between p-4",
                                    i < recentVotes.length - 1 && "border-b border-ink-100"
                                )}
                            >
                                <div className="flex-grow min-w-0 mr-4">
                                    <p className="font-medium text-sm line-clamp-1 mb-1">
                                        {vote.event?.title}
                                    </p>
                                    <p className="text-xs text-ink-500 data-value">
                                        {new Date(vote.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "tag",
                                        vote.prediction
                                            ? "bg-yes-muted text-yes border-yes-dim"
                                            : "bg-no-muted text-no border-no-dim"
                                    )}>
                                        {vote.prediction ? 'Evet' : 'Hayır'}
                                    </span>
                                    {vote.is_correct !== null && (
                                        vote.is_correct
                                            ? <CheckCircle className="w-4 h-4 text-yes" />
                                            : <XCircle className="w-4 h-4 text-no" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-10 h-10 bg-ink-100 rounded flex items-center justify-center mx-auto mb-3">
                            <Target className="w-5 h-5 text-ink-400" />
                        </div>
                        <p className="text-sm text-ink-500 mb-4">Henüz tahmin yok</p>
                        <Link href="/events" className="btn-primary px-4 py-2 text-sm inline-block">
                            Piyasalara Göz At
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
