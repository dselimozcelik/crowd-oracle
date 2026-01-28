import { createClient } from '@/lib/supabase/server';
import { EventForm } from '@/components/admin/EventForm';

export default async function NewEventPage() {
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

    return <EventForm categories={categories || []} />;
}
