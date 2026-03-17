"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart as LineChartIcon, Plus, Save } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HealthRecord {
    date: string;
    weight: number;
    height: number;
}

const sampleData: HealthRecord[] = [
    { date: '2025-01', weight: 12.5, height: 88 },
    { date: '2025-03', weight: 13.0, height: 90 },
    { date: '2025-06', weight: 13.8, height: 93 },
    { date: '2025-09', weight: 14.5, height: 96 },
    { date: '2025-12', weight: 15.0, height: 98 },
];

export default function GrowthPage() {
    const [records, setRecords] = useState<HealthRecord[]>(sampleData);
    const [showForm, setShowForm] = useState(false);
    const [newRecord, setNewRecord] = useState({ date: '', weight: '', height: '' });
    const [saved, setSaved] = useState(false);

    const handleAdd = () => {
        if (newRecord.date && newRecord.weight && newRecord.height) {
            const rec: HealthRecord = {
                date: newRecord.date,
                weight: parseFloat(newRecord.weight),
                height: parseFloat(newRecord.height),
            };
            setRecords([...records, rec].sort((a, b) => a.date.localeCompare(b.date)));
            setNewRecord({ date: '', weight: '', height: '' });
            setShowForm(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none";

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
                        <button onClick={handleAdd}
                            className="mt-4 flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                            <Save className="h-4 w-4" /> บันทึก
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
