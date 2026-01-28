import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { SettleEventClient } from './SettleEventClient';

interface EventWithCategory {
    id: string;
    title: string;
    description: string | null;
    status: string;
    yes_count: number;
    no_count: number;
    weighted_yes: number;
    weighted_no: number;
    category: { name: string; icon: string; color: string } | null;
}

export default async function SettleEventPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: event, error } = await (supabase
        .from('events') as any)
        .select(`
      *,
      category:categories(*)
    `)
        .eq('id', id)
        .single();

    if (error || !event) {
        notFound();
    }

    const typedEvent = event as EventWithCategory;

    // Only allow settling closed events
    if (typedEvent.status !== 'closed') {
        redirect(`/admin/events/${id}`);
    }

    return <SettleEventClient event={typedEvent as any} />;
}
