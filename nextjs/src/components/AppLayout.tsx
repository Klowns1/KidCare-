"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    X,
    Users, BookOpen, ClipboardList, LineChart, Activity, Bell, Phone,
    ChevronRight,
    Heart
} from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);
    const pathname = usePathname();

    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || 'KidCare';

    // All navigation items
    const navigation = [
        { name: 'หน้าหลัก', href: '/app', icon: Home },
        { name: 'โปรไฟล์', href: '/app/profile', icon: Users },
        { name: 'คลังความรู้', href: '/app/knowledge', icon: BookOpen },
        { name: 'ติดต่อสาธารณสุข', href: '/app/contact', icon: Phone },
        { name: 'แบบประเมิน', href: '/app/assessments', icon: ClipboardList },
        { name: 'กราฟเจริญเติบโต', href: '/app/growth', icon: LineChart },
        { name: 'บันทึกพฤติกรรม', href: '/app/behavior', icon: Activity },
        { name: 'การแจ้งเตือน', href: '/app/notifications', icon: Bell },
    ];

    // Bottom nav: 4 main tabs + "อื่นๆ"
    const bottomNavItems = [
        { name: 'หน้าหลัก', href: '/app', icon: Home },
        { name: 'ความรู้', href: '/app/knowledge', icon: BookOpen },
        { name: 'ติดต่อ', href: '/app/contact', icon: Phone },
        { name: 'บันทึก', href: '/app/behavior', icon: Activity },
    ];

    // Items that go into "อื่นๆ" drawer
    const moreMenuItems = [
        { name: 'โปรไฟล์ผู้ปกครอง+เด็ก', href: '/app/profile', icon: Users },
        { name: 'แบบประเมินพัฒนาการ', href: '/app/assessments', icon: ClipboardList },
        { name: 'กราฟการเจริญเติบโต', href: '/app/growth', icon: LineChart },
        { name: 'การแจ้งเตือน', href: '/app/notifications', icon: Bell },
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
                                    <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-green-600" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
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
                                    <item.icon className="w-6 h-6" />
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
                            <Users className="w-6 h-6" />
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
                                        <item.icon className="w-6 h-6 mr-3" />
                                        <span className="text-base font-medium flex-1">{item.name}</span>
                                        <ChevronRight className={`h-5 w-5 ${isActive ? 'text-green-500' : 'text-gray-300'}`} />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* User Section Removed */}
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