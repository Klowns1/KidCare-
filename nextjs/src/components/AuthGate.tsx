'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, LogIn, UserPlus } from 'lucide-react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { authPath, isPublicAppPath } from '@/lib/auth-paths';

export default function AuthGate({ children }: Readonly<{ children: React.ReactNode }>) {
    const { loading, user } = useGlobal();
    const pathname = usePathname();

    if (isPublicAppPath(pathname)) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-3" />
                <p className="text-gray-500 text-sm">กำลังโหลด...</p>
            </div>
        );
    }

    if (!user) {
        return <LoginRequiredPrompt nextPath={pathname || '/app'} />;
    }

    return <>{children}</>;
}

function LoginRequiredPrompt({ nextPath }: Readonly<{ nextPath: string }>) {
    return (
        <div className="max-w-md mx-auto p-4 sm:p-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-50 text-green-700 mb-4">
                    <Lock className="w-7 h-7" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">กรุณาเข้าสู่ระบบก่อนค่ะ</h1>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    เมนูโปรไฟล์ แบบประเมิน กราฟเจริญเติบโต บันทึกพฤติกรรม และการแจ้งเตือน
                    ต้องมีบัญชีเพื่อเก็บข้อมูลลูกน้อยอย่างปลอดภัย
                </p>
                <div className="mt-6 space-y-3">
                    <Link
                        href={authPath('login', nextPath)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 px-6 text-base font-bold text-white shadow-lg shadow-green-500/25 active:scale-[0.98] transition-all"
                    >
                        <LogIn className="w-5 h-5" />
                        เข้าสู่ระบบ
                    </Link>
                    <Link
                        href={authPath('register', nextPath)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 px-6 text-base font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                        <UserPlus className="w-5 h-5" />
                        สมัครใช้งานฟรี
                    </Link>
                </div>
            </div>
        </div>
    );
}
