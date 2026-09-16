'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** MFA is not used in local-auth mode. */
export default function TwoFactorPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/app');
    }, [router]);
    return (
        <div className="p-8 text-center text-gray-500 text-sm">กำลังเข้าสู่แอป...</div>
    );
}
