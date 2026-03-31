'use client';

import { createSPASassClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SSOButtons from "@/components/SSOButtons";
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!acceptedTerms) {
            setError('กรุณายอมรับข้อตกลงและเงื่อนไขก่อนสมัคร');
            return;
        }

        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน กรุณากรอกใหม่');
            return;
        }

        setLoading(true);

        try {
            const supabase = await createSPASassClient();
            
            // Get current session
            const client = supabase.getSupabaseClient();
            const { data: { user } } = await client.auth.getUser();

            let signUpResult;
            
            if (user?.is_anonymous) {
                // Link the anonymous account to the new email/password
                signUpResult = await supabase.linkAnonymousUser(email, password);
            } else {
                // Create a brand new account
                signUpResult = await supabase.registerEmail(email, password);
            }

            const { data, error: signUpError } = signUpResult;

            if (signUpError) throw signUpError;

            // If Confirm Email is still enabled in Supabase, session will be null here.
            if (!user?.is_anonymous && 'session' in data && !data.session) {
                throw new Error("ระบบยังต้องการการยืนยันอีเมลอยู่ กรุณาเข้าไปปิด Confirm Email ใน Supabase Dashboard ก่อนครับ");
            }

            // Redirect directly to the app dashboard instead of verify-email
            router.push('/app');
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes('User already registered') || err.message.includes('already exists')) {
                    setError('อีเมลนี้มีผู้ใช้งานแล้ว');
                } else if (err.message.includes('Password should be at least')) {
                    setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
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

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">สมัครสมาชิก 🎉</h3>
                <p className="text-gray-500 text-sm mt-1">สร้างบัญชีใหม่เพื่อเริ่มดูแลสุขภาพลูกน้อย</p>
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
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="ตั้งรหัสผ่าน (อย่างน้อย 6 ตัว)"
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

                {/* Confirm Password */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        ยืนยันรหัสผ่าน
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                            className="block w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-4 text-base shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="h-5 w-5 rounded-lg border-gray-300 text-green-600 focus:ring-green-500 mt-0.5 flex-shrink-0"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                        ฉันยอมรับ{' '}
                        <Link href="/legal/terms" className="font-semibold text-green-600 hover:text-green-500 underline" target="_blank">
                            ข้อตกลงและเงื่อนไข
                        </Link>{' '}
                        และ{' '}
                        <Link href="/legal/privacy" className="font-semibold text-green-600 hover:text-green-500 underline" target="_blank">
                            นโยบายความเป็นส่วนตัว
                        </Link>
                    </label>
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
                            กำลังสร้างบัญชี...
                        </>
                    ) : (
                        'สร้างบัญชีใหม่'
                    )}
                </button>
            </form>

            <SSOButtons onError={setError} />

            {/* Login link */}
            <div className="mt-6 text-center">
                <span className="text-gray-500 text-sm">มีบัญชีอยู่แล้วใช่ไหม?</span>
                {' '}
                <Link href="/auth/login" className="text-sm font-bold text-green-600 hover:text-green-500">
                    เข้าสู่ระบบ →
                </Link>
            </div>
        </div>
    );
}