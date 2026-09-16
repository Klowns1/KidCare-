'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Email verification is not required in local-auth mode. */
export default function VerifyEmailPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/app');
    }, [router]);
    return (
        <div className="p-8 text-center text-gray-500 text-sm">กำลังเข้าสู่แอป...</div>
    );
}
