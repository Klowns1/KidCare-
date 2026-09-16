"use client";
import { useState, useEffect } from 'react';
import { getSessionUser } from '@/lib/local-auth';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from "next/link";

export default function AuthAwareButtons({ variant = 'primary' }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsAuthenticated(!!getSessionUser());
        setLoading(false);
    }, []);

    if (loading) {
        return null;
    }

    if (variant === 'nav') {
        return isAuthenticated ? (
            <Link
                href="/app"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
                แดชบอร์ด
            </Link>
        ) : (
            <>
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                    เข้าสู่ระบบ
                </Link>
                <Link
                    href="/auth/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                    เริ่มต้นใช้งาน
                </Link>
            </>
        );
    }

    return isAuthenticated ? (
        <Link
            href="/app"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
        >
            ไปที่แดชบอร์ด
            <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
    ) : (
        <>
            <Link
                href="/auth/register"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
            >
                เริ่มต้นใช้งานฟรี
                <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
                href="#features"
                className="inline-flex items-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
                ดูข้อมูลเพิ่มเติม
                <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
        </>
    );
}
