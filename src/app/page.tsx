import Link from 'next/link';
import { TrendingMarquee } from '@/components/home/TrendingMarquee';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { ArrowRight, ArrowUpRight, Users } from 'lucide-react';
import { FooterSection } from '@/components/home/FooterSection';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ticker */}
      <TrendingMarquee />

      {/* Nav */}
      <nav className="border-b border-ink-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-signal rounded-full" />
            <span className="font-display text-xl tracking-tight">CrowdOracle</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm text-ink-600 hover:text-ink-950 transition-colors">
              Markets
            </Link>
            <Link href="/leaderboard" className="text-sm text-ink-600 hover:text-ink-950 transition-colors">
              Leaderboard
            </Link>
            <div className="h-4 w-px bg-ink-200" />
            <Link href="/login" className="text-sm text-ink-600 hover:text-ink-950 transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="btn-primary px-4 py-2 text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Editorial style, asymmetric */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-24">
        <div className="grid grid-cols-12 gap-8">
          {/* Left column - headline */}
          <div className="col-span-7">
            <p className="data-label text-ink-500 mb-4">Prediction Markets</p>
            <h1 className="font-display text-6xl headline mb-6">
              The future, priced<br />by the crowd
            </h1>
            <p className="text-xl text-ink-600 subhead max-w-lg mb-10">
              Make predictions on real-world events. Build your track record.
              The most accurate forecasters rise to the top.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="btn-signal px-6 py-3 text-sm inline-flex items-center gap-2"
              >
                Start Predicting
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/events"
                className="btn-outline px-6 py-3 text-sm inline-flex items-center gap-2"
              >
                Browse Markets
              </Link>
            </div>
          </div>

          {/* Right column - live stats */}
          <div className="col-span-5 pt-8">
            <div className="card-sharp card-elevated bg-white p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-no rounded-full pulse-dot" />
                <span className="data-label text-ink-500">Live Platform Stats</span>
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-baseline border-b border-ink-100 pb-4">
                  <span className="text-sm text-ink-500">Active Markets</span>
                  <span className="data-value text-2xl font-medium">47</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-ink-100 pb-4">
                  <span className="text-sm text-ink-500">Total Predictions</span>
                  <span className="data-value text-2xl font-medium">128,493</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-ink-100 pb-4">
                  <span className="text-sm text-ink-500">Platform Accuracy</span>
                  <span className="data-value text-2xl font-medium text-yes">78.4%</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-ink-500">Active Forecasters</span>
                  <span className="data-value text-2xl font-medium">3,241</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scrolling Banner */}
      <FeaturedCarousel />

      {/* How it works - dense, editorial grid */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4">
            <p className="data-label text-ink-400 mb-3">How It Works</p>
            <h2 className="font-display text-3xl headline">
              Accuracy equals influence
            </h2>
          </div>
          <div className="col-span-8">
            <p className="text-lg text-ink-600 subhead mb-12 max-w-xl">
              Unlike simple polls, every vote is weighted by the forecaster&apos;s track record.
              Proven experts have more influence on the final prediction.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="group relative p-5 bg-white border border-ink-200 rounded-lg transition-all duration-300 hover:border-ink-400 hover:shadow-lg">
                <span className="text-4xl font-bold text-ink-100 group-hover:text-signal/30 transition-colors">01</span>
                <h3 className="font-semibold text-lg mt-2 mb-2">Predict</h3>
                <p className="text-sm text-ink-500 leading-relaxed">
                  Vote Yes or No on upcoming events. Set your confidence level.
                </p>
              </div>
              <div className="group relative p-5 bg-white border border-ink-200 rounded-lg transition-all duration-300 hover:border-ink-400 hover:shadow-lg">
                <span className="text-4xl font-bold text-ink-100 group-hover:text-signal/30 transition-colors">02</span>
                <h3 className="font-semibold text-lg mt-2 mb-2">Build Score</h3>
                <p className="text-sm text-ink-500 leading-relaxed">
                  Correct predictions raise your trust score. Wrong ones lower it.
                </p>
              </div>
              <div className="group relative p-5 bg-white border border-ink-200 rounded-lg transition-all duration-300 hover:border-ink-400 hover:shadow-lg">
                <span className="text-4xl font-bold text-ink-100 group-hover:text-signal/30 transition-colors">03</span>
                <h3 className="font-semibold text-lg mt-2 mb-2">Gain Influence</h3>
                <p className="text-sm text-ink-500 leading-relaxed">
                  Higher scores mean your votes carry more weight in predictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust tiers - tight table layout */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-5">
            <p className="data-label text-ink-400 mb-3">Trust System</p>
            <h2 className="font-display text-3xl headline mb-6">
              Five tiers of forecaster status
            </h2>
            <p className="text-ink-600 subhead">
              Everyone starts at 50%. Your accuracy over time determines your tier
              and voting weight.
            </p>
          </div>
          <div className="col-span-7">
            <div className="card-sharp bg-white overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-200 bg-ink-50">
                    <th className="text-left p-4 data-label text-ink-500">Tier</th>
                    <th className="text-left p-4 data-label text-ink-500">Accuracy</th>
                    <th className="text-left p-4 data-label text-ink-500">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-ink-100">
                    <td className="p-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-ink-400" />
                        Newcomer
                      </span>
                    </td>
                    <td className="p-4 data-value text-ink-600">&lt; 55%</td>
                    <td className="p-4 data-value text-ink-600">0.5x</td>
                  </tr>
                  <tr className="border-b border-ink-100">
                    <td className="p-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Regular
                      </span>
                    </td>
                    <td className="p-4 data-value text-ink-600">55–65%</td>
                    <td className="p-4 data-value text-ink-600">0.8x</td>
                  </tr>
                  <tr className="border-b border-ink-100">
                    <td className="p-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yes" />
                        Reliable
                      </span>
                    </td>
                    <td className="p-4 data-value text-ink-600">65–75%</td>
                    <td className="p-4 data-value text-ink-600">1.0x</td>
                  </tr>
                  <tr className="border-b border-ink-100">
                    <td className="p-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-500" />
                        Expert
                      </span>
                    </td>
                    <td className="p-4 data-value text-ink-600">75–85%</td>
                    <td className="p-4 data-value text-ink-600">1.5x</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber" />
                        Superforecaster
                      </span>
                    </td>
                    <td className="p-4 data-value text-ink-600">&gt; 85%</td>
                    <td className="p-4 data-value text-ink-600">2.0x</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
