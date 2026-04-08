"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart as LineChartIcon, Loader2, AlertCircle, Info, User } from 'lucide-react';
import Link from 'next/link';
import { 
    ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';
import { growthStandards, Gender } from '@/lib/data/growth-standards';

interface Child {
    id: string;
    gender: Gender;
    birth_date: string;
    weight: string;
    height: string;
}

interface ChildRecord {
    date: string;
    weight: number;
    height: number;
    month: number;
}

interface TableRow {
    date: string;
    weight: number;
    height: number;
}

// Compute dynamic class names using a plain function (no template literals in JSX)
function childTabClass(child: Child, selectedId: string | null): string {
    const base = 'flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all border shadow-sm';
    if (selectedId !== child.id) return base + ' border-gray-200 bg-white text-gray-600 hover:bg-gray-50';
    if (child.gender === 'male') return base + ' border-blue-600 bg-blue-600 text-white shadow-blue-200';
    return base + ' border-pink-500 bg-pink-500 text-white shadow-pink-200';
}

export default function GrowthPage() {
    const { user } = useGlobal();
    const [childrenInfo, setChildrenInfo] = useState<Child[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
    const [tableData, setTableData] = useState<TableRow[]>([]);
    const [childRecords, setChildRecords] = useState<ChildRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [childLoading, setChildLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasChildren, setHasChildren] = useState(false);

    useEffect(() => {
        if (!user) return;

        async function loadData() {
            setLoading(true);
            try {
                const supabaseWrapper = await createSPASassClient();
                const supabase = supabaseWrapper.getSupabaseClient();

                const { data: parentData } = await supabase
                    .from('parent_profiles')
                    .select('id')
                    .eq('user_id', user!.id)
                    .limit(1)
                    .maybeSingle();

                if (!parentData) { setHasChildren(false); setLoading(false); return; }

                const { data: childrenData, error: childError } = await supabase
                    .from('children')
                    .select('id, gender, birth_date, weight, height')
                    .eq('parent_id', parentData.id)
                    .order('created_at', { ascending: true });

                if (childError) throw childError;

                if (!childrenData || childrenData.length === 0) { setHasChildren(false); setLoading(false); return; }

                setHasChildren(true);
                setChildrenInfo(childrenData as Child[]);
                setSelectedChildId(childrenData[0].id);
            } catch (err: unknown) {
                console.error(err);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [user]);

    useEffect(() => {
        if (!selectedChildId || !user || childrenInfo.length === 0) return;

        async function loadChildRecords() {
            setChildLoading(true);
            try {
                const supabaseWrapper = await createSPASassClient();
                const supabase = supabaseWrapper.getSupabaseClient();

                const selectedChild = childrenInfo.find(c => c.id === selectedChildId);
                if (!selectedChild) return;

                const { data: records, error: recError } = await supabase
                    .from('health_records')
                    .select('*')
                    .eq('child_id', selectedChildId)
                    .order('record_date', { ascending: true });

                if (recError) throw recError;

                let allRaw: { date: string; weight: number; height: number }[] = [];

                if (selectedChild.birth_date && selectedChild.weight && selectedChild.height) {
                    allRaw.push({ date: selectedChild.birth_date, weight: parseFloat(selectedChild.weight), height: parseFloat(selectedChild.height) });
                }

                if (records) {
                    records.forEach(r => allRaw.push({ date: r.record_date, weight: parseFloat(r.weight), height: parseFloat(r.height) }));
                }

                allRaw = allRaw.sort((a, b) => a.date.localeCompare(b.date));

                const birthDate = new Date(selectedChild.birth_date);
                const recordsWithMonth: ChildRecord[] = allRaw.map(r => {
                    const rDate = new Date(r.date);
                    const diffDays = Math.max(0, Math.round((rDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)));
                    return { ...r, month: Math.round(diffDays / 30.4375) };
                });

                setChildRecords(recordsWithMonth);
                setTableData(allRaw);
            } catch(e) {
                console.error(e);
            } finally {
                setChildLoading(false);
            }
        }

        loadChildRecords();
    }, [selectedChildId, childrenInfo, user]);

    const activeChild = childrenInfo.find(c => c.id === selectedChildId);
    const isMale = activeChild?.gender === 'male';

    const getChartData = (type: 'weight' | 'height') => {
        if (!activeChild) return [];
        const stds = type === 'weight'
            ? growthStandards.weightForAge[activeChild.gender]
            : growthStandards.heightForAge[activeChild.gender];

        const maxChildMonth = childRecords.length > 0 ? childRecords[childRecords.length - 1].month : 0;
        const maxMonth = Math.min(60, Math.max(24, maxChildMonth + 3));

        return stds.slice(0, maxMonth + 1).map(std => {
            const childDataAtMonth = childRecords.find(r => r.month === std.month);
            return { ...std, childValue: childDataAtMonth ? childDataAtMonth[type] : undefined };
        });
    };

    const weightChartData = getChartData('weight');
    const heightChartData = getChartData('height');

    const colors = isMale
        ? { outer: '#c084fc', mid: '#93c5fd', inner: '#86efac', line: '#1d4ed8' }
        : { outer: '#f9a8d4', mid: '#fdba74', inner: '#86efac', line: '#be185d' };

    const headerClass = isMale ? 'border-b bg-blue-50/50' : 'border-b bg-pink-50/50';

    const tooltipStyle = { borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">

            <div className="flex items-center gap-3">
                <LineChartIcon className="h-7 w-7 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">กราฟการเจริญเติบโต</h1>
            </div>

            {hasChildren && childrenInfo.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {childrenInfo.map((child, idx) => (
                        <button
                            key={child.id}
                            onClick={() => setSelectedChildId(child.id)}
                            className={childTabClass(child, selectedChildId)}
                        >
                            <User className="h-4 w-4" />
                            <span>น้องคนที่ {idx + 1} ({child.gender === 'male' ? 'ชาย' : 'หญิง'})</span>
                        </button>
                    ))}
                </div>
            )}

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Info className="h-32 w-32" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        คู่มือวิธีอ่านกราฟตามมาตรฐาน WHO / กรมอนามัย
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800 space-y-4 relative z-10 leading-relaxed">
                    <p>พื้นหลังของกราฟแสดงเป็นแถบสีตามเกณฑ์มาตรฐาน <strong>แยกตามเพศ</strong> ของเด็กโดยอัตโนมัติ</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/60 p-4 rounded-xl border border-blue-100/50">
                            <strong className="block mb-2 text-blue-900 border-b border-blue-200 pb-1">ความหมายของแถบสี:</strong>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li><strong>แถบสีเขียว (กลาง):</strong> เกณฑ์มาตรฐาน Median — ปกติ</li>
                                <li><strong>แถบสีกลาง:</strong> บริเวณ -2 SD ถึง +2 SD — ยังอยู่ในเกณฑ์</li>
                                <li><strong>แถบสีนอกสุด:</strong> เกิน -3 SD หรือ +3 SD — ควรปรึกษาแพทย์</li>
                            </ul>
                        </div>
                        <div className="bg-white/60 p-4 rounded-xl border border-blue-100/50">
                            <strong className="block mb-2 text-blue-900 border-b border-blue-200 pb-1">วิธีสังเกตจุดของลูก:</strong>
                            <p>เส้นสีเข้มที่เชื่อมจุดต่างๆ คือข้อมูลจริงของลูก หากเส้นเติบโตขนานกับเส้นมาตรฐาน แสดงว่าพัฒนาการปกติ แม้ไม่ได้อยู่ตรงกลางเป๊ะก็ตาม</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {!hasChildren && (
                <div className="p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium">ยังไม่มีข้อมูลเด็ก</p>
                        <p className="text-sm mt-1 leading-relaxed">กรุณาเพิ่มข้อมูลเด็กในหน้า <Link href="/app/profile" className="font-bold underline text-orange-900 hover:text-orange-700">โปรไฟล์</Link> ก่อนนะคะ</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {hasChildren && activeChild && (
                <>
                    {childLoading && (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-7 w-7 animate-spin text-primary-600 mr-2" />
                            <span className="text-gray-500">กำลังโหลดข้อมูล</span>
                        </div>
                    )}

                    {!childLoading && (
                        <>
                            <Card className="overflow-hidden">
                                <CardHeader className={headerClass}>
                                    <CardTitle className="text-lg">
                                        น้ำหนักตามเกณฑ์อายุ (กก.)
                                        <span className="ml-2 text-sm font-normal text-gray-500">
                                            {isMale ? '— เด็กชาย' : '— เด็กหญิง'}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-6 pb-4">
                                    <ResponsiveContainer width="100%" height={380}>
                                        <ComposedChart data={weightChartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="month" label={{ value: 'อายุ (เดือน)', position: 'insideBottom', offset: -12 }} tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={tooltipStyle}
                                                labelFormatter={(val) => 'อายุ ' + String(val) + ' เดือน'}
                                                formatter={(value, name) => {
                                                    if (name === 'น้ำหนักลูก') return [String(value) + ' กก.', name];
                                                    return [value, name];
                                                }}
                                            />
                                            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />
                                            <Area type="monotone" dataKey="sd3pos" fill={colors.outer} stroke="none" fillOpacity={0.5} name="+3 SD" legendType="none" />
                                            <Area type="monotone" dataKey="sd2pos" fill={colors.mid} stroke="none" fillOpacity={0.7} name="+2 SD" legendType="none" />
                                            <Area type="monotone" dataKey="median" fill={colors.inner} stroke={colors.inner} strokeWidth={1.5} fillOpacity={0.9} name="เกณฑ์กลาง (Median)" legendType="square" />
                                            <Area type="monotone" dataKey="sd2neg" fill={colors.mid} stroke="none" fillOpacity={0.7} name="-2 SD" legendType="none" />
                                            <Area type="monotone" dataKey="sd3neg" fill={colors.outer} stroke="none" fillOpacity={0.5} name="-3 SD" legendType="none" />
                                            <Line type="monotone" dataKey="childValue" name="น้ำหนักลูก" stroke={colors.line} strokeWidth={4} dot={{ r: 5, fill: colors.line, stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 8 }} connectNulls />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                                <CardHeader className={headerClass}>
                                    <CardTitle className="text-lg">
                                        ส่วนสูงตามเกณฑ์อายุ (ซม.)
                                        <span className="ml-2 text-sm font-normal text-gray-500">
                                            {isMale ? '— เด็กชาย' : '— เด็กหญิง'}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-6 pb-4">
                                    <ResponsiveContainer width="100%" height={380}>
                                        <ComposedChart data={heightChartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="month" label={{ value: 'อายุ (เดือน)', position: 'insideBottom', offset: -12 }} tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} domain={['dataMin - 5', 'dataMax + 5']} />
                                            <Tooltip
                                                contentStyle={tooltipStyle}
                                                labelFormatter={(val) => 'อายุ ' + String(val) + ' เดือน'}
                                                formatter={(value, name) => {
                                                    if (name === 'ส่วนสูงลูก') return [String(value) + ' ซม.', name];
                                                    return [value, name];
                                                }}
                                            />
                                            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />
                                            <Area type="monotone" dataKey="sd3pos" fill={colors.outer} stroke="none" fillOpacity={0.5} name="+3 SD" legendType="none" />
                                            <Area type="monotone" dataKey="sd2pos" fill={colors.mid} stroke="none" fillOpacity={0.7} name="+2 SD" legendType="none" />
                                            <Area type="monotone" dataKey="median" fill={colors.inner} stroke={colors.inner} strokeWidth={1.5} fillOpacity={0.9} name="เกณฑ์กลาง (Median)" legendType="square" />
                                            <Area type="monotone" dataKey="sd2neg" fill={colors.mid} stroke="none" fillOpacity={0.7} name="-2 SD" legendType="none" />
                                            <Area type="monotone" dataKey="sd3neg" fill={colors.outer} stroke="none" fillOpacity={0.5} name="-3 SD" legendType="none" />
                                            <Line type="monotone" dataKey="childValue" name="ส่วนสูงลูก" stroke={colors.line} strokeWidth={4} dot={{ r: 5, fill: colors.line, stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 8 }} connectNulls />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        ข้อมูลที่บันทึก
                        {activeChild && (
                            <span className="ml-2 text-sm font-normal text-gray-500">
                                ({isMale ? 'เด็กชาย' : 'เด็กหญิง'})
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {tableData.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-6">ยังไม่มีข้อมูลที่บันทึก</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="px-4 py-2 text-left">วันที่บันทึก</th>
                                        <th className="px-4 py-2 text-left">น้ำหนัก (กก.)</th>
                                        <th className="px-4 py-2 text-left">ส่วนสูง (ซม.)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((r, idx) => (
                                        <tr key={idx} className="border-b hover:bg-gray-50">
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
