'use client';

import { motion } from 'framer-motion';
import { Crown, Trophy, Medal, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function FooterSection() {
    return (
        <footer className="relative bg-[#020617] border-t border-white/5">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-[#020617] pointer-events-none" />

            {/* PART 1: THE PODIUM CTA */}
            <div className="relative pt-24 pb-32 overflow-hidden">
                <div className="container mx-auto px-4">

                    {/* Podium Visuals */}
                    <div className="flex justify-center items-end gap-4 mb-16 relative">
                        {/* 2nd Place (Silver) */}
                        <PodiumCard
                            rank={2}
                            username="@cryptowhale"
                            accuracy="89%"
                            color="from-slate-300 to-slate-400"
                            icon={<Medal className="w-5 h-5 text-slate-300" />}
                            delay={0.2}
                            height="h-32"
                        />

                        {/* 1st Place (Gold) */}
                        <PodiumCard
                            rank={1}
                            username="@predict_god"
                            accuracy="94%"
                            color="from-amber-300 to-amber-500"
                            icon={<Trophy className="w-6 h-6 text-amber-200" />}
                            delay={0}
                            height="h-40"
                            isWinner
                        />

                        {/* 3rd Place (Bronze) */}
                        <PodiumCard
                            rank={3}
                            username="@market_guru"
                            accuracy="85%"
                            color="from-orange-300 to-orange-400"
                            icon={<Medal className="w-5 h-5 text-orange-300" />}
                            delay={0.4}
                            height="h-28"
                        />
                    </div>

                    {/* CTA Content */}
                    <div className="text-center relative z-10 max-w-2xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight leading-tight"
                        >
                            Ready to beat <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">the market?</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-slate-400 text-lg mb-10 max-w-lg mx-auto"
                        >
                            Join 50,000+ forecasters predicting the future of Tech, Crypto, and Finance.
                        </motion.p>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-full font-bold text-lg tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:bg-emerald-400 transition-all"
                        >
                            Create Free Account
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

                            {/* Inner Glow */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                        </motion.button>

                        <p className="mt-6 text-xs text-slate-500 font-mono tracking-wider uppercase">
                            No credit card required
                        </p>
                    </div>
                </div>

                {/* Grid Effect Overlay */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] pointer-events-none" />
            </div>

            {/* PART 2: THE STANDARD FOOTER STRIP */}
            <div className="border-t border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                    <Crown className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-xl font-display font-bold text-white tracking-tight">
                                    CrowdOracle
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                                The Signal in the Noise. We aggregate collective intelligence to predict global outcomes with higher accuracy than experts.
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <SocialLink href="#" icon={<Twitter className="w-4 h-4" />} />
                                <SocialLink href="#" icon={<Github className="w-4 h-4" />} />
                                <SocialLink href="#" icon={<Linkedin className="w-4 h-4" />} />
                            </div>
                        </div>

                        {/* Link Columns */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-mono font-semibold text-white/40 uppercase tracking-widest">Platform</h4>
                            <ul className="space-y-2 text-sm">
                                <FooterLink href="#">Live Markets</FooterLink>
                                <FooterLink href="#">Leaderboard</FooterLink>
                                <FooterLink href="#">Create Market</FooterLink>
                                <FooterLink href="#">API</FooterLink>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-mono font-semibold text-white/40 uppercase tracking-widest">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <FooterLink href="#">About Us</FooterLink>
                                <FooterLink href="#">Methodology</FooterLink>
                                <FooterLink href="#">Terms of Service</FooterLink>
                                <FooterLink href="#">Privacy Policy</FooterLink>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-mono">
                        <p>© 2026 CrowdOracle Inc. All rights reserved.</p>
                        <div className="flex gap-8">
                            <span>San Francisco, CA</span>
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Systems Normal
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// --- Subcomponents ---

function PodiumCard({ rank, username, accuracy, color, icon, delay, height, isWinner = false }: any) {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
                opacity: { duration: 0.5, delay }
            }}
            className={`relative flex flex-col items-center justify-end w-28 md:w-32 rounded-t-xl bg-slate-900/50 border border-white/5 backdrop-blur-sm ${height} ${isWinner ? 'z-10 shadow-[0_0_30px_rgba(251,191,36,0.1)]' : 'z-0'}`}
        >
            <div className={`absolute -top-6 w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-slate-900 shadow-lg`}>
                {icon}
            </div>
            <div className="pb-4 text-center space-y-1">
                <span className="text-xs font-mono font-bold text-white/60">#{rank}</span>
                <div className="font-bold text-white text-sm">{username}</div>
                <div className="text-xs font-mono text-emerald-400">{accuracy} win</div>
            </div>

            {/* Base Glow */}
            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${color} opacity-50`} />
        </motion.div>
    )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-slate-500 hover:text-emerald-400 transition-colors">
                {children}
            </Link>
        </li>
    )
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
    return (
        <Link href={href} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
            {icon}
        </Link>
    )
}
