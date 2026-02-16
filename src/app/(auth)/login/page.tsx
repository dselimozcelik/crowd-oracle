'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { signIn } from '@/actions/auth';
import { toast } from 'sonner';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const result = await signIn(formData);
        if (result?.error) {
            toast.error(result.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left panel - form */}
            <div className="flex-1 flex items-center justify-center px-8">
                <div className="w-full max-w-sm">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="w-2 h-2 bg-signal rounded-full" />
                        <span className="font-display text-lg">Referandum</span>
                    </Link>

                    <h1 className="font-display text-2xl headline mb-2">Giriş Yap</h1>
                    <p className="text-ink-500 mb-8">
                        Hesabınıza devam edin
                    </p>

                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">
                                E-posta
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
                                Şifre
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                                className="w-full px-3 py-2 bg-white border border-ink-200 rounded text-sm focus:outline-none focus:border-ink-400 disabled:opacity-50 placeholder:text-ink-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full btn-primary py-2.5 text-sm flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                'Giriş Yap'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-ink-500 text-center">
                        Hesabınız yok mu?{' '}
                        <Link href="/signup" className="text-ink-900 font-medium hover:underline">
                            Kayıt Ol
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right panel - decorative */}
            <div className="hidden lg:flex flex-1 bg-ink-950 items-center justify-center p-12">
                <div className="max-w-md">
                    <p className="data-label text-ink-500 mb-4">Platform İstatistikleri</p>
                    <div className="space-y-6">
                        <div>
                            <span className="data-value text-5xl text-white">78.4%</span>
                            <p className="text-ink-400 mt-1">Toplam platform doğruluğu</p>
                        </div>
                        <div className="divider bg-ink-800" />
                        <div>
                            <span className="data-value text-5xl text-white">128K</span>
                            <p className="text-ink-400 mt-1">Yapılan tahminler</p>
                        </div>
                        <div className="divider bg-ink-800" />
                        <div>
                            <span className="data-value text-5xl text-signal">3,241</span>
                            <p className="text-ink-400 mt-1">Aktif tahminleyiciler</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
