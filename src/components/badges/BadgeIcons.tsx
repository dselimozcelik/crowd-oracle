'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Badge icon mapping with custom SVG icons
const BadgeIcons: Record<string, React.FC<{ className?: string }>> = {
    // Streak icons
    '🔥': FlameIcon,
    '⚡': BoltIcon,
    '🌟': StarIcon,
    '💫': SparkleIcon,

    // Milestone icons  
    '🎯': TargetIcon,
    '🏆': TrophyIcon,
    '👑': CrownIcon,
    '📊': ChartIcon,

    // Accuracy icons
    '👁️': EyeIcon,
    '🎖️': MedalIcon,
    '💎': DiamondIcon,
    '🔮': CrystalIcon,

    // Ranking icons
    '🥇': Medal1Icon,
    '🥈': Medal2Icon,
    '🥉': Medal3Icon,
    '🏅': BadgeMedalIcon,
};

// Tier gradient backgrounds for medallions
const tierGradients = {
    bronze: 'from-amber-600 to-amber-800',
    silver: 'from-gray-300 to-gray-500',
    gold: 'from-yellow-400 to-amber-500',
    platinum: 'from-violet-300 to-indigo-400',
};

const tierRings = {
    bronze: 'ring-amber-600/30',
    silver: 'ring-gray-400/30',
    gold: 'ring-yellow-500/30',
    platinum: 'ring-violet-400/30',
};

interface BadgeIconProps {
    icon: string;
    tier: string;
    isLocked?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function BadgeIcon({ icon, tier, isLocked = false, size = 'md' }: BadgeIconProps) {
    const IconComponent = BadgeIcons[icon] || DefaultBadgeIcon;
    const gradient = tierGradients[tier as keyof typeof tierGradients] || tierGradients.bronze;
    const ring = tierRings[tier as keyof typeof tierRings] || tierRings.bronze;

    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-14 h-14',
        lg: 'w-20 h-20',
    };

    const iconSizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-7 h-7',
        lg: 'w-10 h-10',
    };

    return (
        <div className={cn(
            "relative rounded-full flex items-center justify-center ring-2 transition-all",
            sizeClasses[size],
            isLocked
                ? "bg-gradient-to-br from-gray-200 to-gray-300 ring-gray-300/30"
                : `bg-gradient-to-br ${gradient} ${ring} shadow-lg`,
            !isLocked && "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]"
        )}>
            {/* Inner medallion circle */}
            <div className={cn(
                "absolute inset-1 rounded-full",
                isLocked ? "bg-gray-100" : "bg-white/20"
            )} />

            {/* Icon */}
            <IconComponent className={cn(
                "relative z-10",
                iconSizeClasses[size],
                isLocked ? "text-gray-400" : "text-white drop-shadow-md"
            )} />

            {/* Locked overlay */}
            {isLocked && (
                <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.03)_4px,rgba(0,0,0,0.03)_8px)]" />
            )}

            {/* Shine effect for unlocked */}
            {!isLocked && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent" />
            )}
        </div>
    );
}

// Custom SVG Icons

function FlameIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 23c-3.866 0-7-2.686-7-6 0-2.627 1.666-4.944 3.5-6.5-.166 1.667.5 3 1.5 4 .5-2 1.5-3.5 3-5 0 2.5 1 4 2.5 5.5 1-1 1.5-2.5 1.5-4 2 1.5 2 4.5 2 6 0 3.314-3.134 6-7 6zm0-4c-1.657 0-3 1.119-3 2.5s1.343 2.5 3 2.5 3-1.119 3-2.5-1.343-2.5-3-2.5z" />
        </svg>
    );
}

function BoltIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
    );
}

function StarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );
}

function SparkleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3zM5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75L5 3zM19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z" />
        </svg>
    );
}

function TargetIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );
}

function TrophyIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 15c-4 0-4 3-4 3v1h8v-1s0-3-4-3zm0-2c2.21 0 4-1.79 4-4V4H8v5c0 2.21 1.79 4 4 4zM5 4h2v4c0 .41.04.81.12 1.2-.93-.5-1.62-1.42-1.62-2.5V4H5c-.55 0-1-.45-1-1s.45-1 1-1h14c.55 0 1 .45 1 1s-.45 1-1 1h-.5v2.7c0 1.08-.69 2-1.62 2.5.08-.39.12-.79.12-1.2V4h2v5c0 2.76-2.24 5-5 5v2c0 1.1.9 2 2 2h1v2H7v-2h1c1.1 0 2-.9 2-2v-2c-2.76 0-5-2.24-5-5V4z" />
        </svg>
    );
}

function CrownIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z" />
        </svg>
    );
}

function ChartIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3v18h18v-2H5V3H3zm16 6l-4 4-3-3-4 4v2l4-4 3 3 6-6V7z" />
        </svg>
    );
}

function EyeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
    );
}

function MedalIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L9 7H6l1.5 3L6 14h3l3 5 3-5h3l-1.5-4L19 7h-3L12 2zm0 5.5l1 2h2l-1.5 2 .5 2.5-2-1.5-2 1.5.5-2.5-1.5-2h2l1-2z" />
        </svg>
    );
}

function DiamondIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2l-4 6 10 14L22 8l-4-6H6zm12.5 5.5L12 18.25 5.5 7.5l1.5-2.5h10l1.5 2.5z" />
        </svg>
    );
}

function CrystalIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 8l8 14 8-14-8-6zm0 3l4.5 3.38L12 17.5 7.5 8.38 12 5z" />
        </svg>
    );
}

function Medal1Icon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="14" r="7" />
            <path d="M8 2l2 5h4l2-5H8zm4 10v4" />
            <text x="12" y="17" textAnchor="middle" fontSize="6" fill="currentColor" className="font-bold">1</text>
        </svg>
    );
}

function Medal2Icon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="14" r="7" />
            <path d="M8 2l2 5h4l2-5H8z" />
        </svg>
    );
}

function Medal3Icon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="14" r="7" />
            <path d="M8 2l2 5h4l2-5H8z" />
        </svg>
    );
}

function BadgeMedalIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="14" r="6" />
            <path d="M9 2v6h6V2L12 5 9 2z" />
        </svg>
    );
}

function DefaultBadgeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );
}

// Tier badge ribbon component
interface TierRibbonProps {
    tier: string;
}

export function TierRibbon({ tier }: TierRibbonProps) {
    const tierColors = {
        bronze: 'bg-amber-600 text-amber-50',
        silver: 'bg-gray-400 text-white',
        gold: 'bg-yellow-500 text-yellow-900',
        platinum: 'bg-violet-500 text-white',
    };

    const color = tierColors[tier as keyof typeof tierColors] || tierColors.bronze;

    return (
        <span className={cn(
            "absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm",
            color
        )}>
            {tier}
        </span>
    );
}
