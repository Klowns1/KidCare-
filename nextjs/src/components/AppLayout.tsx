"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    X,
    Users, BookOpen, ClipboardList, LineChart, Activity, Bell, Phone,
    ChevronRight,
    Heart,
    LayoutGrid,
    LogIn,
    LogOut,
    Settings
} from 'lucide-react';
import AuthGate from '@/components/AuthGate';
import InAppBrowserBanner from '@/components/InAppBrowserBanner';
import { useGlobal } from '@/lib/context/GlobalContext';
import { authPath } from '@/lib/auth-paths';

type NavItem = {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

const navigation: NavItem[] = [
    { name: 'หน้าหลัก', href: '/app', icon: Home },
    { name: 'โปรไฟล์', href: '/app/profile', icon: Users },
    { name: 'คลังความรู้', href: '/app/knowledge', icon: BookOpen },
    { name: 'ติดต่อสาธารณสุข', href: '/app/contact', icon: Phone },
    { name: 'แบบประเมิน', href: '/app/assessments', icon: ClipboardList },
    { name: 'กราฟเจริญเติบโต', href: '/app/growth', icon: LineChart },
    { name: 'บันทึกพฤติกรรม', href: '/app/behavior', icon: Activity },
    { name: 'การแจ้งเตือน', href: '/app/notifications', icon: Bell },
];

const bottomNavItems: NavItem[] = [
    { name: 'หน้าหลัก', href: '/app', icon: Home },
    { name: 'โปรไฟล์', href: '/app/profile', icon: Users },
    { name: 'ความรู้', href: '/app/knowledge', icon: BookOpen },
    { name: 'บันทึก', href: '/app/behavior', icon: Activity },
];

const moreMenuItems: NavItem[] = [
    { name: 'โปรไฟล์ผู้ปกครอง+เด็ก', href: '/app/profile', icon: Users },
    { name: 'แบบประเมินพัฒนาการ', href: '/app/assessments', icon: ClipboardList },
    { name: 'กราฟการเจริญเติบโต', href: '/app/growth', icon: LineChart },
    { name: 'การแจ้งเตือน', href: '/app/notifications', icon: Bell },
    { name: 'ติดต่อสาธารณสุข', href: '/app/contact', icon: Phone },
    { name: 'ตั้งค่าบัญชี', href: '/app/user-settings', icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, loading, signOut } = useGlobal();
    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || 'KidCare';
    const showLogin = !loading && !user;
    const loginHref = authPath('login', '/app');
    const isMoreActive = moreMenuItems.some(
        (item) => pathname === item.href && !bottomNavItems.some((tab) => tab.href === item.href)
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mr-3 shadow-sm">
                            <Heart className="h-5 w-5 text-white" fill="white" />
                        </div>
                        <span className="text-lg font-bold text-gray-800">{productName}</span>
                    </div>

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
                    <SidebarAuth
                        showLogin={showLogin}
                        loginHref={loginHref}
                        email={user?.email}
                        onSignOut={signOut}
                    />
                </div>
            </div>

            <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between h-14 px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                            <Heart className="h-4 w-4 text-white" fill="white" />
                        </div>
                        <span className="font-bold text-gray-800">{productName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MobileAuth
                            showLogin={showLogin}
                            loginHref={loginHref}
                            onSignOut={signOut}
                        />
                        <Link href="/app/notifications" className="p-2 rounded-full hover:bg-gray-100 relative">
                            <Bell className="h-5 w-5 text-gray-500" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="lg:pl-72">
                <InAppBrowserBanner />
                <main className="pb-24 lg:pb-6">
                    <AuthGate>{children}</AuthGate>
                </main>
            </div>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
                <nav className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
                    {bottomNavItems.map((item) => (
                        <BottomNavTab
                            key={item.name}
                            href={item.href}
                            name={item.name}
                            icon={item.icon}
                            active={pathname === item.href}
                        />
                    ))}
                    <BottomNavTab
                        name="อื่นๆ"
                        icon={LayoutGrid}
                        active={isMoreActive}
                        onClick={() => setMoreMenuOpen(true)}
                    />
                </nav>
            </div>

            {isMoreMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-50 lg:hidden transition-opacity"
                        onClick={() => setMoreMenuOpen(false)}
                    />
                    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-gray-300" />
                        </div>

                        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">เมนูทั้งหมด</h3>
                            <button
                                onClick={() => setMoreMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

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

function SidebarAuth({
    showLogin,
    loginHref,
    email,
    onSignOut,
}: Readonly<{
    showLogin: boolean;
    loginHref: string;
    email?: string | null;
    onSignOut: () => void;
}>) {
    if (showLogin) {
        return (
            <div className="p-4 border-t border-gray-100">
                <Link
                    href={loginHref}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 text-white font-bold text-sm"
                >
                    <LogIn className="w-4 h-4" />
                    เข้าสู่ระบบ
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 border-t border-gray-100 space-y-2">
            <p className="text-xs text-gray-500 truncate px-1">{email}</p>
            <button
                type="button"
                onClick={onSignOut}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm"
            >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
            </button>
        </div>
    );
}

function MobileAuth({
    showLogin,
    loginHref,
    onSignOut,
}: Readonly<{
    showLogin: boolean;
    loginHref: string;
    onSignOut: () => void;
}>) {
    if (showLogin) {
        return (
            <Link
                href={loginHref}
                className="flex items-center gap-1 text-sm font-bold text-green-700 px-3 py-1.5 rounded-full bg-green-50"
            >
                <LogIn className="h-4 w-4" />
                เข้าสู่ระบบ
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-1 text-sm font-bold text-gray-600 px-3 py-1.5 rounded-full bg-gray-100"
        >
            <LogOut className="h-4 w-4" />
            ออก
        </button>
    );
}

function BottomNavTab({
    href,
    name,
    icon: Icon,
    active,
    onClick,
}: Readonly<{
    href?: string;
    name: string;
    icon: NavItem['icon'];
    active: boolean;
    onClick?: () => void;
}>) {
    const className = `flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all duration-150 ${
        active ? 'text-green-600' : 'text-gray-400'
    }`;
    const inner = (
        <>
            <div className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 ${
                active ? 'bg-green-50 scale-110' : ''
            }`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-semibold mt-0.5 ${
                active ? 'text-green-700' : 'text-gray-400'
            }`}>
                {name}
            </span>
        </>
    );

    if (onClick) {
        return (
            <button onClick={onClick} className={className}>
                {inner}
            </button>
        );
    }

    return (
        <Link href={href ?? '#'} className={className}>
            {inner}
        </Link>
    );
}
