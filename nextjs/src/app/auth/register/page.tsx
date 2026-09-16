'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authPath, safeNextPath } from '@/lib/auth-paths';
import { registerUser } from '@/lib/local-auth';
import { seedWelcomeNotification } from '@/lib/local-db';

function registerErrorMessage(err: unknown): string {
    if (!(err instanceof Error)) return 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
    if (err.message.includes('Password should be at least') || err.message.includes('อย่างน้อย 6')) {
        return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    }
    return err.message;
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500 text-sm">กำลังโหลด...</div>}>
            <RegisterForm />
        </Suspense>
    );
}

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();
    const nextPath = safeNextPath(searchParams.get('next'));

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
            const user = await registerUser(email, password);
            seedWelcomeNotification(user.id);
            window.location.href = nextPath;
        } catch (err) {
            setError(registerErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">สมัครสมาชิก</h3>
                <p className="text-gray-500 text-sm mt-1">สร้างบัญชีใหม่เพื่อเริ่มดูแลสุขภาพลูกน้อย</p>
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
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                </div>

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

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <input
                        id="terms"
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="h-5 w-5 rounded-lg border-gray-300 text-green-600 focus:ring-green-500 mt-0.5 flex-shrink-0"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                        ฉันยอมรับ{' '}
                        <Link href="/legal/terms" className="font-semibold text-green-600 underline" target="_blank">
                            ข้อตกลงและเงื่อนไข
                        </Link>{' '}
                        และ{' '}
                        <Link href="/legal/privacy" className="font-semibold text-green-600 underline" target="_blank">
                            นโยบายความเป็นส่วนตัว
                        </Link>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 px-6 text-base font-bold text-white shadow-lg shadow-green-500/25 disabled:opacity-50 active:scale-[0.98]"
                >
                    {loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชีใหม่'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <span className="text-gray-500 text-sm">มีบัญชีอยู่แล้วใช่ไหม?</span>{' '}
                <Link href={authPath('login', nextPath)} className="text-sm font-bold text-green-600">
                    เข้าสู่ระบบ →
                </Link>
            </div>
        </div>
    );
}
