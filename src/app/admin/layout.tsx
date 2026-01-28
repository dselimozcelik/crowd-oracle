import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface ProfileData {
    is_admin: boolean;
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if user is admin
    const { data: profileData } = await (supabase
        .from('profiles') as any)
        .select('is_admin')
        .eq('id', user.id)
        .single();

    const profile = profileData as ProfileData | null;

    if (!profile?.is_admin) {
        redirect('/events');
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border bg-red-500/10">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <span className="text-sm font-medium text-red-400">Admin Mode</span>
                </div>
            </div>
            {children}
        </div>
    );
}
