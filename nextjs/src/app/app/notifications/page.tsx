"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Check, Loader2, AlertCircle } from 'lucide-react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';

function getIconForType(type: string) {
    if (type.includes('brush') || type.includes('teeth')) return '🦷';
    if (type.includes('dental')) return '🏥';
    if (type.includes('weigh') || type.includes('height')) return '⚖️';
    if (type.includes('development')) return '📖';
    if (type.includes('appointment')) return '🏥';
    if (type.includes('system')) return '⚙️';
    if (type.includes('behavior')) return '🍎';
    if (type.includes('assessment')) return '📋';
    return '🔔';
}

export default function NotificationsPage() {
    const { user } = useGlobal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [notifications, setNotifications] = useState<any[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        
        async function fetchNotifications() {
            setLoading(true);
            try {
                const supabaseWrapper = await createSPASassClient();
                const supabase = supabaseWrapper.getSupabaseClient();
                
                const { data, error: fetchError } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user!.id)
                    .order('created_at', { ascending: false });
                    
                if (fetchError) throw fetchError;
                
                setNotifications(data || []);
            } catch (err: unknown) {
                console.error(err);
                setError("เกิดข้อผิดพลาดในการโหลดการแจ้งเตือน");
            } finally {
                setLoading(false);
            }
        }
        
        fetchNotifications();
    }, [user]);

    const markAsRead = async (id: string, is_read: boolean) => {
        if (is_read) return;
        try {
            const supabaseWrapper = await createSPASassClient();
            const supabase = supabaseWrapper.getSupabaseClient();
            
            const { error: updateError } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', id);
                
            if (updateError) throw updateError;
            
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err: unknown) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            const supabaseWrapper = await createSPASassClient();
            const supabase = supabaseWrapper.getSupabaseClient();
            
            const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
            if (unreadIds.length === 0) return;
            
            const { error: updateError } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .in('id', unreadIds);
                
            if (updateError) throw updateError;
            
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (err: unknown) {
            console.error(err);
        }
    };

    const filtered = filter === 'all' ? notifications :
        filter === 'unread' ? notifications.filter(n => !n.is_read) :
            notifications.filter(n => n.type === filter);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const filterButtons = [
        { key: 'all', label: 'ทั้งหมด' },
        { key: 'unread', label: `ยังไม่อ่าน (${unreadCount})` },
        { key: 'system', label: '⚙️ ระบบ' },
        { key: 'appointment', label: '🏥 นัดหมาย' },
        { key: 'reminder', label: '🔔 เตือนความจำ' },
    ];

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

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

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

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
                    {filtered.map(n => {
                        const icon = getIconForType(n.type);
                        const timeString = new Date(n.created_at).toLocaleDateString('th-TH', { 
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        });
                        return (
                            <Card key={n.id} className={`cursor-pointer transition-all hover:shadow-md ${!n.is_read ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''}`}
                                onClick={() => markAsRead(n.id, n.is_read)}>
                                <CardContent className="py-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{icon}</span>
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                                <h3 className={`font-medium ${!n.is_read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h3>
                                                <span className="text-xs text-gray-400">{timeString}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                                        </div>
                                        {!n.is_read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
