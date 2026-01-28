import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BadgesClient } from '@/components/badges/BadgesClient';

interface BadgeData {
    id: string;
    name: string;
    description: string;
    icon: string;
    tier: string;
    criteria_type: string;
    criteria_value: number;
}

interface UserBadgeData {
    badge_id: string;
    earned_at: string;
}

export default async function BadgesPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: badgesData } = await (supabase
        .from('badges') as any)
        .select('*')
        .order('tier')
        .order('criteria_value');

    const allBadges = (badgesData as BadgeData[] | null) || [];

    const { data: userBadgesData } = await (supabase
        .from('user_badges') as any)
        .select('badge_id, earned_at')
        .eq('user_id', user.id);

    const userBadges = userBadgesData as UserBadgeData[] | null;

    const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);
    const earnedBadgeMap = new Map(userBadges?.map(ub => [ub.badge_id, ub.earned_at]) || []);

    return (
        <BadgesClient
            allBadges={allBadges}
            earnedBadgeIds={earnedBadgeIds}
            earnedBadgeMap={earnedBadgeMap}
        />
    );
}
