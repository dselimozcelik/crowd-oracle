'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { signUp } from '@/actions/auth';
import { toast } from 'sonner';

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const result = await signUp(formData);
        if (result?.error) {
            toast.error(result.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left panel - decorative */}
            <div className="hidden lg:flex flex-1 bg-ink-950 items-center justify-center p-12">
                <div className="max-w-md">
                    <p className="data-label text-ink-500 mb-6">How It Works</p>
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-ink-800 rounded flex items-center justify-center shrink-0">
                                <span className="data-value text-signal">1</span>
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Make predictions</h3>
                                <p className="text-ink-400 text-sm">Vote Yes or No on real-world events before they happen.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-ink-800 rounded flex items-center justify-center shrink-0">
                                <span className="data-value text-signal">2</span>
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Build your score</h3>
                                <p className="text-ink-400 text-sm">Accurate predictions increase your trust score over time.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-ink-800 rounded flex items-center justify-center shrink-0">
                                <span className="data-value text-signal">3</span>
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Gain influence</h3>
                                <p className="text-ink-400 text-sm">Higher scores mean your votes carry more weight.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel - form */}
            <div className="flex-1 flex items-center justify-center px-8">
                <div className="w-full max-w-sm">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="w-2 h-2 bg-signal rounded-full" />
                        <span className="font-display text-lg">CrowdOracle</span>
                    </Link>

                    <h1 className="font-display text-2xl headline mb-2">Create account</h1>
                    <p className="text-ink-500 mb-8">
                        Start building your prediction track record
                    </p>

                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-ink-700 mb-1.5">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="forecaster"
                                required
                                minLength={3}
                                maxLength={20}
                                disabled={isLoading}
                                className="w-full px-3 py-2 bg-white border border-ink-200 rounded text-sm focus:outline-none focus:border-ink-400 disabled:opacity-50 placeholder:text-ink-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                disabled={isLoading}
                                className="w-full px-3 py-2 bg-white border border-ink-200 rounded text-sm focus:outline-none focus:border-ink-400 disabled:opacity-50 placeholder:text-ink-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1.5">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={8}
                                disabled={isLoading}
                                className="w-full px-3 py-2 bg-white border border-ink-200 rounded text-sm focus:outline-none focus:border-ink-400 disabled:opacity-50 placeholder:text-ink-300"
                            />
                            <p className="text-xs text-ink-400 mt-1">Minimum 8 characters</p>
                        </div>
                        <button
                            type="submit"
                            className="w-full btn-signal py-2.5 text-sm flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-ink-500 text-center">
                        Already have an account?{' '}
                        <Link href="/login" className="text-ink-900 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
