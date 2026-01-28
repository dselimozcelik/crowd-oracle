import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { EventForm } from '@/components/admin/EventForm';

export default async function EditEventPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !event) {
        notFound();
    }

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

    return <EventForm event={event} categories={categories || []} isEdit />;
}
