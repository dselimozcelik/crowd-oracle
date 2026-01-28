'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function signUp(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;

    if (!email || !password || !username) {
        return { error: 'All fields are required' };
    }

    if (username.length < 3 || username.length > 20) {
        return { error: 'Username must be 3-20 characters' };
    }

    if (password.length < 8) {
        return { error: 'Password must be at least 8 characters' };
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/events');
}

export async function signIn(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/events');
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signInWithGoogle() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    if (data.url) {
        redirect(data.url);
    }
}
