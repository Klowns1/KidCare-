'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Key } from 'lucide-react';
import { resetPasswordByEmail } from '@/lib/local-auth';

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500 text-sm">กำลังโหลด...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const email = (searchParams.get('email') || '').trim().toLowerCase();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('ไม่พบอีเมลสำหรับรีเซ็ตรหัสผ่าน กรุณาเริ่มใหม่จากหน้าลืมรหัสผ่าน');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }
        if (newPassword.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
            return;
        }

        setLoading(true);
        try {
            await resetPasswordByEmail(email, newPassword);
            setSuccess(true);
            setTimeout(() => router.push('/auth/login'), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'รีเซ็ตรหัสผ่านไม่สำเร็จ');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">ตั้งรหัสผ่านใหม่สำเร็จ</h2>
                <p className="text-gray-600">กำลังพาไปหน้าเข้าสู่ระบบ...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex justify-center mb-4">
                <Key className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">ตั้งรหัสผ่านใหม่</h2>
            {email && <p className="text-sm text-center text-gray-500 mb-6">{email}</p>}

            {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-2xl border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">รหัสผ่านใหม่</label>
                    <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ยืนยันรหัสผ่านใหม่</label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 text-base font-bold text-white disabled:opacity-50"
                >
                    {loading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <Link href="/auth/forgot-password" className="font-bold text-green-600">
                    กลับไปหน้าลืมรหัสผ่าน
                </Link>
            </div>
        </div>
    );
}
