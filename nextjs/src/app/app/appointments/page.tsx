"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock, FileText, Plus, Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';

export default function AppointmentsPage() {
    const { user } = useGlobal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // Form state
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!user) return;

        async function fetchAppointments() {
            setLoading(true);
            setError('');
            try {
                const supabaseWrapper = await createSPASassClient();
                const supabase = supabaseWrapper.getSupabaseClient();
                const { data, error: fetchError } = await supabase
                    .from('appointments')
                    .select('*')
                    .eq('user_id', user!.id)
                    .order('appointment_date', { ascending: true })
                    .order('appointment_time', { ascending: true });

                if (fetchError) {
                    console.error("Supabase Fetch Error (Appointments):", JSON.stringify(fetchError));
                    throw new Error(fetchError.message || "Failed to fetch");
                }
                setAppointments(data || []);
            } catch (err: unknown) {
                console.error(err);
                setError('ไม่สามารถดึงข้อมูลนัดหมายได้');
            } finally {
                setLoading(false);
            }
        }

        fetchAppointments();
    }, [user]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user || !date || !time || !reason) return;
        setSaving(true);
        try {
            const supabaseWrapper = await createSPASassClient();
            const supabase = supabaseWrapper.getSupabaseClient();
            const { data, error: insertError } = await supabase
                .from('appointments')
                .insert([{
                    user_id: user.id,
                    appointment_date: date,
                    appointment_time: time,
                    reason: reason,
                    status: 'pending'
                }])
                .select()
                .maybeSingle();
                
            if (insertError) {
                console.error("Supabase Insert Error (Appointments):", JSON.stringify(insertError));
                throw new Error(insertError.message || "Failed to insert");
            }
            
            if (data) {
                setAppointments([...appointments, data].sort((a,b) => {
                    const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
                    const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
                    return dateA.getTime() - dateB.getTime();
                }));
            }
            setDate('');
            setTime('');
            setReason('');
        } catch (err: unknown) {
            console.error(err);
            setError('เกิดข้อผิดพลาดในการบันทึกนัดหมาย');
        } finally {
            setSaving(false);
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"><Clock className="w-3 h-3"/> รอการยืนยัน</span>;
            case 'confirmed': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> ยืนยันแล้ว</span>;
            case 'cancelled': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3"/> ยกเลิก</span>;
            case 'completed': return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> เสร็จสิ้น</span>;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-primary-600" /> นัดหมาย
            </h1>
            
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">ทำการนัดหมายใหม่</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
                                <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500 text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">เวลา</label>
                                <input type="time" required value={time} onChange={e => setTime(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500 text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">เหตุผลที่นัด</label>
                                <textarea required value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="เช่น ปรึกษาพัฒนาการเด็ก, ตรวจฟัน"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500 text-black" />
                            </div>
                            <button type="submit" disabled={saving || !date || !time || !reason}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} ยืนยันการนัด
                            </button>
                        </form>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-4">
                    <h3 className="font-semibold text-gray-800 text-lg">รายการนัดหมายของคุณ</h3>
                    {appointments.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-gray-500 flex flex-col items-center">
                                <CalendarIcon className="w-12 h-12 text-gray-300 mb-3" />
                                คุณยังไม่มีรายการนัดหมาย
                            </CardContent>
                        </Card>
                    ) : (
                        appointments.map(app => (
                            <Card key={app.id} className="overflow-hidden">
                                <div className="border-l-4 border-l-primary-500 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium text-gray-900">
                                                {new Date(app.appointment_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                            <Clock className="w-4 h-4 text-gray-500 ml-2" />
                                            <span className="text-sm font-medium text-gray-700">{app.appointment_time.slice(0,5)} น.</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-sm text-gray-600">
                                            <FileText className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                                            <p>{app.reason}</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto h-full gap-2">
                                        {getStatusBadge(app.status)}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
