'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TrendingUp, Trophy, Award, User, LogOut, Shield, ChevronDown, Home } from 'lucide-react';
import { signOut } from '@/actions/auth';
import { TrustScoreBadge } from '@/components/user/TrustScoreBadge';
import type { User as AuthUser } from '@supabase/supabase-js';
import type { Profile, UserStats } from '@/types/database';
import { cn } from '@/lib/utils';

interface HeaderProps {
    user: AuthUser;
    profile: Profile | null;
    stats: UserStats | null;
}

const navItems = [
    { href: '/markets', label: 'Markets', icon: TrendingUp },
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/badges', label: 'Badges', icon: Award },
];

export function Header({ user, profile, stats }: HeaderProps) {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-200 bg-white/80 border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="font-display text-lg tracking-tight transition-colors text-slate-900">CrowdOracle</span>
                </Link>

                {/* Nav */}
                <nav className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 text-sm transition-all rounded-lg",
                                    isActive
                                        ? "text-slate-900 bg-slate-100 font-medium border border-slate-200"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-4 h-4",
                                    isActive && "text-emerald-500"
                                )} />
                                <span className="hidden sm:inline">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Menu */}
                <div className="flex items-center gap-4">
                    {profile && (
                        <TrustScoreBadge
                            score={profile.trust_score}
                            showLabel
                            className="hidden md:flex"
                        />
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <Avatar className="h-8 w-8 rounded">
                                    <AvatarImage src={profile?.avatar_url || undefined} />
                                    <AvatarFallback className="bg-ink-100 text-ink-600 text-sm font-medium rounded">
                                        {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <ChevronDown className="w-3 h-3 text-ink-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-white border border-ink-200 rounded shadow-lg" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal px-3 py-2">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium text-ink-900">
                                        {profile?.username || 'User'}
                                    </p>
                                    <p className="text-xs text-ink-500">
                                        {user.email}
                                    </p>
                                    {stats && (
                                        <p className="text-xs text-ink-400 data-value mt-1">
                                            {stats.total_predictions} predictions · {stats.current_streak} streak
                                        </p>
                                    )}
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-ink-100" />
                            <DropdownMenuItem asChild className="px-3 py-2 hover:bg-ink-50 cursor-pointer">
                                <Link href="/profile" className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-ink-400" />
                                    <span className="text-sm">Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="px-3 py-2 hover:bg-ink-50 cursor-pointer">
                                <Link href="/badges" className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-ink-400" />
                                    <span className="text-sm">My Badges</span>
                                </Link>
                            </DropdownMenuItem>
                            {profile?.is_admin && (
                                <>
                                    <DropdownMenuSeparator className="bg-ink-100" />
                                    <DropdownMenuItem asChild className="px-3 py-2 hover:bg-ink-50 cursor-pointer">
                                        <Link href="/admin" className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-amber" />
                                            <span className="text-sm">Admin</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            )}
                            <DropdownMenuSeparator className="bg-ink-100" />
                            <DropdownMenuItem asChild className="px-3 py-2 hover:bg-ink-50 cursor-pointer">
                                <form action={signOut}>
                                    <button type="submit" className="flex items-center gap-2 w-full">
                                        <LogOut className="w-4 h-4 text-ink-400" />
                                        <span className="text-sm">Log out</span>
                                    </button>
                                </form>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
