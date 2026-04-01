"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart as LineChartIcon, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';

const CHILD_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#be185d'];

function getChildLabel(child: { gender: string; birth_date: string }) {
    const genderText = child.gender === 'male' ? 'เด็กชาย' : child.gender === 'female' ? 'เด็กหญิง' : 'เด็ก';
    const birthDate = child.birth_date
        ? new Date(child.birth_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
        : '';
    return `${genderText} (${birthDate})`;
}

export default function GrowthPage() {
    const { user } = useGlobal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [childrenInfo, setChildrenInfo] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [weightChartData, setWeightChartData] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [heightChartData, setHeightChartData] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tableData, setTableData] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hasChildren, setHasChildren] = useState(false);

    useEffect(() => {
        if (!user) return;

        async function loadData() {
            setLoading(true);
            try {
                const supabaseWrapper = await createSPASassClient();
                const supabase = supabaseWrapper.getSupabaseClient();

                // Fetch parent
                const { data: parentData } = await supabase
                    .from('parent_profiles')
                    .select('id')
                    .eq('user_id', user!.id)
                    .limit(1)
                    .maybeSingle();

                if (!parentData) {
                    setHasChildren(false);
                    setLoading(false);
                    return;
                }

                // Fetch ALL children
                const { data: childrenData, error: childError } = await supabase
                    .from('children')
                    .select('id, gender, birth_date, weight, height')
                    .eq('parent_id', parentData.id)
                    .order('created_at', { ascending: true });

                if (childError) throw childError;

                if (!childrenData || childrenData.length === 0) {
                    setHasChildren(false);
                    setLoading(false);
                    return;
                }

                setHasChildren(true);
                setChildrenInfo(childrenData);

                // Collect records for ALL children
                const allDates = new Set<string>();
                const childRecordsMap: Record<string, Record<string, { weight: number; height: number }>> = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const tableRows: any[] = [];

                for (const child of childrenData) {
                    childRecordsMap[child.id] = {};
                    const label = getChildLabel(child);

                    // Add profile weight/height as initial data point
                    if (child.birth_date && child.weight && child.height) {
                        childRecordsMap[child.id][child.birth_date] = {
                            weight: parseFloat(child.weight),
                            height: parseFloat(child.height)
                        };
                        allDates.add(child.birth_date);
                        tableRows.push({
                            childLabel: label,
                            date: child.birth_date,
                            weight: parseFloat(child.weight),
                            height: parseFloat(child.height)
                        });
                    }

                    // Fetch health_records for this child
                    const { data: records, error: recError } = await supabase
                        .from('health_records')
                        .select('*')
                        .eq('child_id', child.id)
                        .order('record_date', { ascending: true });

                    if (recError) throw recError;

                    if (records) {
                        records.forEach(r => {
                            if (!childRecordsMap[child.id][r.record_date]) {
                                childRecordsMap[child.id][r.record_date] = {
                                    weight: parseFloat(r.weight),
                                    height: parseFloat(r.height)
                                };
                                allDates.add(r.record_date);
                                tableRows.push({
                                    childLabel: label,
                                    date: r.record_date,
                                    weight: parseFloat(r.weight),
                                    height: parseFloat(r.height)
                                });
                            }
                        });
                    }
                }

                // Build merged chart data arrays
                const sortedDates = Array.from(allDates).sort();

                const wData = sortedDates.map(date => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const entry: any = { date };
                    childrenData.forEach(child => {
                        const lbl = getChildLabel(child);
                        const rec = childRecordsMap[child.id]?.[date];
                        if (rec) entry[lbl] = rec.weight;
                    });
                    return entry;
                });

                const hData = sortedDates.map(date => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const entry: any = { date };
                    childrenData.forEach(child => {
                        const lbl = getChildLabel(child);
                        const rec = childRecordsMap[child.id]?.[date];
                        if (rec) entry[lbl] = rec.height;
                    });
                    return entry;
                });

                setWeightChartData(wData);
                setHeightChartData(hData);
                setTableData(tableRows.sort((a, b) => a.date.localeCompare(b.date)));

            } catch (err: unknown) {
                console.error(err);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [user]);

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
            </div>

            {!hasChildren && !loading && (
                <div className="p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium">ยังไม่มีข้อมูลเด็ก</p>
                        <p className="text-sm mt-1 leading-relaxed">กรุณาเพิ่มข้อมูลเด็กในหน้า <Link href="/app/profile" className="font-bold underline text-orange-900 hover:text-orange-700">โปรไฟล์</Link> ก่อนคะ/ครับ</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Weight Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">กราฟน้ำหนัก (กก.)</CardTitle>
                </CardHeader>
                <CardContent>
                    {weightChartData.length === 0 ? (
                        <div className="h-[300px] flex flex-col items-center justify-center text-gray-500 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                            <LineChartIcon className="h-10 w-10 text-gray-300 mb-3" />
                            <p className="font-bold text-gray-600">ยังไม่มีข้อมูลน้ำหนัก</p>
                            <p className="text-sm mt-1">ตั้งค่าน้ำหนักเริ่มต้นได้จากแท็บ <Link href="/app/profile" className="font-bold underline text-primary-600 mx-1">โปรไฟล์ข้อมูลลูกน้อย</Link></p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={weightChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                {childrenInfo.map((child, idx) => (
                                    <Line
                                        key={child.id}
                                        type="monotone"
                                        dataKey={getChildLabel(child)}
                                        stroke={CHILD_COLORS[idx % CHILD_COLORS.length]}
                                        strokeWidth={3}
                                        activeDot={{ r: 6 }}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        connectNulls
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Height Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">กราฟส่วนสูง (ซม.)</CardTitle>
                </CardHeader>
                <CardContent>
                    {heightChartData.length === 0 ? (
                        <div className="h-[300px] flex flex-col items-center justify-center text-gray-500 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                            <LineChartIcon className="h-10 w-10 text-gray-300 mb-3" />
                            <p className="font-bold text-gray-600">ยังไม่มีข้อมูลส่วนสูง</p>
                            <p className="text-sm mt-1">ตั้งค่าส่วนสูงเริ่มต้นได้จากแท็บ <Link href="/app/profile" className="font-bold underline text-primary-600 mx-1">โปรไฟล์ข้อมูลลูกน้อย</Link></p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={heightChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                {childrenInfo.map((child, idx) => (
                                    <Line
                                        key={child.id}
                                        type="monotone"
                                        dataKey={getChildLabel(child)}
                                        stroke={CHILD_COLORS[idx % CHILD_COLORS.length]}
                                        strokeWidth={3}
                                        activeDot={{ r: 6 }}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        connectNulls
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">ข้อมูลที่บันทึก</CardTitle>
                </CardHeader>
                <CardContent>
                    {tableData.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-6">ยังไม่มีข้อมูลที่บันทึก</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="px-4 py-2 text-left">เด็ก</th>
                                        <th className="px-4 py-2 text-left">วันที่</th>
                                        <th className="px-4 py-2 text-left">น้ำหนัก (กก.)</th>
                                        <th className="px-4 py-2 text-left">ส่วนสูง (ซม.)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((r, idx) => (
                                        <tr key={idx} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-2 font-medium">{r.childLabel}</td>
                                            <td className="px-4 py-2">{r.date}</td>
                                            <td className="px-4 py-2">{r.weight}</td>
                                            <td className="px-4 py-2">{r.height}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
