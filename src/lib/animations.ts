'use client';

import { motion, useReducedMotion, Variants } from 'framer-motion';

// Respect user's reduced motion preference
export function useMotionSafe() {
    const shouldReduceMotion = useReducedMotion();
    return !shouldReduceMotion;
}

// Spring configurations
export const springs = {
    gentle: { type: 'spring', stiffness: 100, damping: 15 } as const,
    snappy: { type: 'spring', stiffness: 200, damping: 20 } as const,
    bouncy: { type: 'spring', stiffness: 300, damping: 10 } as const,
};

// Common animation variants
export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: springs.gentle,
    },
};

export const fadeUpStagger: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            ...springs.gentle,
            delay: i * 0.1,
        },
    }),
};

export const slideFromRight: Variants = {
    hidden: { opacity: 0, x: 60, rotate: 3 },
    visible: {
        opacity: 1,
        x: 0,
        rotate: 0.5,
        transition: {
            ...springs.gentle,
            delay: 0.3,
        },
    },
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: springs.gentle,
    },
};

export const tableRowFromLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i: number = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            ...springs.gentle,
            delay: i * 0.08,
        },
    }),
};

export const tableRowFromRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: (i: number = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            ...springs.gentle,
            delay: i * 0.08,
        },
    }),
};

export const scaleOnHover = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: springs.snappy,
};

export const cardHover = {
    whileHover: {
        y: -4,
        boxShadow: '0 12px 40px -12px rgba(0,0,0,0.15)',
    },
    transition: springs.gentle,
};

export const floatAnimation: Variants = {
    initial: { y: 0 },
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export const floatAnimationSlow: Variants = {
    initial: { y: 0, x: 0 },
    animate: {
        y: [-15, 15, -15],
        x: [-5, 5, -5],
        transition: {
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export const pulseGlow: Variants = {
    initial: { boxShadow: '0 0 20px rgba(0, 210, 106, 0.3)' },
    animate: {
        boxShadow: [
            '0 0 20px rgba(0, 210, 106, 0.3)',
            '0 0 40px rgba(0, 210, 106, 0.5)',
            '0 0 20px rgba(0, 210, 106, 0.3)',
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

// Viewport settings for scroll animations
export const viewportOnce = { once: true, amount: 0.3 };
export const viewportRepeat = { amount: 0.3 };

// Re-export motion for convenience
export { motion };
