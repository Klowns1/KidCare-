"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Save, Calendar, CheckSquare } from 'lucide-react';

interface BehaviorEntry {
    date: string;
    // โภชนาการ
    meals_3_per_day: boolean;
    fruits_vegetables: boolean;
    breakfast: boolean;
    processed_food: boolean;
    // สุขภาพฟัน
    brushed_teeth: boolean;
    dental_checkup: boolean;
    bottle_before_bed: boolean;
    // พัฒนาการ
    read_stories: boolean;
    played_with_child: boolean;
    self_help_training: boolean;
    praised_child: boolean;
    notes: string;
}

const defaultEntry: BehaviorEntry = {
    date: new Date().toISOString().split('T')[0],
    meals_3_per_day: false, fruits_vegetables: false, breakfast: false, processed_food: false,
    brushed_teeth: false, dental_checkup: false, bottle_before_bed: false,
    read_stories: false, played_with_child: false, self_help_training: false, praised_child: false,
    notes: '',
};

const sections = [
    {
        title: '🍎 ด้านโภชนาการ',
        color: 'border-orange-200',
        bgColor: 'bg-orange-50',
        items: [
            { key: 'meals_3_per_day', label: 'เด็กกินอาหารครบ 3 มื้อ' },
            { key: 'fruits_vegetables', label: 'เด็กกินผักผลไม้' },
            { key: 'breakfast', label: 'เด็กกินอาหารเช้า' },
            { key: 'processed_food', label: 'เด็กกินอาหารสำเร็จรูป (ถ้าใช่ = ควรลด)' },
        ]
    },
    {
        title: '🦷 ด้านสุขภาพฟัน',
        color: 'border-blue-200',
        bgColor: 'bg-blue-50',
        items: [
            { key: 'brushed_teeth', label: 'แปรงฟันให้เด็ก' },
            { key: 'dental_checkup', label: 'พาตรวจฟัน' },
            { key: 'bottle_before_bed', label: 'ดูดขวดนมก่อนนอน (ถ้าใช่ = ควรเลิก)' },
        ]
    },
    {
        title: '🧒 ด้านพัฒนาการ',
        color: 'border-purple-200',
        bgColor: 'bg-purple-50',
        items: [
            { key: 'read_stories', label: 'อ่านนิทานให้เด็กฟัง' },
            { key: 'played_with_child', label: 'เล่นกับเด็ก' },
            { key: 'self_help_training', label: 'ฝึกให้เด็กช่วยเหลือตนเอง' },
            { key: 'praised_child', label: 'ชมเชยเด็ก' },
        ]
    }
];

export default function BehaviorPage() {
    const [entry, setEntry] = useState<BehaviorEntry>(defaultEntry);
    const [logs, setLogs] = useState<BehaviorEntry[]>([]);
    const [saved, setSaved] = useState(false);

    const toggleItem = (key: string) => {
        setEntry({ ...entry, [key]: !(entry as Record<string, boolean | string>)[key] });
    };

    const handleSave = () => {
        setLogs([entry, ...logs]);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const completedCount = sections.reduce((sum, s) =>
        sum + s.items.filter(i => (entry as Record<string, boolean | string>)[i.key] === true).length, 0);
    const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-3">
                <Activity className="h-7 w-7 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">บันทึกพฤติกรรมการเลี้ยงดู</h1>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <input type="date" value={entry.date}
                    onChange={e => setEntry({ ...entry, date: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                <span className="text-sm text-gray-500">ทำเครื่องหมาย ✓ สิ่งที่ทำในวันนี้</span>
            </div>

            {/* Progress */}
            <div className="bg-primary-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-primary-700 font-medium">ความก้าวหน้า</span>
                    <span className="text-primary-700">{completedCount} / {totalItems}</span>
                </div>
                <div className="w-full bg-primary-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${(completedCount / totalItems) * 100}%` }} />
                </div>
            </div>

            {/* Sections */}
            {sections.map((section, sIdx) => (
                <Card key={sIdx} className={`border ${section.color}`}>
                    <CardHeader className={section.bgColor + " rounded-t-lg"}>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2">
                        {section.items.map(item => {
                            const checked = (entry as Record<string, boolean | string>)[item.key] === true;
                            return (
                                <button key={item.key} onClick={() => toggleItem(item.key)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left
                                        ${checked ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                    <CheckSquare className={`h-5 w-5 flex-shrink-0 ${checked ? 'text-green-600' : 'text-gray-300'}`} />
                                    <span className={`text-sm ${checked ? 'text-green-800 font-medium' : 'text-gray-700'}`}>{item.label}</span>
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>
            ))}

            {/* Notes */}
            <Card>
                <CardContent className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">บันทึกเพิ่มเติม</label>
                    <textarea value={entry.notes} onChange={e => setEntry({ ...entry, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-20"
                        placeholder="รายละเอียดเพิ่มเติม..." />
                </CardContent>
            </Card>

            {/* Save */}
            <button onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                <Save className="h-5 w-5" /> บันทึกข้อมูลวันนี้
            </button>
            {saved && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    ✅ บันทึกสำเร็จ!
                </div>
            )}

            {/* History */}
            {logs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">📋 ประวัติการบันทึก</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {logs.map((log, idx) => {
                            const done = sections.reduce((s, sec) => s + sec.items.filter(i => (log as Record<string, boolean | string>)[i.key] === true).length, 0);
                            return (
                                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                                    <span className="text-sm text-gray-700">{log.date}</span>
                                    <span className="text-sm font-medium text-primary-600">{done}/{totalItems} รายการ</span>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
