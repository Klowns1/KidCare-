"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Home,
    User,
    X,
    LogOut,
    Key,
    Users, BookOpen, ClipboardList, LineChart, Activity, Bell, Phone,
    MoreHorizontal,
    ChevronRight,
    Heart
} from 'lucide-react';
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPASassClient } from "@/lib/supabase/client";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const { user } = useGlobal();

    const handleLogout = async () => {
        try {
            const client = await createSPASassClient();
            await client.logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const getInitials = (email: string) => {
        const parts = email.split('@')[0].split(/[._-]/);
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].slice(0, 2).toUpperCase();
    };

    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || 'KidCare';

    // All navigation items
    const navigation = [
        { name: 'หน้าหลัก', href: '/app', icon: Home, emoji: '🏠' },
        { name: 'โปรไฟล์', href: '/app/profile', icon: Users, emoji: '👨‍👩‍👧' },
        { name: 'คลังความรู้', href: '/app/knowledge', icon: BookOpen, emoji: '📚' },
        { name: 'ติดต่อสาธารณสุข', href: '/app/contact', icon: Phone, emoji: '📞' },
        { name: 'แบบประเมิน', href: '/app/assessments', icon: ClipboardList, emoji: '📋' },
        { name: 'กราฟเจริญเติบโต', href: '/app/growth', icon: LineChart, emoji: '📈' },
        { name: 'บันทึกพฤติกรรม', href: '/app/behavior', icon: Activity, emoji: '✅' },
        { name: 'การแจ้งเตือน', href: '/app/notifications', icon: Bell, emoji: '🔔' },
        { name: 'ตั้งค่าบัญชี', href: '/app/user-settings', icon: User, emoji: '⚙️' },
    ];

    // Bottom nav: 4 main tabs + "อื่นๆ"
    const bottomNavItems = [
        { name: 'หน้าหลัก', href: '/app', icon: Home, emoji: '🏠' },
        { name: 'ความรู้', href: '/app/knowledge', icon: BookOpen, emoji: '📚' },
        { name: 'ติดต่อ', href: '/app/contact', icon: Phone, emoji: '📞' },
        { name: 'บันทึก', href: '/app/behavior', icon: Activity, emoji: '✅' },
    ];

    // Items that go into "อื่นๆ" drawer
    const moreMenuItems = [
        { name: 'โปรไฟล์ผู้ปกครอง+เด็ก', href: '/app/profile', icon: Users, emoji: '👨‍👩‍👧' },
        { name: 'แบบประเมินพัฒนาการ', href: '/app/assessments', icon: ClipboardList, emoji: '📋' },
        { name: 'กราฟการเจริญเติบโต', href: '/app/growth', icon: LineChart, emoji: '📈' },
        { name: 'การแจ้งเตือน', href: '/app/notifications', icon: Bell, emoji: '🔔' },
        { name: 'ตั้งค่าบัญชี', href: '/app/user-settings', icon: User, emoji: '⚙️' },
    ];

    const isBottomNavActive = (href: string) => pathname === href;
    const isMoreActive = moreMenuItems.some(item => pathname === item.href);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ============================== */}
            {/*  DESKTOP SIDEBAR (lg and up)   */}
            {/* ============================== */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
                    {/* Logo / Brand */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mr-3 shadow-sm">
                            <Heart className="h-5 w-5 text-white" fill="white" />
                        </div>
                        <span className="text-lg font-bold text-gray-800">{productName}</span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-150 ${
                                        isActive
                                            ? 'bg-green-50 text-green-700 shadow-sm border border-green-100'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="text-lg mr-3">{item.emoji}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop User Info */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-gray-50">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-green-700 font-bold text-sm">
                                    {user ? getInitials(user.email) : '??'}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                                <p className="text-xs text-gray-500">ผู้ปกครอง</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => router.push('/app/user-settings')}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                            >
                                <Key className="h-4 w-4" />
                                ตั้งค่า
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
                            >
                                <LogOut className="h-4 w-4" />
                                ออก
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================== */}
            {/*  MOBILE TOP BAR                */}
            {/* ============================== */}
            <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between h-14 px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                            <Heart className="h-4 w-4 text-white" fill="white" />
                        </div>
                        <span className="font-bold text-gray-800">{productName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/app/notifications" className="p-2 rounded-full hover:bg-gray-100 relative">
                            <Bell className="h-5 w-5 text-gray-500" />
                        </Link>
                        <button
                            onClick={() => router.push('/app/user-settings')}
                            className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"
                        >
                            <span className="text-green-700 font-bold text-xs">
                                {user ? getInitials(user.email) : '??'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ============================== */}
            {/*  MAIN CONTENT                  */}
            {/* ============================== */}
            <div className="lg:pl-72">
                <main className="pb-24 lg:pb-6">
                    {children}
                </main>
            </div>

            {/* ============================== */}
            {/*  MOBILE BOTTOM NAVIGATION      */}
            {/* ============================== */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
                <nav className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
                    {bottomNavItems.map((item) => {
                        const isActive = isBottomNavActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all duration-150 ${
                                    isActive
                                        ? 'text-green-600'
                                        : 'text-gray-400'
                                }`}
                            >
                                <div className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 ${
                                    isActive ? 'bg-green-50 scale-110' : ''
                                }`}>
                                    <span className="text-xl">{item.emoji}</span>
                                </div>
                                <span className={`text-[10px] font-semibold mt-0.5 ${
                                    isActive ? 'text-green-700' : 'text-gray-400'
                                }`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                    {/* "อื่นๆ" button */}
                    <button
                        onClick={() => setMoreMenuOpen(true)}
                        className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all duration-150 ${
                            isMoreActive ? 'text-green-600' : 'text-gray-400'
                        }`}
                    >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 ${
                            isMoreActive ? 'bg-green-50 scale-110' : ''
                        }`}>
                            <span className="text-xl">📌</span>
                        </div>
                        <span className={`text-[10px] font-semibold mt-0.5 ${
                            isMoreActive ? 'text-green-700' : 'text-gray-400'
                        }`}>
                            อื่นๆ
                        </span>
                    </button>
                </nav>
            </div>

            {/* ============================== */}
            {/*  "อื่นๆ" BOTTOM SHEET DRAWER   */}
            {/* ============================== */}
            {isMoreMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/40 z-50 lg:hidden transition-opacity"
                        onClick={() => setMoreMenuOpen(false)}
                    />
                    {/* Sheet */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto">
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-gray-300" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">เมนูทั้งหมด</h3>
                            <button
                                onClick={() => setMoreMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Menu items */}
                        <div className="px-4 py-3 space-y-1">
                            {moreMenuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMoreMenuOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all active:scale-[0.98] ${
                                            isActive
                                                ? 'bg-green-50 text-green-700 border border-green-100'
                                                : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                                        }`}
                                    >
                                        <span className="text-2xl">{item.emoji}</span>
                                        <span className="text-base font-medium flex-1">{item.name}</span>
                                        <ChevronRight className={`h-5 w-5 ${isActive ? 'text-green-500' : 'text-gray-300'}`} />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* User Section */}
                        <div className="px-4 py-3 border-t border-gray-100 mb-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl mb-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-700 font-bold text-sm">
                                        {user ? getInitials(user.email) : '??'}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                                    <p className="text-xs text-gray-500">ผู้ปกครอง</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { handleLogout(); setMoreMenuOpen(false); }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors active:scale-[0.98]"
                            >
                                <LogOut className="h-5 w-5" />
                                ออกจากระบบ
                            </button>
                        </div>
                    </div>

                    <style jsx>{`
                        @keyframes slideUp {
                            from { transform: translateY(100%); }
                            to { transform: translateY(0); }
                        }
                        .animate-slide-up {
                            animation: slideUp 0.3s ease-out;
                        }
                    `}</style>
                </>
            )}
        </div>
    );
}