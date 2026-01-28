'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface ProfileData {
    trust_score: number;
    is_banned: boolean;
}

interface EventData {
    id: string;
    status: string;
    deadline: string;
}

export async function castVote(
    eventId: string,
    prediction: boolean,
    confidenceLevel: 'low' | 'medium' | 'high' = 'medium'
) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Get user profile for trust score
    const { data } = await (supabase
        .from('profiles') as any)
        .select('trust_score, is_banned')
        .eq('id', user.id)
        .single();

    const profile = data as ProfileData | null;

    if (!profile) {
        return { error: 'Profile not found' };
    }

    if (profile.is_banned) {
        return { error: 'Your account has been suspended' };
    }

    // Check if event is active
    const { data: eventData } = await (supabase
        .from('events') as any)
        .select('id, status, deadline')
        .eq('id', eventId)
        .single();

    const event = eventData as EventData | null;

    if (!event) {
        return { error: 'Event not found' };
    }

    if (event.status !== 'active') {
        return { error: 'This event is no longer accepting votes' };
    }

    if (new Date(event.deadline) < new Date()) {
        return { error: 'Voting deadline has passed' };
    }

    // Check if already voted
    const { data: existingVote } = await (supabase
        .from('votes') as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .single();

    if (existingVote) {
        return { error: 'You have already voted on this event' };
    }

    // Cast vote
    const { error } = await (supabase
        .from('votes') as any)
        .insert({
            user_id: user.id,
            event_id: eventId,
            prediction,
            trust_score_at_vote: profile.trust_score,
            confidence_level: confidenceLevel,
        });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/events');
    revalidatePath(`/events/${eventId}`);

    return { success: true };
}

export async function getUserVoteForEvent(eventId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: vote } = await (supabase
        .from('votes') as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .single();

    return vote;
}
