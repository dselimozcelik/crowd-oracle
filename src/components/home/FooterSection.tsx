'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Github, Linkedin } from 'lucide-react';

// Custom X (Twitter) icon since Lucide doesn't have it
function XIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}
import Link from 'next/link';
import { springs, fadeUp, floatAnimation, viewportOnce } from '@/lib/animations';

export function FooterSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <footer className="relative">
            {/* CTA Section - Light, clean */}
            <section className="relative section-accent py-24 overflow-hidden">
                {/* Decorative floating blur blob */}
                <motion.div
                    className="blur-blob blur-blob-signal w-[400px] h-[400px] bottom-0 left-1/3"
                    variants={floatAnimation}
                    initial="initial"
                    animate={shouldReduceMotion ? {} : "animate"}
                />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="max-w-2xl mx-auto text-center"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-ink-950 mb-6 tracking-tight leading-tight">
                            Başlamaya<br />
                            <span className="text-signal">hazır mısınız?</span>
                        </h2>

                        <p className="text-ink-600 text-lg mb-10 max-w-lg mx-auto">
                            Geçmişlerini oluşturan ve etki kazanan binlerce tahminleyiciye katılın.
                        </p>

                        {/* Animated CTA button with pulse glow */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={springs.snappy}
                        >
                            <motion.div
                                animate={shouldReduceMotion ? {} : {
                                    boxShadow: [
                                        '0 0 20px rgba(0, 210, 106, 0.3)',
                                        '0 0 40px rgba(0, 210, 106, 0.5)',
                                        '0 0 20px rgba(0, 210, 106, 0.3)',
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                className="inline-block rounded-md"
                            >
                                <Link
                                    href="/signup"
                                    className="group inline-flex items-center gap-2 px-8 py-4 bg-signal text-white rounded-md font-bold text-lg tracking-wide hover:brightness-110 transition-all"
                                >
                                    Ücretsiz Hesap Oluştur
                                    <motion.span
                                        animate={shouldReduceMotion ? {} : { x: [0, 4, 0] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.span>
                                </Link>
                            </motion.div>
                        </motion.div>

                        <p className="mt-6 text-xs text-ink-400 font-mono tracking-wider uppercase">
                            Kredi kartı gerekmez
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer Links - Subtle top border, light background */}
            <motion.div
                className="border-t border-ink-200 bg-white/60"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6 }}
            >
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-signal"
                                    animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-xl font-display font-bold text-ink-950 tracking-tight">
                                    Referandum
                                </span>
                            </div>
                            <p className="text-ink-500 text-sm max-w-xs leading-relaxed">
                                Gürültüdeki Sinyal. Küresel sonuçları uzmanlardan daha yüksek doğrulukla tahmin etmek için kolektif zekayı topluyoruz.
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <SocialLink href="#" icon={<XIcon className="w-4 h-4" />} />
                                <SocialLink href="#" icon={<Github className="w-4 h-4" />} />
                                <SocialLink href="#" icon={<Linkedin className="w-4 h-4" />} />
                            </div>
                        </div>

                        {/* Link Columns */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-mono font-semibold text-ink-400 uppercase tracking-widest">Platform</h4>
                            <ul className="space-y-2 text-sm">
                                <FooterLink href="/events">Canlı Piyasalar</FooterLink>
                                <FooterLink href="/leaderboard">Liderlik Tablosu</FooterLink>
                                <FooterLink href="#">Piyasa Oluştur</FooterLink>
                                <FooterLink href="#">API</FooterLink>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-mono font-semibold text-ink-400 uppercase tracking-widest">Şirket</h4>
                            <ul className="space-y-2 text-sm">
                                <FooterLink href="#">Hakkımızda</FooterLink>
                                <FooterLink href="#">Metodoloji</FooterLink>
                                <FooterLink href="#">Hizmet Koşulları</FooterLink>
                                <FooterLink href="#">Gizlilik Politikası</FooterLink>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="pt-8 border-t border-ink-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ink-400 font-mono">
                        <p>© 2026 Referandum Inc. Tüm hakları saklıdır.</p>
                        <div className="flex gap-8">
                            <span>İstanbul, Türkiye</span>
                            <span className="flex items-center gap-2">
                                <motion.span
                                    className="w-2 h-2 rounded-full bg-signal"
                                    animate={shouldReduceMotion ? {} : { opacity: [1, 0.4, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                Sistemler Normal
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="relative text-ink-500 hover:text-signal transition-colors group">
                {children}
                <motion.span
                    className="absolute -bottom-0.5 left-0 h-px bg-signal"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.2 }}
                />
            </Link>
        </li>
    )
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
    return (
        <motion.div
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snappy}
        >
            <Link href={href} className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 hover:bg-signal hover:text-white transition-all">
                {icon}
            </Link>
        </motion.div>
    )
}
