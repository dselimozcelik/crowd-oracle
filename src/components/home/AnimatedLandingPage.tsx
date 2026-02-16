'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { TrendingMarquee } from '@/components/home/TrendingMarquee';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { FooterSection } from '@/components/home/FooterSection';
import {
    springs,
    fadeUp,
    fadeUpStagger,
    slideFromRight,
    staggerContainer,
    staggerItem,
    floatAnimation,
    floatAnimationSlow,
    viewportOnce
} from '@/lib/animations';

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, start: boolean = true) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, start]);

    return count;
}

// Animated stat display
function AnimatedStat({ label, value, suffix = '', isVisible }: {
    label: string;
    value: number;
    suffix?: string;
    isVisible: boolean;
}) {
    const count = useCountUp(value, 1500, isVisible);

    return (
        <div className="flex justify-between items-baseline border-b border-ink-100 pb-4 last:border-0 last:pb-0">
            <span className="text-sm text-ink-500">{label}</span>
            <span className="data-value text-2xl font-medium">
                {count.toLocaleString()}{suffix}
            </span>
        </div>
    );
}

// Animated nav link with underline
function AnimatedNavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="relative text-sm text-ink-600 hover:text-ink-950 transition-colors group">
            {children}
            <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-signal"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.2 }}
            />
        </Link>
    );
}

// Animated button with scale and glow
function AnimatedButton({ href, variant = 'primary', children }: {
    href: string;
    variant?: 'primary' | 'outline';
    children: React.ReactNode;
}) {
    const baseClass = variant === 'primary'
        ? 'btn-signal px-6 py-3 text-sm inline-flex items-center gap-2'
        : 'btn-outline px-6 py-3 text-sm inline-flex items-center gap-2';

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={springs.snappy}
        >
            <Link href={href} className={baseClass}>
                {children}
            </Link>
        </motion.div>
    );
}

