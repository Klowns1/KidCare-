'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userExists } from '@/lib/local-auth';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (!userExists(email)) {
                throw new Error('ไม่พบอีเมลนี้ในระบบ กรุณาสมัครสมาชิกก่อน');
            }
            router.push(`/auth/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">ลืมรหัสผ่าน</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
                กรอกอีเมลที่สมัครไว้ เพื่อตั้งรหัสผ่านใหม่
            </p>

            {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-2xl border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        อีเมล
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        placeholder="กรอกอีเมลของคุณ"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 text-base font-bold text-white disabled:opacity-50"
                >
                    {loading ? 'กำลังตรวจสอบ...' : 'ตั้งรหัสผ่านใหม่'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <Link href="/auth/login" className="font-bold text-green-600">
                    กลับไปเข้าสู่ระบบ
                </Link>
            </div>
        </div>
    );
}
