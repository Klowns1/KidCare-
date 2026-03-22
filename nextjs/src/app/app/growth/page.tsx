"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart as LineChartIcon, Plus, Save, Loader2, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';

interface HealthRecord {
    date: string;
    weight: number;
    height: number;
}

export default function GrowthPage() {
    const { user } = useGlobal();
    const [records, setRecords] = useState<HealthRecord[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newRecord, setNewRecord] = useState({ date: '', weight: '', height: '' });
    const [saved, setSaved] = useState(false);
    
    const [childId, setChildId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) return;
        
        async function loadData() {
            setLoading(true);
            try {
                const supabaseWrapper = await createSPASassClient();
                const supabase = supabaseWrapper.getSupabaseClient();
                
                const { data: childData, error: childError } = await supabase
                    .from('children')
                    .select('id')
                    .eq('parent_id', user!.id)
                    .order('created_at', { ascending: true })
                    .limit(1)
                    .maybeSingle();
                
                if (childError) throw childError;
                
                if (childData) {
                    setChildId(childData.id);
                    
                    const { data: recordsData, error: recordsError } = await supabase
                        .from('health_records')
                        .select('*')
                        .eq('child_id', childData.id)
                        .order('record_date', { ascending: true });
                        
                    if (recordsError) throw recordsError;
                    
                    if (recordsData) {
                        const loadedRecords = recordsData.map(d => ({
                            date: d.record_date,
                            weight: parseFloat(d.weight),
                            height: parseFloat(d.height)
                        }));
                        setRecords(loadedRecords);
                    }
                }
            } catch (err: unknown) {
                console.error(err);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            } finally {
                setLoading(false);
            }
        }
        
        loadData();
    }, [user]);

    const handleAdd = async () => {
        if (newRecord.date && newRecord.weight && newRecord.height && childId) {
            setSaving(true);
            setError('');
            try {
                const supabaseWrapper = await createSPASassClient();
                const supabase = supabaseWrapper.getSupabaseClient();
                
                const payload = {
                    child_id: childId,
                    record_date: newRecord.date,
                    weight: parseFloat(newRecord.weight),
                    height: parseFloat(newRecord.height)
                };
                
                const { error: insertError } = await supabase
                    .from('health_records')
                    .insert([payload]);
                    
                if (insertError) throw insertError;
                
                const rec: HealthRecord = {
                    date: newRecord.date,
                    weight: parseFloat(newRecord.weight),
                    height: parseFloat(newRecord.height),
                };
                
                setRecords(prev => [...prev, rec].sort((a, b) => a.date.localeCompare(b.date)));
                setNewRecord({ date: '', weight: '', height: '' });
                setShowForm(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } catch (err: unknown) {
                console.error(err);
                setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            } finally {
                setSaving(false);
            }
        }
    };

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none";

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
                    <LineChartIcon className="h-7 w-7 text-primary-600" />
                    <h1 className="text-2xl font-bold text-gray-900">กราฟการเจริญเติบโต</h1>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                    <Plus className="h-4 w-4" /> บันทึกข้อมูลใหม่
                </button>
            </div>

            {saved && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    ✅ บันทึกข้อมูลสำเร็จ!
                </div>
            )}

            {!childId && !loading && (
                <div className="p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium">ไม่พบข้อมูลเด็ก</p>
                        <p className="text-sm mt-1">กรุณาเพิ่มข้อมูลเด็กในหน้า Profile ก่อนใช้งานกราฟการเจริญเติบโต</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Add Record Form */}
            {showForm && (
                <Card className="border-2 border-primary-200">
                    <CardHeader className="bg-primary-50">
                        <CardTitle className="text-lg">บันทึกน้ำหนัก / ส่วนสูง</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
                                <input type="date" value={newRecord.date}
                                    onChange={e => setNewRecord({ ...newRecord, date: e.target.value })}
                                    className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">น้ำหนัก (กก.)</label>
                                <input type="number" step="0.1" value={newRecord.weight}
                                    onChange={e => setNewRecord({ ...newRecord, weight: e.target.value })}
                                    className={inputClass} placeholder="เช่น 15.5" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ส่วนสูง (ซม.)</label>
                                <input type="number" step="0.1" value={newRecord.height}
                                    onChange={e => setNewRecord({ ...newRecord, height: e.target.value })}
                                    className={inputClass} placeholder="เช่น 100" />
                            </div>
                        </div>
                        <button onClick={handleAdd} disabled={saving || !childId}
                            className="mt-4 flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4" />} 
                            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                        </button>
                    </CardContent>
                </Card>
            )}

            {/* Weight Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">📈 กราฟน้ำหนัก (กก.)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={records}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} name="น้ำหนัก (กก.)" dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Height Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">📏 กราฟส่วนสูง (ซม.)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={records}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="height" stroke="#16a34a" strokeWidth={2} name="ส่วนสูง (ซม.)" dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">📋 ข้อมูลที่บันทึก</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-4 py-2 text-left">วันที่</th>
                                    <th className="px-4 py-2 text-left">น้ำหนัก (กก.)</th>
                                    <th className="px-4 py-2 text-left">ส่วนสูง (ซม.)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">{r.date}</td>
                                        <td className="px-4 py-2">{r.weight}</td>
                                        <td className="px-4 py-2">{r.height}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
