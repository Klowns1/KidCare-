"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Save, Calendar, CheckSquare, Loader2, AlertCircle } from 'lucide-react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';

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
    const { user } = useGlobal();
    const [entry, setEntry] = useState<BehaviorEntry>(defaultEntry);
    const [logs, setLogs] = useState<BehaviorEntry[]>([]);
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
                
                // Fetch first child
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
                    // Fetch logs
                    const { data: logData, error: logError } = await supabase
                        .from('behavior_logs')
                        .select('*')
                        .eq('child_id', childData.id)
                        .order('log_date', { ascending: false });
                        
                    if (logError) throw logError;
                    
                    if (logData && logData.length > 0) {
                        const loadedLogs = logData.map(d => ({
                            date: d.log_date,
                            meals_3_per_day: d.meals_3_per_day,
                            fruits_vegetables: d.fruits_vegetables,
                            breakfast: d.breakfast,
                            processed_food: d.processed_food,
                            brushed_teeth: d.brushed_teeth,
                            dental_checkup: d.dental_checkup,
                            bottle_before_bed: d.bottle_before_bed,
                            read_stories: d.read_stories,
                            played_with_child: d.played_with_child,
                            self_help_training: d.self_help_training,
                            praised_child: d.praised_child,
                            notes: d.notes || ''
                        }));
                        setLogs(loadedLogs);
                        
                        // Check if today's log exists
                        const today = new Date().toISOString().split('T')[0];
                        const todayLog = loadedLogs.find(l => l.date === today);
                        if (todayLog) setEntry(todayLog);
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

    const toggleItem = (key: keyof BehaviorEntry) => {
        setEntry({ ...entry, [key]: !entry[key] });
    };

    const handleSave = async () => {
        if (!user || !childId) {
            setError("ไม่สามารถบันทึกได้เนื่องจากไม่พบข้อมูลเด็ก");
            return;
        }
        setSaving(true);
        setError('');
        try {
            const supabaseWrapper = await createSPASassClient();
            const supabase = supabaseWrapper.getSupabaseClient();
            
            const payload = {
                child_id: childId,
                log_date: entry.date,
                meals_3_per_day: entry.meals_3_per_day,
                fruits_vegetables: entry.fruits_vegetables,
                breakfast: entry.breakfast,
                processed_food: entry.processed_food,
                brushed_teeth: entry.brushed_teeth,
                dental_checkup: entry.dental_checkup,
                bottle_before_bed: entry.bottle_before_bed,
                read_stories: entry.read_stories,
                played_with_child: entry.played_with_child,
                self_help_training: entry.self_help_training,
                praised_child: entry.praised_child,
                notes: entry.notes || null
            };

            const { data: existing, error: findError } = await supabase
                .from('behavior_logs')
                .select('id')
                .eq('child_id', childId)
                .eq('log_date', entry.date)
                .maybeSingle();
                
            if (findError) throw findError;
            
            if (existing) {
                const { error: updateError } = await supabase
                    .from('behavior_logs')
                    .update(payload)
                    .eq('id', existing.id);
                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('behavior_logs')
                    .insert([payload]);
                if (insertError) throw insertError;
            }
            
            const filteredLogs = logs.filter(l => l.date !== entry.date);
            setLogs([entry, ...filteredLogs].sort((a,b) => b.date.localeCompare(a.date)));
            
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setSaving(false);
        }
    };

    const completedCount = sections.reduce((sum, s) =>
        sum + s.items.filter(i => entry[i.key as keyof BehaviorEntry] === true).length, 0);
    const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);

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
                <Activity className="h-7 w-7 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">บันทึกพฤติกรรมการเลี้ยงดู</h1>
            </div>

            {/* Date */}
            {!childId && !loading && (
                <div className="p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg flex gap-3 mb-4">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium">ไม่พบข้อมูลเด็ก</p>
                        <p className="text-sm mt-1">กรุณาเพิ่มข้อมูลเด็กในหน้า Profile ก่อนเริ่มการบันทึกพฤติกรรม</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex gap-3 mb-4">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

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
                            const checked = entry[item.key as keyof BehaviorEntry] === true;
                            return (
                                <button key={item.key} onClick={() => toggleItem(item.key as keyof BehaviorEntry)}
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
            <button onClick={handleSave} disabled={saving || !childId}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed">
                {saving ? <Loader2 className="h-5 w-5 animate-spin"/> : <Save className="h-5 w-5" />} 
                {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลวันนี้'}
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
                            const done = sections.reduce((s, sec) => s + sec.items.filter(i => log[i.key as keyof BehaviorEntry] === true).length, 0);
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
