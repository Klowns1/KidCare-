"use client";
import React from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarDays, Settings, ExternalLink, Activity, Baby, BookOpen, Bell, ArrowRight, ShieldCheck, TrendingUp, ChevronRight } from 'lucide-react';
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
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const daysSinceRegistration = getDaysSinceRegistration();
    const displayName = user?.email?.split('@')[0] || 'คุณพ่อคุณแม่';

    const quickActions = [
        {
            title: "โปรไฟล์ผู้ปกครองและเด็ก",
            description: "จัดการข้อมูลส่วนตัวและเพิ่มข้อมูลเด็ก",
            icon: Baby,
            href: "/app/profile",
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100"
        },
        {
            title: "บันทึกพฤติกรรม",
            description: "บันทึกพฤติกรรมดูแลสุขภาพเด็กประจำวัน",
            icon: Activity,
            href: "/app/behavior",
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-100"
        },
        {
            title: "กราฟเจริญเติบโต",
            description: "ติดตามพัฒนาการน้ำหนักและส่วนสูง",
            icon: TrendingUp,
            href: "/app/growth",
            color: "text-orange-600",
            bg: "bg-orange-50",
            border: "border-orange-100"
        },
        {
            title: "คลังความรู้",
            description: "คู่มือการดูแลเด็กและการส่งเสริมทักษะ",
            icon: BookOpen,
            href: "/app/knowledge",
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-100"
        }
    ];

    return (
        <div className="space-y-8 p-4 md:p-8 max-w-6xl mx-auto">
            {/* Hero / Welcome Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 text-white p-8 shadow-xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-10 -mb-4 w-24 h-24 bg-primary-400 opacity-20 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2 opacity-90">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="text-sm font-medium tracking-wide text-primary-100 uppercase">ระบบบันทึกข้อมูลสุขภาพเด็ก KidCare</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-4 mt-2">
                        ยินดีต้อนรับ, {displayName}! 👋
                    </h1>
                    <p className="text-primary-100 max-w-xl text-lg mb-6 leading-relaxed">
                        เริ่มติดตามและพัฒนาสุขภาพของลูกคุณให้เติบโตอย่างสมวัย ด้วยเครื่องมือและผลการประเมินจากผู้เชี่ยวชาญ
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link 
                            href="/app/profile"
                            className="bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2 group transform active:scale-95"
                        >
                            <Baby className="h-5 w-5" />
                            จัดการโปรไฟล์ลูก
                            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <div className="flex items-center gap-2 text-primary-100 bg-primary-900/40 px-4 py-2.5 rounded-xl border border-primary-500/30">
                            <CalendarDays className="h-4 w-4" />
                            <span className="text-sm">เข้าร่วมเมื่อ {daysSinceRegistration} วันที่แล้ว</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">เมนูลัด (Quick Actions)</h2>
                        <p className="text-gray-500 mt-1">เข้าถึงฟีเจอร์ที่คุณใช้งานบ่อยที่สุด</p>
                    </div>
                    <Link href="/app/settings" className="hidden sm:flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors mt-4 sm:mt-0 p-2 rounded-lg hover:bg-primary-50">
                        <Settings className="h-4 w-4 mr-2" />
                        ตั้งค่าบัญชี
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {quickActions.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                            <Link 
                                href={action.href} 
                                key={idx}
                                className="group block h-full"
                            >
                                <Card className={`h-full border-2 border-transparent hover:${action.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden relative`}>
                                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${action.bg}`}></div>
                                    <CardContent className="p-6">
                                        <div className={`w-12 h-12 rounded-2xl ${action.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                            <Icon className={`h-6 w-6 ${action.color}`} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-primary-700 transition-colors">
                                            {action.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                                            {action.description}
                                        </p>
                                        
                                        <div className="mt-4 flex items-center text-sm font-medium text-gray-400 opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            เริ่มใช้งาน <ChevronRight className="h-4 w-4 ml-1" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border shadow-sm">
                    <CardHeader className="border-b bg-gray-50/50">
                        <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-gray-500" /> การแจ้งเตือนล่าสุด</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                            <div className="bg-white p-3 rounded-full mb-3 shadow-sm border border-gray-100">
                                <Bell className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-gray-900 font-medium">ยังไม่มีการแจ้งเตือน</h3>
                            <p className="text-gray-500 text-sm mt-1 max-w-[250px]">เมื่อมีการประเมิน โน้ตหมอ หรือเหตุการณ์สำคัญ จะแสดงให้คุณเห็นที่นี่</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm bg-gradient-to-b from-white to-gray-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-gray-500" /> การตั้งค่าและอื่นๆ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/app/user-settings" className="flex items-center justify-between p-4 rounded-xl border bg-white hover:border-primary-300 hover:shadow-sm transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                    <Settings className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">จัดการบัญชี</p>
                                    <p className="text-xs text-gray-500">รหัสผ่าน, อีเมล, การแจ้งเตือน</p>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Link>
                        
                        <a href="tel:0828899994" className="flex items-center justify-between p-4 rounded-xl border bg-white hover:border-green-300 hover:shadow-sm transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                                    <ExternalLink className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">ติดต่อด่วน</p>
                                    <p className="text-xs text-gray-500">โทรหาเจ้าหน้าที่สาธารณสุข</p>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}