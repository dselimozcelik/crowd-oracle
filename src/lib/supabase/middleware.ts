import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session if expired
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes check
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup');
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/events') ||
        request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname.startsWith('/leaderboard') ||
        request.nextUrl.pathname.startsWith('/badges');
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

    // Redirect to login if accessing protected routes without auth
    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages AND from root
    if (user && (isAuthRoute || request.nextUrl.pathname === '/')) {
        return NextResponse.redirect(new URL('/markets', request.url));
    }

    // Admin route protection (check is_admin in profile)
    if (user && isAdminRoute) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (!profile?.is_admin) {
            return NextResponse.redirect(new URL('/events', request.url));
        }
    }

    return supabaseResponse;
}
