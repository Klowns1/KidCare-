"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Check } from 'lucide-react';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    time: string;
    is_read: boolean;
    icon: string;
}

const initialNotifications: Notification[] = [
    { id: 1, type: 'brush_teeth', title: 'แจ้งเตือนแปรงฟัน', message: 'ถึงเวลาแปรงฟันก่อนนอนให้ลูกแล้วค่ะ อย่าลืมใช้ยาสีฟันฟลูออไรด์', time: '20:00', is_read: false, icon: '🦷' },
    { id: 2, type: 'dental_checkup', title: 'แจ้งเตือนตรวจฟัน', message: 'ครบกำหนด 6 เดือน ควรพาเด็กไปพบทันตแพทย์', time: 'ครบกำหนดวันนี้', is_read: false, icon: '🏥' },
    { id: 3, type: 'weigh_in', title: 'แจ้งเตือนชั่งน้ำหนัก', message: 'ถึงเวลาบันทึกน้ำหนักและส่วนสูงประจำเดือนแล้วค่ะ', time: 'ประจำเดือน', is_read: false, icon: '⚖️' },
    { id: 4, type: 'development', title: 'แจ้งเตือนกิจกรรมพัฒนาการ', message: 'วันนี้ลองอ่านนิทานให้ลูกฟังสัก 15 นาที เพื่อส่งเสริมพัฒนาการด้านภาษา', time: 'ทุกวัน', is_read: false, icon: '📖' },
    { id: 5, type: 'brush_teeth', title: 'แจ้งเตือนแปรงฟันเช้า', message: 'ถึงเวลาแปรงฟันตอนเช้าให้ลูกค่ะ', time: '07:00', is_read: true, icon: '🦷' },
    { id: 6, type: 'development', title: 'แจ้งเตือนเล่นกับเด็ก', message: 'ชวนลูกเล่นต่อบล็อกหรือระบายสี เพื่อพัฒนากล้ามเนื้อมัดเล็ก', time: 'ทุกวัน', is_read: true, icon: '🧩' },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [filter, setFilter] = useState<string>('all');

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    };

    const filtered = filter === 'all' ? notifications :
        filter === 'unread' ? notifications.filter(n => !n.is_read) :
            notifications.filter(n => n.type === filter);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const filterButtons = [
        { key: 'all', label: 'ทั้งหมด' },
        { key: 'unread', label: `ยังไม่อ่าน (${unreadCount})` },
        { key: 'brush_teeth', label: '🦷 แปรงฟัน' },
        { key: 'dental_checkup', label: '🏥 ตรวจฟัน' },
        { key: 'weigh_in', label: '⚖️ ชั่งน้ำหนัก' },
        { key: 'development', label: '📖 พัฒนาการ' },
    ];

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Bell className="h-7 w-7 text-primary-600" />
                    <h1 className="text-2xl font-bold text-gray-900">การแจ้งเตือน</h1>
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{unreadCount}</span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50">
                        <Check className="h-4 w-4" /> อ่านทั้งหมด
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {filterButtons.map(fb => (
                    <button key={fb.key} onClick={() => setFilter(fb.key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                            ${filter === fb.key ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}>
                        {fb.label}
                    </button>
                ))}
            </div>

            {/* Notification List */}
            {filtered.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-gray-500">
                        ไม่มีการแจ้งเตือน
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {filtered.map(n => (
                        <Card key={n.id} className={`cursor-pointer transition-all hover:shadow-md ${!n.is_read ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''}`}
                            onClick={() => markAsRead(n.id)}>
                            <CardContent className="py-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{n.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className={`font-medium ${!n.is_read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h3>
                                            <span className="text-xs text-gray-400">{n.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                                    </div>
                                    {!n.is_read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
