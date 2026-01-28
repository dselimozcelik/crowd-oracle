'use client';

import { motion } from 'framer-motion';
import { IdentityPanel } from '@/components/dashboard/IdentityPanel';
import { KPIGrid } from '@/components/dashboard/KPIGrid';
import { TrustSonar } from '@/components/dashboard/TrustSonar';
import { SkillRadar } from '@/components/dashboard/SkillRadar';
import { ActivePredictions } from '@/components/dashboard/ActivePredictions';
import { staggerContainer, staggerItem } from '@/lib/animations';

// --- MOCK DATA FOR DEVELOPMENT ---
const MOCK_USER = {
    name: "Furkan Celik",
    username: "furkan",
    rank: "Cadet",
    xp: 850,
    nextXp: 1000,
    trustScore: 84.3,
    accuracy: 62,
    volume: 142,
    specialty: "Sports",
    avatar: "/avatars/furkan.jpg"
};

const MOCK_HISTORY = [
    { date: 'Jan 1', score: 50, avg: 50, event: 'Signup', change: 0, result: 'NEUTRAL' },
    { date: 'Jan 5', score: 55, avg: 51, event: 'Bitcoin Dip', change: 5, result: 'WON' },
    { date: 'Jan 10', score: 52, avg: 52, event: 'SpaceX Launch', change: -3, result: 'LOST' },
    { date: 'Jan 15', score: 68, avg: 54, event: 'Fed Rates', change: 16, result: 'WON' },
    { date: 'Jan 20', score: 72, avg: 55, event: 'Super Lig', change: 4, result: 'WON' },
    { date: 'Jan 25', score: 84.3, avg: 58, event: 'Oil Prices', change: 12.3, result: 'WON' },
];

const MOCK_SKILLS = [
    { subject: 'Sports', A: 90, fullMark: 100 },
    { subject: 'Crypto', A: 50, fullMark: 100 },
    { subject: 'Tech', A: 80, fullMark: 100 },
    { subject: 'Politics', A: 40, fullMark: 100 },
    { subject: 'Science', A: 60, fullMark: 100 },
    { subject: 'Economy', A: 70, fullMark: 100 },
];

const MOCK_PREDICTIONS = [
    { id: '1', event: 'Fenerbahçe vs Galatasaray', prediction: 'YES' as const, consensus: 65, category: 'Sports', deadline: '4 Hours' },
    { id: '2', event: 'Bitcoin > $100k by March', prediction: 'NO' as const, consensus: 22, category: 'Crypto', deadline: '2 Days' },
    { id: '3', event: 'Fed Cut Rate in Q2', prediction: 'YES' as const, consensus: 88, category: 'Economy', deadline: '1 Week' },
    { id: '4', event: 'SpaceX Starship Launch', prediction: 'YES' as const, consensus: 94, category: 'Tech', deadline: 'Feb 28' },
    { id: '5', event: 'Oil Price > $90', prediction: 'NO' as const, consensus: 45, category: 'Economy', deadline: 'May 15' },
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#FAF9F7] text-ink-900 pt-20 pb-12 px-4 md:px-8 relative">
            {/* Decorative blur blob */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-signal/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4 z-0" />

            <motion.div
                className="max-w-6xl mx-auto space-y-8 relative z-10"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                {/* 1. IDENTITY HEADER */}
                <motion.div variants={staggerItem}>
                    <IdentityPanel user={MOCK_USER} />
                </motion.div>

                {/* 2. KPI GRID */}
                <motion.div variants={staggerItem}>
                    <KPIGrid stats={{
                        trustScore: MOCK_USER.trustScore,
                        accuracy: MOCK_USER.accuracy,
                        volume: MOCK_USER.volume,
                        specialty: MOCK_USER.specialty
                    }} />
                </motion.div>

                {/* 3. VISUAL ANALYTICS */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    variants={staggerItem}
                >
                    <TrustSonar data={MOCK_HISTORY} />
                    <SkillRadar data={MOCK_SKILLS} />
                </motion.div>

                {/* 4. ACTIVE LOGBOOK */}
                <motion.div variants={staggerItem}>
                    <ActivePredictions predictions={MOCK_PREDICTIONS} />
                </motion.div>
            </motion.div>
        </div>
    );
}
