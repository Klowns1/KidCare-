'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authPath, safeNextPath } from '@/lib/auth-paths';
import { loginUser } from '@/lib/local-auth';

function loginErrorMessage(err: unknown): string {
    if (!(err instanceof Error)) return 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
    if (err.message === 'Invalid login credentials') {
        return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
    }
    return err.message;
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500 text-sm">กำลังโหลด...</div>}>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();
    const nextPath = safeNextPath(searchParams.get('next'));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await loginUser(email, password);
            window.location.href = nextPath;
        } catch (err) {
            setError(loginErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">เข้าสู่ระบบ</h3>
                <p className="text-gray-500 text-sm mt-1">กรอกอีเมลและรหัสผ่านที่สมัครไว้</p>
            </div>

            {error && (
                <div className="mb-5 p-4 text-sm text-red-700 bg-red-50 rounded-2xl border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        อีเมล
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="กรอกอีเมลของคุณ"
                            className="block w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-4 text-base shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        รหัสผ่าน
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="กรอกรหัสผ่าน"
                            className="block w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-12 py-4 text-base shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all placeholder:text-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Link href="/auth/forgot-password" className="text-sm font-medium text-green-600 hover:text-green-500">
                        ลืมรหัสผ่าน?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 px-6 text-base font-bold text-white shadow-lg shadow-green-500/25 disabled:opacity-50 active:scale-[0.98]"
                >
                    {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <span className="text-gray-500 text-sm">ยังไม่มีบัญชีใช่ไหม?</span>{' '}
                <Link href={authPath('register', nextPath)} className="text-sm font-bold text-green-600">
                    สมัครใช้งานฟรี →
                </Link>
            </div>
        </div>
    );
}