// Animated card with hover lift
function AnimatedCard({ children, className = '', delay = 0 }: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            variants={fadeUpStagger}
            custom={delay}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            whileHover={{
                y: -4,
                boxShadow: '0 12px 40px -12px rgba(0,0,0,0.15)',
                borderColor: 'rgba(0, 210, 106, 0.3)',
            }}
            transition={springs.gentle}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function AnimatedLandingPage() {
    const shouldReduceMotion = useReducedMotion();
    const [statsVisible, setStatsVisible] = useState(false);

    // Disable animations if user prefers reduced motion
    const motionProps = shouldReduceMotion ? {} : undefined;

    return (
        <div className="min-h-screen bg-background relative grain-overlay">
            {/* Ticker */}
            <TrendingMarquee />

            {/* Nav */}
            <motion.nav
                className="border-b border-ink-200"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <motion.div
                            className="w-2 h-2 bg-signal rounded-full"
                            animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="font-display text-xl tracking-tight">Referandum</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <AnimatedNavLink href="/events">Piyasalar</AnimatedNavLink>
                        <AnimatedNavLink href="/leaderboard">Liderlik Tablosu</AnimatedNavLink>
                        <div className="h-4 w-px bg-ink-200" />
                        <AnimatedNavLink href="/login">Giriş Yap</AnimatedNavLink>
                        <AnimatedButton href="/signup" variant="primary">
                            Başla
                        </AnimatedButton>
                    </div>
                </div>
            </motion.nav>

            {/* Green blur blob - positioned at viewport left edge */}
            <motion.div
                className="fixed top-0 left-0 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/4 pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(circle, rgba(0, 210, 106, 0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
                variants={floatAnimationSlow}
                initial="initial"
                animate={shouldReduceMotion ? {} : "animate"}
            />

            {/* Hero - Asymmetric layout with offset elements */}
            <section className="relative max-w-6xl mx-auto px-4 pt-24 pb-32 overflow-hidden z-10">
                {/* Warm blur blob (right side) */}
                <motion.div
                    className="blur-blob blur-blob-warm w-[400px] h-[400px] top-40 right-0"
                    variants={floatAnimation}
                    initial="initial"
                    animate={shouldReduceMotion ? {} : "animate"}
                />

                <div className="relative grid grid-cols-12 gap-8 items-start">
                    {/* Left column - headline with staggered animation */}
                    <div className="col-span-12 lg:col-span-6 lg:pr-8">
                        <motion.p
                            className="data-label text-ink-500 mb-4"
                            variants={fadeUpStagger}
                            custom={0}
                            initial="hidden"
                            animate="visible"
                        >
                            Tahmin Piyasaları
                        </motion.p>
                        <motion.h1
                            className="font-display text-5xl lg:text-6xl headline mb-6"
                            variants={fadeUpStagger}
                            custom={1}
                            initial="hidden"
                            animate="visible"
                        >
                            Gelecek, kalabalık<br />tarafından fiyatlandırılıyor
                        </motion.h1>
                        <motion.p
                            className="text-xl text-ink-600 subhead max-w-md mb-10"
                            variants={fadeUpStagger}
                            custom={2}
                            initial="hidden"
                            animate="visible"
                        >
                            Gerçek dünya olayları hakkında tahminlerde bulunun. Geçmişinizi oluşturun.
                            En doğru tahminleyiciler zirveye çıkar.
                        </motion.p>
                        <motion.div
                            className="flex items-center gap-4"
                            variants={fadeUpStagger}
                            custom={3}
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatedButton href="/signup" variant="primary">
                                Tahmin Yapmaya Başla
                                <ArrowRight className="w-4 h-4" />
                            </AnimatedButton>
                            <AnimatedButton href="/events" variant="outline">
                                Piyasalara Göz At
                            </AnimatedButton>
                        </motion.div>
                    </div>

                    {/* Right column - stats card with slide-in animation */}
                    <motion.div
                        className="col-span-12 lg:col-span-6 lg:mt-16"
                        variants={slideFromRight}
                        initial="hidden"
                        animate="visible"
                        onAnimationComplete={() => setStatsVisible(true)}
                    >
                        <motion.div
                            className="card-sharp card-elevated bg-white p-6 shadow-organic"
                            whileHover={shouldReduceMotion ? {} : { rotate: 0 }}
                            initial={{ rotate: 0.5 }}
                            transition={springs.gentle}
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <motion.div
                                    className="w-2 h-2 bg-no rounded-full"
                                    animate={shouldReduceMotion ? {} : { opacity: [1, 0.4, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="data-label text-ink-500">Canlı Platform İstatistikleri</span>
                            </div>
                            <div className="space-y-5">
                                <AnimatedStat label="Aktif Piyasalar" value={47} isVisible={statsVisible} />
                                <AnimatedStat label="Toplam Tahmin" value={128493} isVisible={statsVisible} />
                                <div className="flex justify-between items-baseline border-b border-ink-100 pb-4">
                                    <span className="text-sm text-ink-500">Platform Doğruluğu</span>
                                    <span className="data-value text-2xl font-medium text-yes">
                                        {statsVisible ? '78.4%' : '0%'}
                                    </span>
                                </div>
                                <AnimatedStat label="Aktif Tahminleyiciler" value={3241} isVisible={statsVisible} />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Scrolling Banner */}
            <FeaturedCarousel />

            {/* How it works - Staggered zigzag layout */}
            <section className="relative max-w-6xl mx-auto px-4 py-28">
                {/* Decorative elements */}
                <motion.div
                    className="blur-blob blur-blob-subtle w-[300px] h-[300px] top-0 right-20"
                    variants={floatAnimation}
                    initial="initial"
                    animate={shouldReduceMotion ? {} : "animate"}
                />

                <motion.div
                    className="relative grid grid-cols-12 gap-8 mb-16"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                >
                    <div className="col-span-12 lg:col-span-5">
                        <p className="data-label text-ink-400 mb-3">Nasıl Çalışır</p>
                        <h2 className="font-display text-3xl lg:text-4xl headline">
                            Doğruluk, etki demektir
                        </h2>
                    </div>
                    <div className="col-span-12 lg:col-span-7 lg:pl-8">
                        <p className="text-lg text-ink-600 subhead max-w-xl">
                            Basit anketlerin aksine, her oy tahminleyicinin geçmişine göre ağırlıklandırılır.
                            Kanıtlanmış uzmanlar nihai tahmin üzerinde daha fazla etkiye sahiptir.
                        </p>
                    </div>
                </motion.div>

                {/* Staggered cards with offset positioning */}
                <motion.div
                    className="relative grid grid-cols-1 md:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                >
                    <AnimatedCard
                        className="group relative p-6 bg-white border border-ink-200 rounded-lg transition-all duration-300 md:-translate-y-0"
                        delay={0}
                    >
                        <span className="text-5xl font-bold text-ink-100 group-hover:text-signal/30 transition-colors">01</span>
                        <h3 className="font-semibold text-xl mt-3 mb-3">Tahmin Yap</h3>
                        <p className="text-sm text-ink-500 leading-relaxed">
                            Gelecek olaylar için Evet veya Hayır oyu verin. Güven seviyenizi belirleyin.
                        </p>
                    </AnimatedCard>

                    <AnimatedCard
                        className="group relative p-6 bg-white border border-ink-200 rounded-lg transition-all duration-300 md:translate-y-8"
                        delay={1}
                    >
                        <span className="text-5xl font-bold text-ink-100 group-hover:text-signal/30 transition-colors">02</span>
                        <h3 className="font-semibold text-xl mt-3 mb-3">Puan Oluştur</h3>
                        <p className="text-sm text-ink-500 leading-relaxed">
                            Doğru tahminler güven puanınızı yükseltir. Yanlış olanlar düşürür.
                        </p>
                    </AnimatedCard>

                    <AnimatedCard
                        className="group relative p-6 bg-white border border-ink-200 rounded-lg transition-all duration-300 md:-translate-y-2"
                        delay={2}
                    >
                        <span className="text-5xl font-bold text-ink-100 group-hover:text-signal/30 transition-colors">03</span>
                        <h3 className="font-semibold text-xl mt-3 mb-3">Etki Kazan</h3>
                        <p className="text-sm text-ink-500 leading-relaxed">
                            Yüksek puanlar, oylarınızın tahminlerde daha fazla ağırlık taşıması anlamına gelir.
                        </p>
                    </AnimatedCard>
                </motion.div>
            </section>

            {/* Trust tiers - Asymmetric layout with decorative side element */}
            <section className="relative section-subtle py-24">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-12 gap-8 items-center">
                        {/* Left side - Decorative + text (narrower) */}
                        <motion.div
                            className="col-span-12 lg:col-span-4 relative"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            {/* Decorative dots pattern */}
                            <div className="absolute -left-8 top-8 w-32 h-32 dots-pattern opacity-50" />

                            <p className="data-label text-ink-400 mb-3">Güven Sistemi</p>
                            <h2 className="font-display text-3xl lg:text-4xl headline mb-6">
                                Beş seviye tahminleyici statüsü
                            </h2>
                            <p className="text-ink-600 subhead mb-8">
                                Herkes %50'den başlar. Zaman içindeki doğruluğunuz seviyenizi
                                ve oy ağırlığınızı belirler.
                            </p>

                        </motion.div>

                        {/* Right side - Table (wider) */}
                        <motion.div
                            className="col-span-12 lg:col-span-8"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            <div className="card-sharp bg-white overflow-hidden shadow-organic-up">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-ink-200 bg-ink-50">
                                            <th className="text-left p-4 data-label text-ink-500">Seviye</th>
                                            <th className="text-left p-4 data-label text-ink-500">Doğruluk</th>
                                            <th className="text-left p-4 data-label text-ink-500">Ağırlık</th>
                                        </tr>
                                    </thead>
                                    <motion.tbody
                                        variants={staggerContainer}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={viewportOnce}
                                    >
                                        {[
                                            { tier: 'Yeni', color: 'bg-ink-400', accuracy: '< 55%', weight: '0.5x' },
                                            { tier: 'Normal', color: 'bg-blue-500', accuracy: '55–65%', weight: '0.8x' },
                                            { tier: 'Güvenilir', color: 'bg-yes', accuracy: '65–75%', weight: '1.0x' },
                                            { tier: 'Uzman', color: 'bg-violet-500', accuracy: '75–85%', weight: '1.5x' },
                                            { tier: 'Süperkahin', color: 'bg-amber', accuracy: '> 85%', weight: '2.0x' },
                                        ].map((row, i) => (
                                            <motion.tr
                                                key={row.tier}
                                                className="border-b border-ink-100 last:border-0 hover:bg-ink-50/50 transition-colors"
                                                variants={staggerItem}
                                            >
                                                <td className="p-4 font-medium">
                                                    <span className="inline-flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${row.color}`} />
                                                        {row.tier}
                                                    </span>
                                                </td>
                                                <td className="p-4 data-value text-ink-600">{row.accuracy}</td>
                                                <td className="p-4 data-value text-ink-600">{row.weight}</td>
                                            </motion.tr>
                                        ))}
                                    </motion.tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <FooterSection />
        </div>
    );
}
