// src/app/auth/login/page.tsx
'use client';

import { createSPASassClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SSOButtons from '@/components/SSOButtons';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMFAPrompt, setShowMFAPrompt] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const client = await createSPASassClient();
            const { error: signInError } = await client.loginEmail(email, password);

            if (signInError) throw signInError;

            // Check if MFA is required
            const supabase = client.getSupabaseClient();
            const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

            if (mfaError) throw mfaError;

            if (mfaData.nextLevel === 'aal2' && mfaData.nextLevel !== mfaData.currentLevel) {
                setShowMFAPrompt(true);
            } else {
                router.push('/app');
                return;
            }
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === 'Invalid login credentials') {
                    setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
                } else if (err.message === 'Email not confirmed') {
                    setError('บัญชียังไม่ถูกยืนยัน (หากเพิ่งปิดระบบยืนยันอีเมล กรุณาสมัครใหม่อีกครั้งด้วยบัญชีอื่น)');
                } else {
                    setError(err.message);
                }
            } else {
                setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showMFAPrompt) {
            router.push('/auth/2fa');
        }
    }, [showMFAPrompt, router]);

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">เข้าสู่ระบบ 👋</h3>
                <p className="text-gray-500 text-sm mt-1">กรอกข้อมูลด้านล่างเพื่อเข้าใช้งาน</p>
            </div>

            {error && (
                <div className="mb-5 p-4 text-sm text-red-700 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
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
                            name="email"
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

                {/* Password */}
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
                            name="password"
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
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                    <Link href="/auth/forgot-password" className="text-sm font-medium text-green-600 hover:text-green-500 p-1">
                        ลืมรหัสผ่าน?
                    </Link>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 px-6 text-base font-bold text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            กำลังเข้าสู่ระบบ...
                        </>
                    ) : (
                        'เข้าสู่ระบบ'
                    )}
                </button>
            </form>

            <SSOButtons onError={setError} />

            {/* Register link */}
            <div className="mt-6 text-center">
                <span className="text-gray-500 text-sm">ยังไม่มีบัญชีใช่ไหม?</span>
                {' '}
                <Link href="/auth/register" className="text-sm font-bold text-green-600 hover:text-green-500">
                    สมัครใช้งานฟรี →
                </Link>
            </div>
        </div>
    );
}