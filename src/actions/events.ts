'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createEvent(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Check admin status
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    if (!(profile as { is_admin: boolean } | null)?.is_admin) {
        return { error: 'Not authorized' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('category_id') as string;
    const deadline = formData.get('deadline') as string;
    const resolutionDate = formData.get('resolution_date') as string;
    const status = formData.get('status') as string || 'draft';
    const isFeatured = formData.get('is_featured') === 'true';

    if (!title || !categoryId || !deadline) {
        return { error: 'Title, category, and deadline are required' };
    }

    const { data: event, error } = await (supabase
        .from('events') as any)
        .insert({
            title,
            description: description || null,
            category_id: categoryId,
            deadline,
            resolution_date: resolutionDate || null,
            status: status as 'draft' | 'active',
            is_featured: isFeatured,
            created_by: user.id,
        })
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/events');
    revalidatePath('/events');
    redirect(`/admin/events/${event.id}`);
}

export async function updateEvent(eventId: string, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    if (!(profile as { is_admin: boolean } | null)?.is_admin) {
        return { error: 'Not authorized' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('category_id') as string;
    const deadline = formData.get('deadline') as string;
    const resolutionDate = formData.get('resolution_date') as string;
    const status = formData.get('status') as string;
    const isFeatured = formData.get('is_featured') === 'true';

    const { error } = await (supabase
        .from('events') as any)
        .update({
            title,
            description: description || null,
            category_id: categoryId,
            deadline,
            resolution_date: resolutionDate || null,
            status: status as 'draft' | 'active' | 'closed',
            is_featured: isFeatured,
        })
        .eq('id', eventId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath(`/events/${eventId}`);

    return { success: true };
}

export async function settleEvent(eventId: string, outcome: boolean) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    if (!(profile as { is_admin: boolean } | null)?.is_admin) {
        return { error: 'Not authorized' };
    }

    // Call the settle_event function
    const { error } = await (supabase as any)
        .rpc('settle_event', {
            p_event_id: eventId,
            p_outcome: outcome,
            p_settled_by: user.id,
        });

    if (error) {
        return { error: error.message };
    }

    // Recalculate rankings after settling
    await (supabase as any).rpc('recalculate_rankings');

    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath(`/events/${eventId}`);
    revalidatePath('/leaderboard');

    return { success: true };
}
