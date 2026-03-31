"use client";
import React from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { CalendarDays, ExternalLink, Baby, BookOpen, Bell, ArrowRight, ShieldCheck, TrendingUp, ChevronRight, Activity, ClipboardList, Phone, LineChart } from 'lucide-react';
import Link from 'next/link';

export default function DashboardContent() {
    const { loading, user } = useGlobal();

    const getDaysSinceRegistration = () => {
        if (!user?.registered_at) return 0;
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - user.registered_at.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-3 text-gray-500 text-sm">กำลังโหลด...</p>
                </div>
            </div>
        );
    }

    const daysSinceRegistration = getDaysSinceRegistration();
    const displayName = user?.email?.split('@')[0] || 'คุณพ่อคุณแม่';

    // Grouped menu categories for mother-friendly UX
    const menuCategories = [
        {
            label: '👶 ข้อมูลลูกน้อย',
            items: [
                {
                    title: "โปรไฟล์ลูก+ผู้ปกครอง",
                    description: "ข้อมูลส่วนตัวครอบครัว",
                    emoji: "👨‍👩‍👧",
                    href: "/app/profile",
                    color: "from-blue-500 to-blue-600",
                    bg: "bg-blue-50",
                },
                {
                    title: "กราฟเจริญเติบโต",
                    description: "น้ำหนัก ส่วนสูง ลูก",
                    emoji: "📈",
                    href: "/app/growth",
                    color: "from-orange-500 to-orange-600",
                    bg: "bg-orange-50",
                },
            ]
        },
        {
            label: '📋 บันทึกและประเมิน',
            items: [
                {
                    title: "บันทึกพฤติกรรม",
                    description: "สุขภาพเด็กประจำวัน",
                    emoji: "✅",
                    href: "/app/behavior",
                    color: "from-green-500 to-green-600",
                    bg: "bg-green-50",
                },
                {
                    title: "แบบประเมินพัฒนาการ",
                    description: "Pre-test / Post-test",
                    emoji: "📝",
                    href: "/app/assessments",
                    color: "from-purple-500 to-purple-600",
                    bg: "bg-purple-50",
                },
            ]
        },
        {
            label: '📚 เรียนรู้และติดต่อ',
            items: [
                {
                    title: "คลังความรู้",
                    description: "บทความดูแลเด็ก",
                    emoji: "📚",
                    href: "/app/knowledge",
                    color: "from-amber-500 to-amber-600",
                    bg: "bg-amber-50",
                },
                {
                    title: "ติดต่อสาธารณสุข",
                    description: "ปรึกษาเจ้าหน้าที่",
                    emoji: "📞",
                    href: "/app/contact",
                    color: "from-teal-500 to-teal-600",
                    bg: "bg-teal-50",
                },
            ]
        },
    ];

    return (
        <div className="space-y-6 p-4 md:p-8 max-w-4xl mx-auto">
            {/* =============================== */}
            {/*  WELCOME HERO (simplified)      */}
            {/* =============================== */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 text-white p-6 sm:p-8 shadow-xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-10 -mb-4 w-24 h-24 bg-green-400 opacity-20 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-90">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-xs font-medium tracking-wide text-green-100 uppercase">KidCare ร้อยเอ็ด</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
                        สวัสดีค่ะ, {displayName}! 👋
                    </h1>
                    <p className="text-green-100 text-sm sm:text-base mb-5 leading-relaxed max-w-md">
                        ดูแลลูกน้อยให้เติบโตอย่างสมวัย ด้วยเครื่องมือที่ออกแบบมาเพื่อคุณ
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link 
                            href="/app/profile"
                            className="bg-white text-green-700 hover:bg-green-50 px-5 py-3 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 active:scale-[0.97]"
                        >
                            <Baby className="h-5 w-5" />
                            จัดการโปรไฟล์ลูก
                            <ArrowRight className="h-4 w-4 ml-0.5" />
                        </Link>
                        <div className="flex items-center gap-2 text-green-100 bg-green-900/30 px-4 py-2.5 rounded-2xl text-sm">
                            <CalendarDays className="h-4 w-4" />
                            <span>เข้าร่วมเมื่อ {daysSinceRegistration} วันที่แล้ว</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* =============================== */}
            {/*  MENU GRID BY CATEGORY          */}
            {/* =============================== */}
            {menuCategories.map((category) => (
                <div key={category.label}>
                    <h2 className="text-lg font-bold text-gray-800 mb-3 px-1">{category.label}</h2>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {category.items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group block"
                            >
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all active:scale-[0.97] h-full">
                                    <div className="text-3xl sm:text-4xl mb-3">
                                        {item.emoji}
                                    </div>
                                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 leading-snug">
                                        {item.description}
                                    </p>
                                    <div className="mt-3 flex items-center text-xs font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        เปิดดู <ChevronRight className="h-3 w-3 ml-0.5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}

            {/* =============================== */}
            {/*  QUICK LINKS (bottom cards)     */}
            {/* =============================== */}
            <div className="space-y-3">
                <h2 className="text-lg font-bold text-gray-800 px-1">🔔 แจ้งเตือนและอื่นๆ</h2>

                {/* Notification empty state */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                        <div className="bg-gray-50 p-4 rounded-full mb-3">
                            <Bell className="h-7 w-7 text-gray-300" />
                        </div>
                        <h3 className="text-gray-700 font-semibold">ยังไม่มีการแจ้งเตือน</h3>
                        <p className="text-gray-400 text-sm mt-1 max-w-[280px] leading-relaxed">
                            เมื่อมีการประเมิน หรือเหตุการณ์สำคัญ จะแสดงให้คุณเห็นที่นี่ค่ะ
                        </p>
                    </div>
                </div>

                {/* Quick action links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link href="/app/user-settings" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl group-hover:bg-green-50 transition-colors flex-shrink-0">
                            ⚙️
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm">จัดการบัญชี</p>
                            <p className="text-xs text-gray-400">รหัสผ่าน, อีเมล</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300 ml-auto flex-shrink-0" />
                    </Link>

                    <a href="tel:0828899994" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl group-hover:bg-green-100 transition-colors flex-shrink-0">
                            🆘
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm">ติดต่อด่วน</p>
                            <p className="text-xs text-gray-400">โทรหาเจ้าหน้าที่สาธารณสุข</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300 ml-auto flex-shrink-0" />
                    </a>
                </div>
            </div>
        </div>
    );
}